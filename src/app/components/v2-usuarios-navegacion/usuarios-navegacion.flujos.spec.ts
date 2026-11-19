import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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
const ciclo = () => new Promise<void>((resolver) => setTimeout(resolver, 0));
const esperar = (ms: number) => new Promise<void>((resolver) => setTimeout(resolver, ms));

/** Flujos de usuario completos (listado → modal de borrado, alta, edición, sesión caducada, backend apagado). */
describe('flujos de la feature', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let router: Router;
  /** Preguntas de «¿salir con cambios sin guardar?» que ha hecho la guarda (siempre se responde que sí). */
  let preguntas: string[];
  const el = () => harness.routeNativeElement as HTMLElement;
  const listado = () => http.expectOne((r) => r.url === '/api/usuarios' && r.method === 'GET');
  const pulsar = (selector: string) => el().querySelector<HTMLElement>(selector)!.click();

  function escribir(selector: string, valor: string) {
    const campo = el().querySelector<HTMLInputElement>(selector)!;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
    harness.detectChanges();
  }

  /** Deja pasar ciclos y detecta cambios: la UI y las peticiones se encadenan con promesas. */
  async function asentar(veces = 2) {
    for (let i = 0; i < veces; i++) {
      await ciclo();
      harness.detectChanges();
    }
  }

  beforeEach(async () => {
    preguntas = [];
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'v2/usuarios-navegacion', children: USUARIOS_NAVEGACION_RUTAS }], withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CONFIRMAR_SALIDA, useValue: (mensaje: string) => (preguntas.push(mensaje), true) },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
    TestBed.inject(SesionUsuariosService).perfil.set({ id: 'x', name: 'Persona', role: 'admin' });
  });
  afterEach(() => http.verify());

  async function irAlListado(respuesta = pagina(), url = BASE) {
    const navegacion = harness.navigateByUrl(url);
    await ciclo();
    listado().flush(respuesta);
    await navegacion;
    await asentar();
  }

  describe('borrado en modal', () => {
    it('«Eliminar» abre el modal; confirmar borra, recarga y avisa; no hay confirmación inline', async () => {
      await irAlListado();
      expect(el().querySelector('dialog')?.hasAttribute('open')).toBe(false);
      pulsar('[aria-label="Eliminar Ana"]');
      harness.detectChanges();
      expect(el().querySelector('dialog')?.hasAttribute('open')).toBe(true);
      expect(el().querySelector('dialog')?.textContent).toContain('Ana');
      http.expectNone((r) => r.method === 'DELETE');

      pulsar('dialog button.peligro');
      await ciclo();
      const borrado = http.expectOne((r) => r.method === 'DELETE');
      expect(borrado.request.url).toBe('/api/usuarios/1');
      borrado.flush(null, { status: 204, statusText: 'No Content' });
      await asentar(1);
      listado().flush(pagina([luis]));
      await asentar();
      expect(el().textContent).toContain('«Ana» eliminado');
      expect(el().querySelectorAll('tbody tr').length).toBe(1);
      expect(el().querySelector('dialog')?.hasAttribute('open')).toBe(false);
    });

    it('«Cancelar» cierra el modal sin borrar nada', async () => {
      await irAlListado();
      pulsar('[aria-label="Eliminar Ana"]');
      harness.detectChanges();
      el().querySelectorAll<HTMLButtonElement>('dialog button')[1].click();
      harness.detectChanges();
      expect(el().querySelector('dialog')?.hasAttribute('open')).toBe(false);
      http.expectNone((r) => r.method === 'DELETE');
    });

    it('si el borrado falla, el error se ve dentro del modal y este sigue abierto', async () => {
      await irAlListado();
      pulsar('[aria-label="Eliminar Ana"]');
      harness.detectChanges();
      pulsar('dialog button.peligro');
      await ciclo();
      http.expectOne((r) => r.method === 'DELETE').flush({ message: 'No se puede borrar.' }, { status: 409, statusText: 'Conflict' });
      await asentar(1);
      expect(el().querySelector('dialog')?.hasAttribute('open')).toBe(true);
      expect(el().querySelector('dialog [role="alert"]')?.textContent).toContain('No se puede borrar.');
    });

    it('con el backend apagado el modal explica cómo arrancarlo', async () => {
      await irAlListado();
      pulsar('[aria-label="Eliminar Ana"]');
      harness.detectChanges();
      pulsar('dialog button.peligro');
      await ciclo();
      http.expectOne((r) => r.method === 'DELETE').flush('Bad Gateway', { status: 502, statusText: 'Bad Gateway' });
      await asentar(1);
      expect(el().querySelector('dialog [role="alert"]')?.textContent).toContain('npm run backend');
    });

    it('si se borra el último elemento de la última página retrocede una página', async () => {
      await irAlListado(pagina([ana], { total: 6, page: 2 }), `${BASE}?page=2`);
      pulsar('[aria-label="Eliminar Ana"]');
      harness.detectChanges();
      pulsar('dialog button.peligro');
      await ciclo();
      http.expectOne((r) => r.method === 'DELETE').flush(null, { status: 204, statusText: 'No Content' });
      await asentar(1);
      // La página 2 ya no tiene elementos (total 5): el servidor devuelve vacío y el listado sube a la 1.
      listado().flush(pagina([], { total: 5, page: 2 }));
      await asentar(3);
      expect(router.url).toBe(`${BASE}?page=1`);
      listado().flush(pagina([ana, luis], { total: 5, page: 1 }));
      await asentar();
      expect(el().textContent).toContain('Página 1 de 1');
    });
  });

  describe('filtro y paginación en la URL', () => {
    it('escribir en el filtro espera 300 ms y actualiza la URL, que recarga el listado', async () => {
      await irAlListado();
      escribir('#filtro', 'ana');
      await esperar(150);
      http.expectNone((r) => r.url === '/api/usuarios');
      await esperar(300);
      await asentar();
      expect(router.url).toBe(`${BASE}?q=ana`);
      const pedido = listado();
      expect(pedido.request.params.get('q')).toBe('ana');
      expect(pedido.request.params.get('page')).toBe('1');
      pedido.flush(pagina([ana]));
      await asentar();
    });

    it('«Siguiente» y «Anterior» son enlaces reales que cambian ?page conservando el filtro', async () => {
      await irAlListado(pagina([ana, luis], { total: 12 }), `${BASE}?q=a`);
      const enlaces = Array.from(el().querySelectorAll<HTMLAnchorElement>('.paginador a'));
      expect(enlaces[0].getAttribute('aria-disabled')).toBe('true');
      expect(enlaces[1].getAttribute('href')).toBe(`${BASE}?q=a&page=2`);
      enlaces[1].click();
      await asentar(1);
      const pedido = listado();
      expect(pedido.request.params.get('page')).toBe('2');
      expect(pedido.request.params.get('q')).toBe('a');
      pedido.flush(pagina([ana], { total: 12, page: 2 }));
      await asentar();
      expect(el().textContent).toContain('Página 2 de 3');
    });

    it('muestra un estado vacío que menciona el filtro', async () => {
      await irAlListado(pagina([], { total: 0 }), `${BASE}?q=zzz`);
      expect(el().textContent).toContain('Ningún usuario coincide con «zzz»');
    });
  });

  describe('errores del listado', () => {
    it('un 401 cierra la sesión, lleva al login con returnUrl y avisa de que ha caducado', async () => {
      const navegacion = harness.navigateByUrl(`${BASE}?page=2`);
      await ciclo();
      listado().flush({ message: 'caducado' }, { status: 401, statusText: 'Unauthorized' });
      await navegacion;
      await asentar(3);
      expect(router.url).toContain(`${BASE}/login?returnUrl=`);
      expect(decodeURIComponent(router.url)).toContain('returnUrl=/v2/usuarios-navegacion?page=2');
      expect(el().textContent).toContain('ha caducado');
      expect(TestBed.inject(SesionUsuariosService).perfil()).toBeNull();
    });

    it('con el backend apagado avisa de arrancarlo y «Reintentar» vuelve a pedir el listado', async () => {
      const navegacion = harness.navigateByUrl(BASE);
      await ciclo();
      listado().flush('Bad Gateway', { status: 502, statusText: 'Bad Gateway' });
      await navegacion;
      await asentar();
      expect(el().textContent).toContain('No hay conexión con el backend');
      expect(el().textContent).not.toContain('El servidor ha fallado');
      pulsar('app-aviso-sin-backend button');
      await asentar(1);
      listado().flush(pagina());
      await asentar();
      expect(el().querySelectorAll('tbody tr').length).toBe(2);
      expect(el().textContent).not.toContain('No hay conexión con el backend');
    });

    it('un 500 de la API muestra su mensaje y no sugiere arrancar el backend', async () => {
      const navegacion = harness.navigateByUrl(BASE);
      await ciclo();
      listado().flush('Fallo', { status: 500, statusText: 'Server Error' });
      await navegacion;
      await asentar();
      expect(el().querySelector('.error[role="alert"]')?.textContent).toContain('El servidor ha fallado');
      expect(el().textContent).not.toContain('No hay conexión con el backend');
    });
  });

  describe('alta', () => {
    async function abrirNuevo() {
      await harness.navigateByUrl(`${BASE}/nuevo`);
      escribir('#u-nombre', 'Eva');
      escribir('#u-email', 'eva@example.com');
    }

    it('crea el usuario, vuelve al listado, avisa y NO pregunta por cambios sin guardar', async () => {
      await abrirNuevo();
      pulsar('form button[type="submit"]');
      await ciclo();
      const post = http.expectOne((r) => r.method === 'POST');
      expect(post.request.body).toEqual({ nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' });
      post.flush({ id: 3, nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' }, { status: 201, statusText: 'Created' });
      await asentar(2);
      listado().flush(pagina([ana, luis, { id: 3, nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' }]));
      await asentar();
      expect(router.url).toBe(BASE);
      expect(el().textContent).toContain('«Eva» creado');
      expect(el().querySelectorAll('tbody tr').length).toBe(3);
      // Tras guardar el formulario queda «sin cambios»: la guarda no debe haber preguntado nada al salir.
      expect(preguntas).toEqual([]);
    });

    it('un 409 se queda en la pantalla con el aviso junto al campo', async () => {
      await abrirNuevo();
      pulsar('form button[type="submit"]');
      await ciclo();
      http.expectOne((r) => r.method === 'POST').flush(
        { message: 'Ya existe', errores: { email: 'Ese email ya está en uso.' } },
        { status: 409, statusText: 'Conflict' },
      );
      await asentar();
      expect(router.url).toBe(`${BASE}/nuevo`);
      expect(el().querySelector('#e-email')?.textContent).toContain('Ese email ya está en uso.');
    });

    it('un 401 al guardar lleva al login recordando la pantalla', async () => {
      await abrirNuevo();
      pulsar('form button[type="submit"]');
      await ciclo();
      http.expectOne((r) => r.method === 'POST').flush({ message: 'caducado' }, { status: 401, statusText: 'Unauthorized' });
      await asentar(3);
      expect(router.url).toContain(`${BASE}/login`);
      expect(decodeURIComponent(router.url)).toContain('returnUrl=/v2/usuarios-navegacion/nuevo');
    });
  });

  describe('edición', () => {
    it('guarda con PUT, vuelve al listado y avisa de la actualización', async () => {
      const navegacion = harness.navigateByUrl(`${BASE}/1/editar`);
      await ciclo();
      http.expectOne('/api/usuarios/1').flush(ana);
      await navegacion;
      await asentar(1);
      escribir('#u-nombre', 'Ana María');
      pulsar('form button[type="submit"]');
      await ciclo();
      const put = http.expectOne((r) => r.method === 'PUT');
      expect(put.request.url).toBe('/api/usuarios/1');
      expect(put.request.body).toEqual({ nombre: 'Ana María', email: 'ana@example.com', rol: 'profesor' });
      put.flush({ ...ana, nombre: 'Ana María' });
      await asentar(2);
      listado().flush(pagina([{ ...ana, nombre: 'Ana María' }, luis]));
      await asentar();
      expect(router.url).toBe(BASE);
      expect(el().textContent).toContain('«Ana María» actualizado');
      expect(preguntas).toEqual([]);
    });

    it('el enlace «Editar» del listado lleva a la URL de edición del usuario', async () => {
      await irAlListado();
      expect(el().querySelector('[aria-label="Editar Luis"]')?.getAttribute('href')).toBe(`${BASE}/2/editar`);
    });
  });
});
