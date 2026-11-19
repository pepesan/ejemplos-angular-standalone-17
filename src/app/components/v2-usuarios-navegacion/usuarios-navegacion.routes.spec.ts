import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CONFIRMAR_SALIDA } from './guards/cambios-sin-guardar.guard';
import { SesionUsuariosService } from './sesion-usuarios.service';
import { USUARIOS_NAVEGACION_RUTAS } from './usuarios-navegacion.routes';

const BASE = '/v2/usuarios-navegacion';
const ana = { id: 1, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor' };
const luis = { id: 2, nombre: 'Luis', email: 'luis@example.com', rol: 'alumno' };
const pagina = (items: object[] = [ana, luis], extra: object = {}) => ({ items, total: items.length, page: 1, size: 5, ...extra });

/** Deja pasar un ciclo de tareas: las guardas y los resolvers son asíncronos. */
const ciclo = () => new Promise<void>((resolver) => setTimeout(resolver, 0));

describe('rutas de la feature (integración)', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let preguntas: string[];
  let respuestaUsuario: boolean;
  const el = () => harness.routeNativeElement as HTMLElement;
  const raiz = () => TestBed.inject(Router).routerState.root;
  const listado = () => http.expectOne((r) => r.url === '/api/usuarios' && r.method === 'GET');

  beforeEach(async () => {
    preguntas = [];
    respuestaUsuario = false;
    TestBed.configureTestingModule({
      providers: [
        // Las mismas rutas que `app.routes.ts` carga de forma diferida, montadas en su URL real y con el binding de inputs.
        provideRouter([{ path: 'v2/usuarios-navegacion', children: USUARIOS_NAVEGACION_RUTAS }], withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CONFIRMAR_SALIDA, useValue: (m: string) => (preguntas.push(m), respuestaUsuario) },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
  });
  afterEach(() => http.verify());

  const conSesion = (role: 'admin' | 'alumno') =>
    TestBed.inject(SesionUsuariosService).perfil.set({ id: 'x', name: 'Persona', role });

  /** Navega a una ruta protegida y deja que cargue el listado (para las pruebas que no dependen de él). */
  async function irAlListado(url = BASE, respuesta = pagina()) {
    const navegacion = harness.navigateByUrl(url);
    await ciclo();
    listado().flush(respuesta);
    await navegacion;
    await ciclo();
    harness.detectChanges();
  }

  describe('protección por sesión', () => {
    it('sin sesión lleva al login y recuerda a dónde se quería ir', async () => {
      await harness.navigateByUrl(`${BASE}/nuevo`);
      expect(TestBed.inject(Router).url).toBe(`${BASE}/login?returnUrl=%2Fv2%2Fusuarios-navegacion%2Fnuevo`);
      expect(el().textContent).toContain('Inicia sesión');
    });

    it('la pantalla de login es pública (no la bloquea sesionGuard)', async () => {
      await harness.navigateByUrl(`${BASE}/login`);
      expect(el().querySelector('#l-usuario')).not.toBeNull();
    });

    it('tras el login vuelve a la URL de origen', async () => {
      await harness.navigateByUrl(`${BASE}/login?returnUrl=%2Fv2%2Fusuarios-navegacion%2Fnuevo`);
      (el().querySelector('form button[type="submit"]') as HTMLButtonElement).click();
      await ciclo();
      http.expectOne('/api/auth/login').flush({ tokenType: 'Bearer', accessToken: 'jwt', expiresInSeconds: 900 });
      await ciclo();
      http.expectOne('/api/auth/profile').flush({ id: 'x', name: 'Persona', role: 'admin' });
      await ciclo();
      await ciclo();
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(`${BASE}/nuevo`);
      expect(el().textContent).toContain('Nuevo usuario');
    });

    it('ignora un returnUrl hacia otra web (no hay open redirect)', async () => {
      await harness.navigateByUrl(`${BASE}/login?returnUrl=https%3A%2F%2Fmalo.example`);
      (el().querySelector('form button[type="submit"]') as HTMLButtonElement).click();
      await ciclo();
      http.expectOne('/api/auth/login').flush({ tokenType: 'Bearer', accessToken: 'jwt', expiresInSeconds: 900 });
      await ciclo();
      http.expectOne('/api/auth/profile').flush({ id: 'x', name: 'Persona', role: 'admin' });
      await ciclo();
      await ciclo();
      // La navegación la hizo el componente (no el harness): hay que detectar cambios para que arranque el listado.
      harness.detectChanges();
      await ciclo();
      listado().flush(pagina());
      await ciclo();
      expect(TestBed.inject(Router).url).toBe(BASE);
    });
  });

  describe('protección por rol', () => {
    it('un alumno no entra en «nuevo»: vuelve al listado con el motivo', async () => {
      conSesion('alumno');
      const navegacion = harness.navigateByUrl(`${BASE}/nuevo`);
      await ciclo();
      listado().flush(pagina());
      await navegacion;
      await ciclo();
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(`${BASE}?denegado=1`);
      expect(el().textContent).toContain('requiere el rol');
    });

    it('un alumno ve el listado sin acciones de escritura', async () => {
      conSesion('alumno');
      await irAlListado();
      expect(el().querySelectorAll('tbody tr').length).toBe(2);
      expect(el().textContent).not.toContain('Nuevo usuario');
      expect(el().querySelector('[aria-label^="Editar"]')).toBeNull();
    });

    it('un admin entra en «nuevo» y se pone el título de la ruta', async () => {
      conSesion('admin');
      await harness.navigateByUrl(`${BASE}/nuevo`);
      expect(el().textContent).toContain('Nuevo usuario');
      expect(TestBed.inject(Title).getTitle()).toBe('Nuevo usuario');
    });
  });

  describe('edición con resolver', () => {
    it('el usuario resuelto llega como input() y precarga el formulario; el título se calcula con el id', async () => {
      conSesion('admin');
      const navegacion = harness.navigateByUrl(`${BASE}/1/editar`);
      await ciclo();
      http.expectOne('/api/usuarios/1').flush(ana);
      await navegacion;
      harness.detectChanges();
      expect(el().textContent).toContain('Editar usuario #1');
      expect((el().querySelector('#u-nombre') as HTMLInputElement).value).toBe('Ana');
      expect((el().querySelector('#u-email') as HTMLInputElement).value).toBe('ana@example.com');
      expect(TestBed.inject(Title).getTitle()).toBe('Editar usuario #1');
    });

    it('un id inexistente redirige a «no encontrado»', async () => {
      conSesion('admin');
      const navegacion = harness.navigateByUrl(`${BASE}/99/editar`);
      await ciclo();
      http.expectOne('/api/usuarios/99').flush({ message: 'No existe' }, { status: 404, statusText: 'Not Found' });
      await navegacion;
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(`${BASE}/no-encontrado`);
      expect(el().textContent).toContain('No encontrado');
    });

    it('una URL desconocida de la feature muestra «no encontrado» sin pasar por el listado', async () => {
      conSesion('admin');
      await harness.navigateByUrl(`${BASE}/lo-que-sea/raro`);
      expect(el().textContent).toContain('No encontrado');
    });
  });

  describe('canDeactivate (cambios sin guardar)', () => {
    async function abrirNuevoConCambios() {
      conSesion('admin');
      await harness.navigateByUrl(`${BASE}/nuevo`);
      const nombre = el().querySelector('#u-nombre') as HTMLInputElement;
      nombre.value = 'Eva';
      nombre.dispatchEvent(new Event('input'));
      harness.detectChanges();
    }

    it('sin cambios se puede salir sin preguntar', async () => {
      conSesion('admin');
      await harness.navigateByUrl(`${BASE}/nuevo`);
      const navegacion = harness.navigateByUrl(`${BASE}/no-encontrado`);
      await navegacion;
      expect(TestBed.inject(Router).url).toBe(`${BASE}/no-encontrado`);
      expect(preguntas).toEqual([]);
    });

    it('con cambios pregunta y, si el usuario cancela, se queda', async () => {
      await abrirNuevoConCambios();
      respuestaUsuario = false;
      await harness.navigateByUrl(`${BASE}/no-encontrado`);
      expect(preguntas.length).toBe(1);
      expect(TestBed.inject(Router).url).toBe(`${BASE}/nuevo`);
    });

    it('con cambios pregunta y, si el usuario acepta, sale', async () => {
      await abrirNuevoConCambios();
      respuestaUsuario = true;
      await harness.navigateByUrl(`${BASE}/no-encontrado`);
      expect(TestBed.inject(Router).url).toBe(`${BASE}/no-encontrado`);
    });
  });

  describe('estado del listado en la URL', () => {
    it('?q y ?page llegan como input() y se envían al servidor', async () => {
      conSesion('admin');
      const navegacion = harness.navigateByUrl(`${BASE}?q=ana&page=2`);
      await ciclo();
      const pedido = listado();
      expect(pedido.request.params.get('q')).toBe('ana');
      expect(pedido.request.params.get('page')).toBe('2');
      pedido.flush(pagina([ana], { total: 6, page: 2 }));
      await navegacion;
      await ciclo();
      harness.detectChanges();
      expect(el().textContent).toContain('Página 2 de 2');
      expect((el().querySelector('#filtro') as HTMLInputElement).value).toBe('ana');
    });

    it('un page inválido se trata como 1', async () => {
      conSesion('admin');
      const navegacion = harness.navigateByUrl(`${BASE}?page=abc`);
      await ciclo();
      const pedido = listado();
      expect(pedido.request.params.get('page')).toBe('1');
      pedido.flush(pagina());
      await navegacion;
    });
  });

  describe('avisos tras navegar', () => {
    it('cerrar sesión lleva al login y avisa; el aviso desaparece en la navegación siguiente', async () => {
      conSesion('admin');
      await irAlListado();
      (el().querySelector('.sesion button') as HTMLButtonElement).click();
      await ciclo();
      await ciclo();
      harness.detectChanges();
      expect(TestBed.inject(Router).url).toBe(`${BASE}/login`);
      expect(el().textContent).toContain('Has cerrado la sesión');
      await harness.navigateByUrl(`${BASE}/login?x=1`);
      harness.detectChanges();
      expect(el().textContent).not.toContain('Has cerrado la sesión');
    });
  });

  it('el menú marca la página activa con aria-current', async () => {
    conSesion('admin');
    await irAlListado();
    const enlaces = Array.from(el().querySelectorAll<HTMLAnchorElement>('nav.menu a'));
    expect(enlaces.find((a) => a.getAttribute('aria-current') === 'page')?.textContent).toContain('Listado');
  });

  it('raiz() del router tiene un árbol de rutas (comprobación de que el harness usa el router real)', () => {
    expect(raiz()).toBeTruthy();
  });
});
