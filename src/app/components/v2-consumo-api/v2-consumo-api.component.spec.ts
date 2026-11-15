import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { V2ConsumoApiComponent } from './v2-consumo-api.component';

const URL_RESULTADOS = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

describe('V2ConsumoApiComponent', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [V2ConsumoApiComponent], providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('muestra carga y luego los recursos recibidos', () => {
    const fixture = TestBed.createComponent(V2ConsumoApiComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Cargando resultados');
    http.expectOne(URL_RESULTADOS).flush([{ nombre: 'Partido de ejemplo', dipu: 3, imagen: 'partido.png' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Partido de ejemplo');
    expect(fixture.nativeElement.textContent).toContain('3 escaños');
    expect(fixture.nativeElement.querySelector('img')?.getAttribute('src')).toBe('https://pactometro.cursosdedesarrollo.com/img/partido.png');
  });

  it('distingue una respuesta vacía', () => {
    const fixture = TestBed.createComponent(V2ConsumoApiComponent);
    fixture.detectChanges();
    http.expectOne(URL_RESULTADOS).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay resultados disponibles');
  });

  it('expone el error HTTP de forma accesible', () => {
    const fixture = TestBed.createComponent(V2ConsumoApiComponent);
    fixture.detectChanges();
    http.expectOne(URL_RESULTADOS).flush('Fallo', { status: 500, statusText: 'Server error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('No se pudieron cargar');
    fixture.nativeElement.querySelector('button[type="button"]').click();
    fixture.detectChanges();
    http.expectOne(URL_RESULTADOS).flush([{ nombre: 'Recuperado', dipu: 1, imagen: 'ok.png' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Recuperado');
  });
});
