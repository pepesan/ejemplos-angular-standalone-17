import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, Router, provideRouter, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Usuario } from '../../services/usuarios-api.service';
import { usuarioResolver } from './usuario.resolver';

const ana: Usuario = { id: 1, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor' };
const ruta = (id: string) => ({ paramMap: convertToParamMap({ id }) }) as ActivatedRouteSnapshot;

describe('usuarioResolver', () => {
  let http: HttpTestingController;
  const resolver = (id: string) =>
    TestBed.runInInjectionContext(() => usuarioResolver(ruta(id), {} as RouterStateSnapshot)) as Promise<Usuario | RedirectCommand>;
  const destino = (r: Usuario | RedirectCommand) => TestBed.inject(Router).serializeUrl((r as RedirectCommand).redirectTo);

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('entrega el usuario cuando existe', async () => {
    const promesa = resolver('1');
    await new Promise((r) => setTimeout(r));
    http.expectOne('/api/usuarios/1').flush(ana);
    expect(await promesa).toEqual(ana);
  });

  it('un 404 redirige a «no encontrado»', async () => {
    const promesa = resolver('99');
    await new Promise((r) => setTimeout(r));
    http.expectOne('/api/usuarios/99').flush({ message: 'No existe' }, { status: 404, statusText: 'Not Found' });
    const resultado = await promesa;
    expect(resultado).toBeInstanceOf(RedirectCommand);
    expect(destino(resultado)).toBe('/v2/usuarios-navegacion/no-encontrado');
  });

  it('un id que no es un número redirige sin llamar a la API', async () => {
    const resultado = await resolver('abc');
    expect(destino(resultado)).toBe('/v2/usuarios-navegacion/no-encontrado');
    http.expectNone(() => true);
  });

  it('otro fallo (p. ej. backend caído) vuelve al listado', async () => {
    const promesa = resolver('1');
    await new Promise((r) => setTimeout(r));
    http.expectOne('/api/usuarios/1').flush('Bad Gateway', { status: 502, statusText: 'Bad Gateway' });
    expect(destino(await promesa)).toBe('/v2/usuarios-navegacion');
  });
});
