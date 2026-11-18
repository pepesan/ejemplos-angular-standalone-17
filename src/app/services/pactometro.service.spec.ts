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

  afterEach(() => {
    http.verify({ ignoreCancelled: true });
    vi.useRealTimers();
  });

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

  it('getResultadosProcesados ordena, descarta partidos sin escaños y calcula el porcentaje', () => {
    let resultado: any;
    service.getResultadosProcesados().subscribe((r) => (resultado = r));
    http.expectOne(url).flush([
      { nombre: 'B', dipu: 1, imagen: '' },
      { nombre: 'A', dipu: 3, imagen: '' },
      { nombre: 'Cero', dipu: 0, imagen: '' },
    ]);
    expect(resultado.origen).toBe('remoto');
    expect(resultado.partidos.map((p: any) => [p.nombre, p.porcentaje])).toEqual([['A', 75], ['B', 25]]);
  });

  it('getResultadosProcesados también procesa los datos de respaldo si la petición falla', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    let resultado: any;
    service.getResultadosProcesados().subscribe((r) => (resultado = r));
    http.expectOne(url).flush('fallo', { status: 500, statusText: 'Server Error' });
    expect(resultado.origen).toBe('respaldo');
    expect(resultado.partidos[0].porcentaje).toBeGreaterThan(0);
  });

  describe('getResultadosConReintentos', () => {
    it('reintenta dos veces y, si sigue fallando, emite fallo con datos de respaldo', async () => {
      vi.useFakeTimers();
      const eventos: any[] = [];
      service.getResultadosConReintentos({ esperaMs: 10 }).subscribe((e) => eventos.push(e));
      for (let i = 0; i < 3; i++) {
        http.expectOne(url).flush('fallo', { status: 500, statusText: 'Server Error' });
        await vi.advanceTimersByTimeAsync(10);
      }
      expect(eventos.map((e) => e.tipo)).toEqual(['reintento', 'reintento', 'fallo']);
      expect(eventos[0]).toMatchObject({ intento: 1, maximo: 2 });
      expect(eventos[2].partidos).toEqual(PARTIDOS_RESPALDO);
    });

    it('emite éxito si un reintento funciona', async () => {
      vi.useFakeTimers();
      const eventos: any[] = [];
      service.getResultadosConReintentos({ esperaMs: 10 }).subscribe((e) => eventos.push(e));
      http.expectOne(url).flush('fallo', { status: 500, statusText: 'Server Error' });
      await vi.advanceTimersByTimeAsync(10);
      http.expectOne(url).flush([{ nombre: 'PP', dipu: 1, imagen: '' }]);
      expect(eventos.map((e) => e.tipo)).toEqual(['reintento', 'exito']);
    });

    it('cuenta como fallo una petición que supera el timeout', async () => {
      vi.useFakeTimers();
      const eventos: any[] = [];
      service.getResultadosConReintentos({ timeoutMs: 100, esperaMs: 10, reintentos: 1 }).subscribe((e) => eventos.push(e));
      await vi.advanceTimersByTimeAsync(100);
      expect(eventos[0].tipo).toBe('reintento');
      expect(eventos[0].motivo).toContain('tiempo de espera');
      await vi.advanceTimersByTimeAsync(10 + 100);
      expect(eventos.map((e) => e.tipo)).toEqual(['reintento', 'fallo']);
    });
  });
});
