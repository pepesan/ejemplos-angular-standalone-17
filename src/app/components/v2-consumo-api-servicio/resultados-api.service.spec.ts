import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ResultadosApiService } from './resultados-api.service';

describe('ResultadosApiService', () => {
  it('pide los resultados a /api/resultados y los devuelve', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    let recibido: unknown;
    TestBed.inject(ResultadosApiService).obtener().subscribe((r) => (recibido = r));
    const peticion = http.expectOne('/api/resultados');
    expect(peticion.request.method).toBe('GET');
    peticion.flush([{ nombre: 'A', dipu: 1, imagen: '' }]);
    expect(recibido).toEqual([{ nombre: 'A', dipu: 1, imagen: '' }]);
    http.verify();
  });

  it('es singleton: se recibe la misma instancia en toda la aplicación', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    expect(TestBed.inject(ResultadosApiService)).toBe(TestBed.inject(ResultadosApiService));
  });
});
