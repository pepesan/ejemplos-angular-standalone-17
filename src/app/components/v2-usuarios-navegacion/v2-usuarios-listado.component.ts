import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounce, form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, firstValueFrom, map, of, startWith, switchMap } from 'rxjs';
import { ConsultaUsuarios, ErrorApi, PaginaUsuarios, Usuario, UsuariosApiService } from '../../services/usuarios-api.service';
import { AvisoSinBackendComponent } from './aviso-sin-backend.component';
import { ConfirmarBorradoComponent } from './confirmar-borrado.component';
import { RUTA_BASE } from './ruta-base';
import { SesionUsuariosService } from './sesion-usuarios.service';
import { esSinBackend } from './sin-backend';
import { UsuariosAvisosService } from './usuarios-avisos.service';

type Estado =
  | { status: 'cargando' }
  | { status: 'ok'; pagina: PaginaUsuarios }
  | { status: 'error'; mensaje: string; sinBackend: boolean };

const TAMANO = 5;

/**
 * Listado: el filtro y la página viven en la URL (`?q=ana&page=2`) y llegan como `input()`. La URL es la fuente de
 * verdad: se puede compartir, recargar y volver atrás. Cada cambio de URL vuelve a consultar al servidor y
 * `switchMap` cancela la petición anterior si aún no ha terminado.
 */
@Component({
  selector: 'app-v2-usuarios-listado',
  imports: [FormField, RouterLink, AvisoSinBackendComponent, ConfirmarBorradoComponent],
  templateUrl: './v2-usuarios-listado.component.html',
  styleUrl: './usuarios-navegacion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2UsuariosListadoComponent {
  private readonly api = inject(UsuariosApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly sesion = inject(SesionUsuariosService);
  private readonly avisos = inject(UsuariosAvisosService);
  readonly base = RUTA_BASE;

  // --- Estado que llega de la URL (query params → input()). Sin parámetro, el input recibe `undefined`. ---
  readonly q = input('', { transform: (valor: string | undefined) => (valor ?? '').trim() });
  readonly page = input(1, { transform: (valor: unknown) => Math.max(1, Math.floor(Number(valor)) || 1) });
  /** `?denegado=1` lo añade `adminGuard` al redirigir a quien no es admin. */
  readonly denegado = input<string | undefined>();

  // --- Filtro: un Signal Form cuyo valor se sincroniza (con retardo) con la URL ---
  /** `linkedSignal`: escribible, pero se reinicia con el valor de la URL cuando esta cambia (p. ej. «atrás»). */
  readonly modeloFiltro = linkedSignal(() => ({ q: this.q() }));
  readonly formularioFiltro = form(this.modeloFiltro, (ruta) => {
    // El valor tarda 300 ms en pasar al modelo: no se consulta al servidor en cada tecla.
    debounce(ruta.q, 300);
  });

  // --- Listado ---
  private readonly version = signal(0);
  private readonly consulta = computed<ConsultaUsuarios>(() => ({ q: this.q(), page: this.page(), size: TAMANO, sort: 'id', dir: 'asc' }));
  readonly estado = toSignal(
    toObservable(computed(() => ({ consulta: this.consulta(), version: this.version() }))).pipe(
      switchMap(({ consulta }) =>
        this.api.listar(consulta).pipe(
          map((pagina): Estado => this.aEstado(pagina, consulta)),
          startWith<Estado>({ status: 'cargando' }),
          catchError((error: ErrorApi) => of(this.aError(error))),
        ),
      ),
    ),
    { initialValue: { status: 'cargando' } as Estado },
  );
  readonly totalPaginas = computed(() => {
    const e = this.estado();
    return e.status === 'ok' ? Math.max(Math.ceil(e.pagina.total / e.pagina.size), 1) : 1;
  });
  readonly rango = computed(() => {
    const e = this.estado();
    if (e.status !== 'ok' || e.pagina.total === 0) return '';
    const { page, size, items, total } = e.pagina;
    return `${(page - 1) * size + 1}–${(page - 1) * size + items.length} de ${total}`;
  });

  // --- Borrado en modal ---
  readonly aBorrar = signal<Usuario | null>(null);
  readonly eliminando = signal(false);
  readonly errorBorrado = signal<string | null>(null);

  constructor() {
    // Cuando el filtro cambia (ya con el retardo aplicado) se actualiza la URL; el listado se recarga solo porque
    // la URL cambia el input `q`. Se vuelve a la página 1.
    toObservable(computed(() => this.modeloFiltro().q.trim()))
      .pipe(takeUntilDestroyed())
      .subscribe((texto) => {
        if (texto === this.q()) return;
        void this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: texto || null, page: null },
          queryParamsHandling: 'merge',
        });
      });
  }

  private aEstado(pagina: PaginaUsuarios, consulta: ConsultaUsuarios): Estado {
    // Si se borró el último elemento de la última página, se retrocede una página.
    if (pagina.items.length === 0 && pagina.total > 0 && consulta.page > 1) {
      void this.router.navigate([], { relativeTo: this.route, queryParams: { page: consulta.page - 1 }, queryParamsHandling: 'merge' });
      return { status: 'cargando' };
    }
    return { status: 'ok', pagina };
  }

  private aError(error: ErrorApi): Estado {
    // 401: el token ha caducado (vive 15 min) → volver al login recordando dónde estaba el usuario.
    if (error.estado === 401) void this.sesion.caducada(this.router.url);
    return { status: 'error', mensaje: error.message, sinBackend: esSinBackend(error) };
  }

  reintentar(): void {
    this.version.update((v) => v + 1);
  }

  pedirBorrado(usuario: Usuario): void {
    this.errorBorrado.set(null);
    this.aBorrar.set(usuario);
  }

  cancelarBorrado(): void {
    this.aBorrar.set(null);
    this.errorBorrado.set(null);
  }

  async eliminar(): Promise<void> {
    const usuario = this.aBorrar();
    if (!usuario) return;
    this.eliminando.set(true);
    this.errorBorrado.set(null);
    try {
      await firstValueFrom(this.api.eliminar(usuario.id));
      this.aBorrar.set(null);
      this.avisos.mostrar(`Usuario «${usuario.nombre}» eliminado.`);
      this.reintentar(); // con paginación en servidor hay que volver a pedir la página
    } catch (e) {
      const error = e as ErrorApi;
      if (error.estado === 401) {
        this.aBorrar.set(null);
        await this.sesion.caducada(this.router.url);
      } else {
        // El error se muestra DENTRO del modal, que sigue abierto para poder reintentar o cancelar.
        this.errorBorrado.set(esSinBackend(error) ? 'No hay conexión con el backend. Arráncalo con npm run backend.' : error.message);
      }
    } finally {
      this.eliminando.set(false);
    }
  }
}
