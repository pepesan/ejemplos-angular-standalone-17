import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../../services/auth.service';
import { SesionUsuariosService } from '../sesion-usuarios.service';
import { adminGuard } from './admin.guard';
import { CONFIRMAR_SALIDA, cambiosSinGuardarGuard } from './cambios-sin-guardar.guard';
import { sesionGuard } from './sesion.guard';

const ruta = {} as ActivatedRouteSnapshot;
const estado = (url: string) => ({ url }) as RouterStateSnapshot;
// Las guardas usan `inject()`: se ejecutan dentro de un contexto de inyección.
const ejecutar = <T>(fn: () => T) => TestBed.runInInjectionContext(fn);

describe('guardas de la feature', () => {
  let http: HttpTestingController;
  // La pregunta de «¿salir con cambios?» se sustituye por una función controlada por el test.
  let preguntas: string[];
  let respuestaUsuario: boolean;
  beforeEach(() => {
    preguntas = [];
    respuestaUsuario = false;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CONFIRMAR_SALIDA, useValue: (mensaje: string) => (preguntas.push(mensaje), respuestaUsuario) },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  describe('sesionGuard', () => {
    it('sin sesión devuelve un UrlTree al login recordando la URL pedida', async () => {
      const resultado = await ejecutar(() => sesionGuard(ruta, estado('/v2/usuarios-navegacion/nuevo')));
      expect(resultado).toBeInstanceOf(UrlTree);
      expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe(
        '/v2/usuarios-navegacion/login?returnUrl=%2Fv2%2Fusuarios-navegacion%2Fnuevo',
      );
    });

    it('con el perfil ya cargado deja pasar', async () => {
      TestBed.inject(SesionUsuariosService).perfil.set({ id: '1', name: 'Ana', role: 'admin' });
      expect(await ejecutar(() => sesionGuard(ruta, estado('/x')))).toBe(true);
    });

    it('con token pero sin perfil lo carga (guarda asíncrona) y deja pasar', async () => {
      TestBed.inject(AuthService).login({ username: 'a', password: 'b' }).subscribe();
      http.expectOne('/api/auth/login').flush({ tokenType: 'Bearer', accessToken: 'jwt', expiresInSeconds: 900 });
      const guarda = ejecutar(() => sesionGuard(ruta, estado('/x')));
      await new Promise((r) => setTimeout(r));
      http.expectOne('/api/auth/profile').flush({ id: '1', name: 'Ana', role: 'alumno' });
      expect(await guarda).toBe(true);
      expect(TestBed.inject(SesionUsuariosService).perfil()?.name).toBe('Ana');
    });

    it('si el perfil no se puede cargar cierra la sesión y manda al login', async () => {
      TestBed.inject(AuthService).login({ username: 'a', password: 'b' }).subscribe();
      http.expectOne('/api/auth/login').flush({ tokenType: 'Bearer', accessToken: 'jwt', expiresInSeconds: 900 });
      const guarda = ejecutar(() => sesionGuard(ruta, estado('/x')));
      await new Promise((r) => setTimeout(r));
      http.expectOne('/api/auth/profile').flush('x', { status: 401, statusText: 'Unauthorized' });
      expect(await guarda).toBeInstanceOf(UrlTree);
      expect(TestBed.inject(AuthService).isAuthenticated()).toBe(false);
    });
  });

  describe('adminGuard', () => {
    it('deja pasar a un admin', () => {
      TestBed.inject(SesionUsuariosService).perfil.set({ id: '1', name: 'Ana', role: 'admin' });
      expect(ejecutar(() => adminGuard(ruta, estado('/x')))).toBe(true);
    });

    it('a un alumno lo redirige al listado con ?denegado=1', () => {
      TestBed.inject(SesionUsuariosService).perfil.set({ id: '2', name: 'Luis', role: 'alumno' });
      const resultado = ejecutar(() => adminGuard(ruta, estado('/x')));
      expect(resultado).toBeInstanceOf(UrlTree);
      expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/v2/usuarios-navegacion?denegado=1');
    });
  });

  describe('cambiosSinGuardarGuard', () => {
    const salir = (hayCambios: boolean) =>
      ejecutar(() => cambiosSinGuardarGuard({ hayCambios: () => hayCambios }, ruta, estado('/a'), estado('/b')));

    it('sin cambios deja salir sin preguntar', () => {
      expect(salir(false)).toBe(true);
      expect(preguntas).toEqual([]);
    });

    it('con cambios pregunta y respeta la respuesta', () => {
      respuestaUsuario = true;
      expect(salir(true)).toBe(true);
      respuestaUsuario = false;
      expect(salir(true)).toBe(false);
      expect(preguntas[0]).toContain('cambios sin guardar');
    });
  });
});
