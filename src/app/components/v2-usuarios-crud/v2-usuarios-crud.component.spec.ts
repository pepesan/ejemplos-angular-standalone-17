import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { V2UsuariosCrudComponent } from './v2-usuarios-crud.component';

describe('V2UsuariosCrudComponent', () => {
  const usuarios = '/api/usuarios';
  const ana = { id: 1, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor' };
  const luis = { id: 2, nombre: 'Luis', email: 'luis@example.com', rol: 'alumno' };
  const pagina = (items: object[] = [ana, luis], extra: object = {}) => ({ items, total: items.length, page: 1, size: 5, ...extra });
  let fixture: ComponentFixture<V2UsuariosCrudComponent>;
  let http: HttpTestingController;
  const el = () => fixture.nativeElement as HTMLElement;
  const listado = () => http.expectOne((r) => r.url === usuarios && r.method === 'GET');

  async function refrescar() {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function escribir(selector: string, valor: string) {
    const campo = el().querySelector<HTMLInputElement>(selector)!;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
  }

  function pulsar(selector: string) {
    el().querySelector<HTMLButtonElement>(selector)!.click();
  }

  function crear() {
    TestBed.configureTestingModule({
      imports: [V2UsuariosCrudComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(V2UsuariosCrudComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  /** Inicia sesión con el rol indicado y devuelve el componente con la primera página cargada. */
  async function conSesion(role: 'admin' | 'student' = 'admin', respuesta = pagina()) {
    crear();
    pulsar('form button[type="submit"]');
    const login = http.expectOne('/api/auth/login');
    expect(login.request.body).toEqual({ username: 'admin', password: 'angular' });
    login.flush({ tokenType: 'Bearer', accessToken: 'jwt-falso', expiresInSeconds: 900 });
    http.expectOne('/api/auth/profile').flush({ id: 'x', name: 'Persona', role });
    listado().flush(respuesta);
    await refrescar();
  }

  it('sin sesión muestra el login y no pide usuarios', () => {
    crear();
    expect(el().querySelector('#l-usuario')).not.toBeNull();
    http.expectNone(usuarios);
  });

  it('muestra un error si las credenciales no valen', async () => {
    crear();
    pulsar('form button[type="submit"]');
    http.expectOne('/api/auth/login').flush({ message: 'x' }, { status: 401, statusText: 'Unauthorized' });
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
    http.expectOne('/api/auth/login').flush({ accessToken: 'jwt', tokenType: 'Bearer', expiresInSeconds: 900 });
    http.expectOne('/api/auth/profile').flush({ id: 'x', name: 'P', role: 'admin' });
    listado().flush({ message: 'caducado' }, { status: 401, statusText: 'Unauthorized' });
    await refrescar();
    expect(el().querySelector('#l-usuario')).not.toBeNull();
    expect(el().textContent).toContain('ha caducado');
  });

  it('ordenar por una columna consulta al servidor con sort y dir', async () => {
    await conSesion();
    pulsar('thead th:nth-child(1) button');
    const pedido = listado();
    expect(pedido.request.params.get('sort')).toBe('nombre');
    expect(pedido.request.params.get('dir')).toBe('asc');
    pedido.flush(pagina());
    await refrescar();
    expect(el().querySelector('thead th')?.getAttribute('aria-sort')).toBe('ascending');
    pulsar('thead th:nth-child(1) button');
    expect(listado().request.params.get('dir')).toBe('desc');
  });

  it('el filtro espera 300 ms y vuelve a la página 1', async () => {
    vi.useFakeTimers();
    try {
      await conSesion();
      escribir('#filtro', 'an');
      escribir('#filtro', 'ana');
      http.expectNone((r) => r.url === usuarios);
      await vi.advanceTimersByTimeAsync(300);
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

  it('crea un usuario con POST y recarga la página', async () => {
    await conSesion();
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'eva@example.com');
    pulsar('#form-titulo ~ .acciones button[type="submit"]');
    const post = http.expectOne((r) => r.method === 'POST');
    expect(post.request.body).toEqual({ nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' });
    post.flush({ id: 3, nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' }, { status: 201, statusText: 'Created' });
    listado().flush(pagina([ana, luis, { id: 3, nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' }]));
    await refrescar();
    expect(el().textContent).toContain('«Eva» creado');
    expect(el().querySelectorAll('tbody tr').length).toBe(3);
  });

  it('no envía el formulario si es inválido', async () => {
    await conSesion();
    pulsar('#form-titulo ~ .acciones button[type="submit"]');
    await refrescar();
    http.expectNone((r) => r.method === 'POST');
    expect(el().textContent).toContain('El nombre es obligatorio');
  });

  it('muestra junto al campo el error 409 del servidor', async () => {
    await conSesion();
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'ana@example.com');
    pulsar('#form-titulo ~ .acciones button[type="submit"]');
    http.expectOne((r) => r.method === 'POST').flush(
      { message: 'Ya existe un usuario con ese email.', errores: { email: 'Ese email ya está en uso.' } },
      { status: 409, statusText: 'Conflict' },
    );
    await refrescar();
    expect(el().querySelector('#e-email')?.textContent).toContain('Ese email ya está en uso.');
  });

  it('edita un usuario con PUT', async () => {
    await conSesion();
    pulsar('[aria-label="Editar Ana"]');
    await refrescar();
    escribir('#u-nombre', 'Ana María');
    pulsar('#form-titulo ~ .acciones button[type="submit"]');
    const put = http.expectOne((r) => r.method === 'PUT');
    expect(put.request.url).toBe('/api/usuarios/1');
    put.flush({ ...ana, nombre: 'Ana María' });
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
    listado().flush(pagina([luis]));
    await refrescar();
    expect(el().textContent).toContain('«Ana» eliminado');
    expect(el().querySelectorAll('tbody tr').length).toBe(1);
  });

  it('muestra un estado vacío cuando el filtro no coincide', async () => {
    await conSesion('admin', pagina([], { total: 0 }));
    expect(el().textContent).toContain('No hay usuarios todavía');
  });
});
