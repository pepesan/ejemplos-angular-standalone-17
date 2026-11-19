import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { EstadoResultados } from './resultado';
import { ResultadoService } from './resultado.service';

const URL = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

describe('ResultadoService', () => {
  let http: HttpTestingController;
  let servicio: ResultadoService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    servicio = TestBed.inject(ResultadoService);
  });
  afterEach(() => http.verify());

  it('emite loading y después success con los resultados', () => {
    const estados: EstadoResultados[] = [];
    servicio.estado().subscribe((e) => estados.push(e));
    http.expectOne(URL).flush([{ nombre: 'PP', dipu: 137, imagen: 'pp.png' }]);
    expect(estados).toEqual([{ status: 'loading' }, { status: 'success', items: [{ nombre: 'PP', dipu: 137, imagen: 'pp.png' }] }]);
  });

  // Contrato del ejercicio: el fallo se convierte en estado y se registra en consola, sin lanzar la excepción.
  it('ante un error emite el estado error y lo registra en consola', () => {
    const consola = vi.spyOn(console, 'error').mockImplementation(() => {});
    const estados: EstadoResultados[] = [];
    let fallo: unknown;
    servicio.estado().subscribe({ next: (e) => estados.push(e), error: (e) => (fallo = e) });
    http.expectOne(URL).flush('Fallo', { status: 500, statusText: 'Server Error' });
    expect(fallo).toBeUndefined();
    expect(estados.map((e) => e.status)).toEqual(['loading', 'error']);
    expect(consola).toHaveBeenCalled();
    consola.mockRestore();
  });
});
