import { ChangeDetectionStrategy, Component, DestroyRef, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounce, email, form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { Subject, catchError, EMPTY, firstValueFrom, skip, switchMap, tap } from 'rxjs';
import { AuthService, DemoProfile } from '../../services/auth.service';
import {
  ConsultaUsuarios, ErrorApi, PaginaUsuarios, Rol, Usuario, UsuariosApiService,
} from '../../services/usuarios-api.service';

interface DatosUsuario { nombre: string; email: string; rol: Rol; }

const USUARIO_VACIO: DatosUsuario = { nombre: '', email: '', rol: 'alumno' };

/**
 * El CRUD de `V2UsuariosCrudComponent` con los TRES formularios (login, búsqueda y alta/edición) hechos con
 * Signal Forms. El acceso a la API (`UsuariosApiService`, `AuthService`) y el backend son los mismos.
 * Qué cambia respecto al original:
 *  - `submit()` + `submitting()` sustituyen a las señales `iniciandoSesion` y `guardando` (y evitan el doble envío).
 *  - Los errores 400/409 del servidor se devuelven desde la acción de `submit()` asociados a su campo, en vez de
 *    una señal `erroresServidor` aparte: se pintan igual que los de validación local.
 *  - `debounce()` en el esquema del filtro sustituye a `debounceTime` de RxJS.
 * Se mantiene RxJS (`switchMap`) para cargar el listado: sigue siendo un flujo asíncrono que debe cancelarse.
 */
@Component({
  selector: 'app-v2-usuarios-crud-signal',
  imports: [FormField],
  templateUrl: './v2-usuarios-crud-signal.component.html',
  // Mismos estilos que el CRUD original (no se duplican).
  styleUrl: '../v2-usuarios-crud/v2-usuarios-crud.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2UsuariosCrudSignalComponent {
  private readonly api = inject(UsuariosApiService);
  readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly roles: Rol[] = ['alumno', 'profesor', 'admin'];

  // --- Sesión (JWT del backend) ---
  readonly perfil = signal<DemoProfile | null>(null);
  readonly errorLogin = signal<string | null>(null);
  readonly esAdmin = computed(() => this.perfil()?.role === 'admin');
  readonly modeloLogin = signal({ usuario: 'admin', clave: 'angular' });
  readonly formularioLogin = form(this.modeloLogin, (ruta) => {
    required(ruta.usuario, { message: 'Escribe el usuario.' });
    required(ruta.clave, { message: 'Escribe la contraseña.' });
  });

  // --- Listado: consulta (filtro y página) y resultado ---
  readonly consulta = signal<ConsultaUsuarios>({ q: '', page: 1, size: 5, sort: 'id', dir: 'asc' });
  readonly pagina = signal<PaginaUsuarios | null>(null);
  readonly cargando = signal(false);
  readonly errorGeneral = signal<string | null>(null);
  /** Mensaje de confirmación de la última acción; se anuncia a lectores de pantalla (aria-live). */
  readonly aviso = signal<string | null>(null);
  readonly totalPaginas = computed(() => {
    const p = this.pagina();
    return p ? Math.max(Math.ceil(p.total / p.size), 1) : 1;
  });
  readonly rango = computed(() => {
    const p = this.pagina();
    if (!p || p.total === 0) return '';
    return `${(p.page - 1) * p.size + 1}–${(p.page - 1) * p.size + p.items.length} de ${p.total}`;
  });
  private readonly recargar$ = new Subject<void>();

  // Filtro: el esquema espera 300 ms sin teclear antes de pasar el valor al modelo (`debounce`).
  readonly modeloBusqueda = signal({ q: '' });
  readonly formularioBusqueda = form(this.modeloBusqueda, (ruta) => {
    debounce(ruta.q, 300);
  });
  private readonly textoBusqueda = computed(() => this.modeloBusqueda().q.trim());

  // --- Alta y edición ---
  readonly editandoId = signal<number | null>(null);
  readonly confirmandoId = signal<number | null>(null);
  readonly modeloUsuario = signal<DatosUsuario>({ ...USUARIO_VACIO });
  readonly formulario = form(this.modeloUsuario, (ruta) => {
    required(ruta.nombre, { message: 'El nombre es obligatorio.' });
    minLength(ruta.nombre, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });
    maxLength(ruta.nombre, 80, { message: 'El nombre no puede superar los 80 caracteres.' });
    required(ruta.email, { message: 'El email es obligatorio.' });
    email(ruta.email, { message: 'Introduce un email válido.' });
    required(ruta.rol, { message: 'Elige un rol.' });
  });
  private readonly dialogo = viewChild<ElementRef<HTMLDialogElement>>('dialogo');

  constructor() {
    // switchMap cancela la petición anterior si llega otra: nunca se pinta una respuesta antigua
    // que haya tardado más que la nueva (carrera típica al teclear en el filtro).
    this.recargar$
      .pipe(
        tap(() => this.cargando.set(true)),
        switchMap(() =>
          this.api.listar(this.consulta()).pipe(
            catchError((error: ErrorApi) => {
              this.gestionarError(error);
              this.cargando.set(false);
              return EMPTY; // el flujo principal sigue vivo para la siguiente recarga
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((pagina) => {
        // Si se borró el último elemento de la última página, se retrocede una página.
        if (pagina.items.length === 0 && pagina.total > 0 && this.consulta().page > 1) {
          this.irAPagina(this.consulta().page - 1);
          return;
        }
        this.pagina.set(pagina);
        this.cargando.set(false);
      });

    // Cuando el modelo del filtro cambia (ya con el retardo aplicado) se vuelve a consultar desde la página 1.
    // `skip(1)` descarta el valor inicial que emite `toObservable` al crearse.
    toObservable(this.textoBusqueda)
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => {
        if (!this.perfil()) return;
        this.consulta.update((c) => ({ ...c, q, page: 1 }));
        this.recargar$.next();
      });

    // El token vive en memoria: si ya había sesión (el servicio es singleton) se recupera el perfil.
    if (this.auth.isAuthenticated()) void this.cargarPerfil();
  }

  // ----- Sesión -----
  async iniciarSesion(evento: SubmitEvent): Promise<void> {
    evento.preventDefault();
    this.errorLogin.set(null);
    // `submit()` marca los campos como tocados, comprueba la validez y mantiene `submitting()` mientras dura.
    await submit(this.formularioLogin, async () => {
      const { usuario, clave } = this.modeloLogin();
      try {
        await firstValueFrom(this.auth.login({ username: usuario, password: clave }));
      } catch {
        this.errorLogin.set('Usuario o contraseña incorrectos.');
        return;
      }
      await this.cargarPerfil();
    });
  }

  private async cargarPerfil(): Promise<void> {
    try {
      this.perfil.set(await firstValueFrom(this.auth.loadProfile()));
      this.recargar$.next();
    } catch {
      this.cerrarSesion('Tu sesión ha caducado. Inicia sesión de nuevo.');
    }
  }

  cerrarSesion(mensaje: string | null = null): void {
    this.auth.logout();
    this.perfil.set(null);
    this.pagina.set(null);
    this.cancelarEdicion();
    this.errorGeneral.set(null);
    this.errorLogin.set(mensaje);
    this.aviso.set(mensaje ? null : 'Has cerrado la sesión.');
  }

  private gestionarError(error: ErrorApi): void {
    // 401: el token no vale o ha caducado (vive 15 min) → volver al login.
    if (error.estado === 401) this.cerrarSesion('Tu sesión ha caducado. Inicia sesión de nuevo.');
    else this.errorGeneral.set(error.message);
  }

  // ----- Listado -----
  irAPagina(pagina: number): void {
    this.consulta.update((c) => ({ ...c, page: Math.min(Math.max(pagina, 1), this.totalPaginas()) }));
    this.recargar$.next();
  }

  // ----- Alta y edición (en un diálogo modal nativo) -----
  // <dialog> con showModal() ya trae lo que un modal accesible necesita: atrapa el foco, se cierra con Esc,
  // bloquea el resto de la página (inert) y al cerrarse devuelve el foco al botón que lo abrió.
  nuevo(): void {
    this.restablecer();
    this.abrirDialogo();
  }

  editar(usuario: Usuario): void {
    this.restablecer();
    this.editandoId.set(usuario.id);
    // `reset(valor)` carga el valor en el modelo y limpia el estado de los campos (tocado, sucio).
    this.formulario().reset({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
    this.abrirDialogo();
  }

  /** Cierra el diálogo (botón Cancelar, ×, clic en el fondo o éxito al guardar). */
  cancelarEdicion(): void {
    const dialogo = this.dialogo()?.nativeElement;
    if (dialogo?.open) {
      if (dialogo.close) dialogo.close();
      else dialogo.removeAttribute('open'); // DOM de pruebas sin soporte de <dialog>
    }
    this.restablecer();
  }

  /** Clic en el fondo oscuro (el propio <dialog>, no su contenido): cierra el modal. */
  clicFondo(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) this.cancelarEdicion();
  }

  /** Se llama también con el evento `close` del diálogo, que se dispara al pulsar Esc. */
  restablecer(): void {
    this.editandoId.set(null);
    this.formulario().reset({ ...USUARIO_VACIO });
  }

  private abrirDialogo(): void {
    this.aviso.set(null);
    const dialogo = this.dialogo()?.nativeElement;
    if (!dialogo || dialogo.open) return;
    if (dialogo.showModal) dialogo.showModal();
    else dialogo.setAttribute('open', ''); // DOM de pruebas sin soporte de <dialog>
  }

  async guardar(evento: SubmitEvent): Promise<void> {
    evento.preventDefault();
    this.errorGeneral.set(null);
    // `submit()` no ejecuta la acción si el formulario es inválido (marca los campos como tocados) y mantiene
    // `formulario().submitting()` mientras dura: el botón se deshabilita y no se envía dos veces.
    await submit(this.formulario, async (campos) => {
      const id = this.editandoId();
      const datos = this.modeloUsuario();
      try {
        const guardado = await firstValueFrom(id === null ? this.api.crear(datos) : this.api.actualizar(id, datos));
        this.aviso.set(id === null ? `Usuario «${guardado.nombre}» creado.` : `Usuario «${guardado.nombre}» actualizado.`);
        this.cancelarEdicion();
        this.recargar$.next(); // con paginación en servidor hay que volver a pedir la página
        return undefined;
      } catch (e) {
        const error = e as ErrorApi;
        // Errores 400/409 por campo: se devuelven asociados a su campo y se muestran junto a él.
        const porCampo = (['nombre', 'email', 'rol'] as const)
          .filter((campo) => error.errores[campo])
          .map((campo) => ({ kind: 'servidor', message: error.errores[campo], fieldTree: campos[campo] }));
        if (porCampo.length) return porCampo;
        this.gestionarError(error);
        return undefined;
      }
    });
  }

  async eliminar(usuario: Usuario): Promise<void> {
    try {
      await firstValueFrom(this.api.eliminar(usuario.id));
      this.confirmandoId.set(null);
      this.aviso.set(`Usuario «${usuario.nombre}» eliminado.`);
      if (this.editandoId() === usuario.id) this.cancelarEdicion();
      this.recargar$.next();
    } catch (e) {
      this.confirmandoId.set(null);
      this.gestionarError(e as ErrorApi);
    }
  }
}
