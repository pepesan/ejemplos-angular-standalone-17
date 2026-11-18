import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PactometroService, PARTIDOS_RESPALDO } from './pactometro.service';

describe('PactometroService', () => {
  let service: PactometroService;
  let http: HttpTestingController;
  const url = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PactometroService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('devuelve los partidos del servidor con origen remoto', () => {
    const datos = [{ nombre: 'PP', dipu: 1, imagen: 'pp.png' }];
    let resultado: unknown;
    service.getResultados().subscribe((r) => (resultado = r));
    http.expectOne(url).flush(datos);
    expect(resultado).toEqual({ partidos: datos, origen: 'remoto' });
  });

  it('si la petición falla, devuelve datos de respaldo en lugar de un error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let resultado: unknown;
    let error: unknown;
    service.getResultados().subscribe({ next: (r) => (resultado = r), error: (e) => (error = e) });
    http.expectOne(url).flush('fallo', { status: 500, statusText: 'Server Error' });
    expect(error).toBeUndefined();
    expect(resultado).toEqual({ partidos: PARTIDOS_RESPALDO, origen: 'respaldo' });
  });
});
