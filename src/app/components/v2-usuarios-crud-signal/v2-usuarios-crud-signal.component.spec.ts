import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { V2UsuariosCrudSignalComponent } from './v2-usuarios-crud-signal.component';

describe('V2UsuariosCrudSignalComponent', () => {
  const usuarios = '/api/usuarios';
  const ana = { id: 1, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor' };
  const luis = { id: 2, nombre: 'Luis', email: 'luis@example.com', rol: 'alumno' };
  const pagina = (items: object[] = [ana, luis], extra: object = {}) => ({ items, total: items.length, page: 1, size: 5, ...extra });
  let fixture: ComponentFixture<V2UsuariosCrudSignalComponent>;
  let http: HttpTestingController;
  const el = () => fixture.nativeElement as HTMLElement;
  const listado = () => http.expectOne((r) => r.url === usuarios && r.method === 'GET');

  async function refrescar() {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /**
   * Deja pasar un ciclo de tareas: `submit()` y `firstValueFrom` son asíncronos, así que la petición HTTP
   * que provoca una acción no existe hasta que se resuelven sus promesas. (No se usa `whenStable`: espera
   * a las peticiones pendientes, y aquí se responden a mano.)
   */
  const ciclo = () => new Promise<void>((resolver) => setTimeout(resolver, 0));

  function escribir(selector: string, valor: string) {
    const campo = el().querySelector<HTMLInputElement>(selector)!;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function pulsar(selector: string) {
    el().querySelector<HTMLButtonElement>(selector)!.click();
  }

  function crear() {
    TestBed.configureTestingModule({
      imports: [V2UsuariosCrudSignalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(V2UsuariosCrudSignalComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  /** Inicia sesión con el rol indicado y devuelve el componente con la primera página cargada. */
  async function conSesion(role: 'admin' | 'student' = 'admin', respuesta = pagina()) {
    crear();
    pulsar('form button[type="submit"]');
    await ciclo();
    const login = http.expectOne('/api/auth/login');
    expect(login.request.body).toEqual({ username: 'admin', password: 'angular' });
    login.flush({ tokenType: 'Bearer', accessToken: 'jwt-falso', expiresInSeconds: 900 });
    await ciclo();
    http.expectOne('/api/auth/profile').flush({ id: 'x', name: 'Persona', role });
    await ciclo();
    listado().flush(respuesta);
    await refrescar();
  }

  it('sin sesión muestra el login y no pide usuarios', () => {
    crear();
    expect(el().querySelector('#l-usuario')).not.toBeNull();
    http.expectNone(usuarios);
  });

  it('no envía el login si hay campos vacíos y muestra el aviso del campo', async () => {
    crear();
    escribir('#l-usuario', '');
    pulsar('form button[type="submit"]');
    await ciclo();
    fixture.detectChanges();
    http.expectNone('/api/auth/login');
    expect(el().querySelector('#e-l-usuario')?.textContent).toContain('Escribe el usuario.');
  });

  it('muestra un error si las credenciales no valen', async () => {
    crear();
    pulsar('form button[type="submit"]');
    await ciclo();
    http.expectOne('/api/auth/login').flush({ message: 'x' }, { status: 401, statusText: 'Unauthorized' });
    await ciclo();
    await refrescar();
    expect(el().querySelector('[role="alert"]')?.textContent).toContain('incorrectos');
  });

  it('tras el login pide la primera página y la muestra', async () => {
    await conSesion();
    expect(el().querySelectorAll('tbody tr').length).toBe(2);
    expect(el().textContent).toContain('Sesión:');
  });

  it('un rol sin permisos solo consulta: no hay formulario ni acciones', async () => {
    await conSesion('student');
    expect(el().querySelector('#u-nombre')).toBeNull();
    expect(el().querySelector('[aria-label^="Editar"]')).toBeNull();
    expect(el().textContent).toContain('solo permite consultar');
  });

  it('cerrar sesión vuelve al login', async () => {
    await conSesion();
    el().querySelectorAll<HTMLButtonElement>('.sesion button')[0].click();
    await refrescar();
    expect(el().querySelector('#l-usuario')).not.toBeNull();
    expect(el().textContent).toContain('Has cerrado la sesión');
  });

  it('un 401 al listar cierra la sesión y avisa de que ha caducado', async () => {
    crear();
    pulsar('form button[type="submit"]');
    await ciclo();
    http.expectOne('/api/auth/login').flush({ accessToken: 'jwt', tokenType: 'Bearer', expiresInSeconds: 900 });
    await ciclo();
    http.expectOne('/api/auth/profile').flush({ id: 'x', name: 'P', role: 'admin' });
    await ciclo();
    listado().flush({ message: 'caducado' }, { status: 401, statusText: 'Unauthorized' });
    await refrescar();
    expect(el().querySelector('#l-usuario')).not.toBeNull();
    expect(el().textContent).toContain('ha caducado');
  });

  it('el filtro espera 300 ms (debounce del esquema) y vuelve a la página 1', async () => {
    await conSesion();
    vi.useFakeTimers();
    try {
      escribir('#filtro', 'an');
      escribir('#filtro', 'ana');
      await vi.advanceTimersByTimeAsync(200);
      fixture.detectChanges();
      http.expectNone((r) => r.url === usuarios);
      await vi.advanceTimersByTimeAsync(150);
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);
      const pedido = listado();
      expect(pedido.request.params.get('q')).toBe('ana');
      expect(pedido.request.params.get('page')).toBe('1');
      pedido.flush(pagina([ana]));
    } finally {
      vi.useRealTimers();
    }
  });

  it('pagina con Siguiente y Anterior', async () => {
    await conSesion('admin', pagina([ana, luis], { total: 12 }));
    expect(el().textContent).toContain('Página 1 de 3');
    pulsar('.botones button:last-child');
    const pedido = listado();
    expect(pedido.request.params.get('page')).toBe('2');
    pedido.flush(pagina([ana], { total: 12, page: 2 }));
    await refrescar();
    expect(el().textContent).toContain('Página 2 de 3');
  });

  it('«Nuevo usuario» abre el modal con el formulario vacío y Cancelar lo cierra', async () => {
    await conSesion();
    const dialogo = el().querySelector('dialog')!;
    expect(dialogo.hasAttribute('open')).toBe(false);
    pulsar('.titulo-lista button');
    await refrescar();
    expect(dialogo.hasAttribute('open')).toBe(true);
    expect(el().querySelector('#form-titulo')?.textContent).toContain('Nuevo usuario');
    pulsar('dialog .acciones button[type="button"]');
    await refrescar();
    expect(dialogo.hasAttribute('open')).toBe(false);
  });

  it('editar precarga los datos del usuario dentro del <dialog> modal', async () => {
    await conSesion();
    expect(el().querySelector('dialog #u-nombre')).not.toBeNull();
    pulsar('[aria-label="Editar Ana"]');
    await refrescar();
    expect(el().querySelector('dialog')?.hasAttribute('open')).toBe(true);
    expect(el().querySelector<HTMLInputElement>('#u-nombre')?.value).toBe('Ana');
    expect(el().querySelector<HTMLInputElement>('#u-email')?.value).toBe('ana@example.com');
    expect(el().querySelector<HTMLSelectElement>('#u-rol')?.value).toBe('profesor');
  });

  it('crea un usuario con POST, cierra el modal y recarga la página', async () => {
    await conSesion();
    pulsar('.titulo-lista button');
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'eva@example.com');
    pulsar('dialog button[type="submit"]');
    await ciclo();
    const post = http.expectOne((r) => r.method === 'POST');
    expect(post.request.body).toEqual({ nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' });
    post.flush({ id: 3, nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' }, { status: 201, statusText: 'Created' });
    await ciclo();
    listado().flush(pagina([ana, luis, { id: 3, nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' }]));
    await refrescar();
    expect(el().textContent).toContain('«Eva» creado');
    expect(el().querySelectorAll('tbody tr').length).toBe(3);
    expect(el().querySelector('dialog')?.hasAttribute('open')).toBe(false);
  });

  it('no envía el formulario si es inválido y muestra el aviso junto al campo', async () => {
    await conSesion();
    pulsar('.titulo-lista button');
    pulsar('dialog button[type="submit"]');
    await ciclo();
    await refrescar();
    http.expectNone((r) => r.method === 'POST');
    expect(el().querySelector('#e-nombre')?.textContent).toContain('El nombre es obligatorio.');
    expect(el().querySelector('#e-email')?.textContent).toContain('El email es obligatorio.');
  });

  it('valida longitud del nombre y formato del email', async () => {
    await conSesion();
    pulsar('.titulo-lista button');
    escribir('#u-nombre', 'E');
    escribir('#u-email', 'no-es-email');
    pulsar('dialog button[type="submit"]');
    await ciclo();
    await refrescar();
    expect(el().querySelector('#e-nombre')?.textContent).toContain('al menos 2 caracteres');
    expect(el().querySelector('#e-email')?.textContent).toContain('email válido');
  });

  it('muestra junto al campo el error 409 del servidor (devuelto desde submit)', async () => {
    await conSesion();
    pulsar('.titulo-lista button');
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'ana@example.com');
    pulsar('dialog button[type="submit"]');
    await ciclo();
    http.expectOne((r) => r.method === 'POST').flush(
      { message: 'Ya existe un usuario con ese email.', errores: { email: 'Ese email ya está en uso.' } },
      { status: 409, statusText: 'Conflict' },
    );
    await ciclo();
    await refrescar();
    expect(el().querySelector('#e-email')?.textContent).toContain('Ese email ya está en uso.');
    expect(el().querySelector('#u-email')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('no envía dos veces: el botón se deshabilita mientras dura el envío', async () => {
    await conSesion();
    pulsar('.titulo-lista button');
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'eva@example.com');
    pulsar('dialog button[type="submit"]');
    await ciclo();
    fixture.detectChanges();
    const boton = el().querySelector<HTMLButtonElement>('dialog button[type="submit"]')!;
    expect(boton.disabled).toBe(true);
    expect(boton.textContent).toContain('Guardando');
    boton.click();
    await ciclo();
    expect(http.match((r) => r.method === 'POST').length).toBe(1);
  });

  it('edita un usuario con PUT', async () => {
    await conSesion();
    pulsar('[aria-label="Editar Ana"]');
    await refrescar();
    escribir('#u-nombre', 'Ana María');
    pulsar('dialog button[type="submit"]');
    await ciclo();
    const put = http.expectOne((r) => r.method === 'PUT');
    expect(put.request.url).toBe('/api/usuarios/1');
    expect(put.request.body).toEqual({ nombre: 'Ana María', email: 'ana@example.com', rol: 'profesor' });
    put.flush({ ...ana, nombre: 'Ana María' });
    await ciclo();
    listado().flush(pagina([{ ...ana, nombre: 'Ana María' }, luis]));
    await refrescar();
    expect(el().querySelector('tbody')?.textContent).toContain('Ana María');
  });

  it('pide confirmación antes de eliminar', async () => {
    await conSesion();
    pulsar('[aria-label="Eliminar Ana"]');
    await refrescar();
    http.expectNone((r) => r.method === 'DELETE');
    pulsar('[aria-label="Confirmar el borrado de Ana"]');
    const borrado = http.expectOne((r) => r.method === 'DELETE');
    expect(borrado.request.url).toBe('/api/usuarios/1');
    borrado.flush(null, { status: 204, statusText: 'No Content' });
    await ciclo();
    listado().flush(pagina([luis]));
    await refrescar();
    expect(el().textContent).toContain('«Ana» eliminado');
    expect(el().querySelectorAll('tbody tr').length).toBe(1);
  });

  it('muestra un estado vacío cuando no hay usuarios', async () => {
    await conSesion('admin', pagina([], { total: 0 }));
    expect(el().textContent).toContain('No hay usuarios todavía');
  });
});
