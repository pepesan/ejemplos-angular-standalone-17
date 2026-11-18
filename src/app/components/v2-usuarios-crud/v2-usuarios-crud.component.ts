import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, catchError, debounceTime, distinctUntilChanged, EMPTY, switchMap, tap } from 'rxjs';
import { AuthService, DemoProfile } from '../../services/auth.service';
import {
  ColumnaOrden, ConsultaUsuarios, ErrorApi, PaginaUsuarios, Rol, Usuario, UsuariosApiService,
} from '../../services/usuarios-api.service';

@Component({
  selector: 'app-v2-usuarios-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './v2-usuarios-crud.component.html',
  styleUrl: './v2-usuarios-crud.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2UsuariosCrudComponent {
  private readonly api = inject(UsuariosApiService);
  readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly roles: Rol[] = ['alumno', 'profesor', 'admin'];
  readonly tamanos = [5, 10, 20];
  readonly columnas: { clave: ColumnaOrden; titulo: string }[] = [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'email', titulo: 'Email' },
    { clave: 'rol', titulo: 'Rol' },
  ];

  // --- Sesión (JWT del backend) ---
  readonly perfil = signal<DemoProfile | null>(null);
  readonly errorLogin = signal<string | null>(null);
  readonly iniciandoSesion = signal(false);
  readonly esAdmin = computed(() => this.perfil()?.role === 'admin');
  readonly formularioLogin = this.fb.group({
    usuario: ['admin', Validators.required],
    clave: ['angular', Validators.required],
  });

  // --- Listado: consulta (filtro, orden, página) y resultado ---
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
  readonly busqueda = this.fb.control('');
  private readonly recargar$ = new Subject<void>();

  // --- Alta y edición ---
  readonly guardando = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly confirmandoId = signal<number | null>(null);
  readonly erroresServidor = signal<Partial<Record<'nombre' | 'email' | 'rol', string>>>({});
  readonly formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    rol: ['alumno' as Rol, Validators.required],
  });
  private readonly campoNombre = viewChild<ElementRef<HTMLInputElement>>('campoNombre');

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

    // Filtro con retardo: espera 300 ms sin teclear antes de consultar al servidor.
    this.busqueda.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => {
        this.consulta.update((c) => ({ ...c, q: q.trim(), page: 1 }));
        this.recargar$.next();
      });

    // El token vive en memoria: si ya había sesión (el servicio es singleton) se recupera el perfil.
    if (this.auth.isAuthenticated()) this.cargarPerfil();

    // Al empezar a editar, el foco pasa al primer campo del formulario.
    effect(() => {
      if (this.editandoId() !== null) queueMicrotask(() => this.campoNombre()?.nativeElement.focus());
    });
  }

  // ----- Sesión -----
  iniciarSesion(): void {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }
    const { usuario, clave } = this.formularioLogin.getRawValue();
    this.iniciandoSesion.set(true);
    this.errorLogin.set(null);
    this.auth
      .login({ username: usuario, password: clave })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.iniciandoSesion.set(false);
          this.cargarPerfil();
        },
        error: () => {
          this.iniciandoSesion.set(false);
          this.errorLogin.set('Usuario o contraseña incorrectos.');
        },
      });
  }

  private cargarPerfil(): void {
    this.auth
      .loadProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (perfil) => {
          this.perfil.set(perfil);
          this.recargar$.next();
        },
        error: () => this.cerrarSesion('Tu sesión ha caducado. Inicia sesión de nuevo.'),
      });
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
  ordenar(columna: ColumnaOrden): void {
    this.consulta.update((c) => ({
      ...c,
      sort: columna,
      dir: c.sort === columna && c.dir === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
    this.recargar$.next();
  }

  /** Selector de orden para móvil (donde las cabeceras de la tabla no se ven): valor `columna:sentido`. */
  ordenarCombinado(valor: string): void {
    const [sort, dir] = valor.split(':') as [ColumnaOrden, 'asc' | 'desc'];
    this.consulta.update((c) => ({ ...c, sort, dir, page: 1 }));
    this.recargar$.next();
  }

  ariaSort(columna: ColumnaOrden): 'ascending' | 'descending' | 'none' {
    const c = this.consulta();
    return c.sort !== columna ? 'none' : c.dir === 'asc' ? 'ascending' : 'descending';
  }

  irAPagina(pagina: number): void {
    this.consulta.update((c) => ({ ...c, page: Math.min(Math.max(pagina, 1), this.totalPaginas()) }));
    this.recargar$.next();
  }

  cambiarTamano(tamano: string): void {
    this.consulta.update((c) => ({ ...c, size: Number(tamano), page: 1 }));
    this.recargar$.next();
  }

  // ----- Alta y edición -----
  editar(usuario: Usuario): void {
    this.editandoId.set(usuario.id);
    this.erroresServidor.set({});
    this.aviso.set(null);
    this.formulario.setValue({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.erroresServidor.set({});
    this.formulario.reset({ nombre: '', email: '', rol: 'alumno' });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const id = this.editandoId();
    const datos = this.formulario.getRawValue();
    this.guardando.set(true); // deshabilita el botón: evita enviar dos veces
    this.errorGeneral.set(null);
    this.erroresServidor.set({});
    const peticion = id === null ? this.api.crear(datos) : this.api.actualizar(id, datos);
    peticion.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (guardado) => {
        this.guardando.set(false);
        this.aviso.set(id === null ? `Usuario «${guardado.nombre}» creado.` : `Usuario «${guardado.nombre}» actualizado.`);
        this.cancelarEdicion();
        this.recargar$.next(); // con paginación en servidor hay que volver a pedir la página
      },
      error: (error: ErrorApi) => {
        this.guardando.set(false);
        if (Object.keys(error.errores).length) this.erroresServidor.set(error.errores);
        else this.gestionarError(error);
      },
    });
  }

  eliminar(usuario: Usuario): void {
    this.api
      .eliminar(usuario.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.confirmandoId.set(null);
          this.aviso.set(`Usuario «${usuario.nombre}» eliminado.`);
          if (this.editandoId() === usuario.id) this.cancelarEdicion();
          this.recargar$.next();
        },
        error: (error: ErrorApi) => {
          this.confirmandoId.set(null);
          this.gestionarError(error);
        },
      });
  }
}
