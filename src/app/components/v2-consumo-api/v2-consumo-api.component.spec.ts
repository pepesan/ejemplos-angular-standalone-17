import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { V2ConsumoApiComponent } from './v2-consumo-api.component';

const URL_RESULTADOS = '/api/resultados';

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
    expect(fixture.nativeElement.querySelector('img')?.getAttribute('src')).toBe('partido.png');
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

  // 502/503/504 los devuelve el proxy de `ng serve` cuando el backend no está arrancado.
  it('avisa de arrancar el backend cuando el proxy devuelve 502', () => {
    const fixture = TestBed.createComponent(V2ConsumoApiComponent);
    fixture.detectChanges();
    http.expectOne(URL_RESULTADOS).flush('Bad Gateway', { status: 502, statusText: 'Bad Gateway' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('npm run backend');
  });

  it('no sugiere arrancar el backend ante un error 500 de la API', () => {
    const fixture = TestBed.createComponent(V2ConsumoApiComponent);
    fixture.detectChanges();
    http.expectOne(URL_RESULTADOS).flush('Fallo', { status: 500, statusText: 'Server error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('npm run backend');
  });
});
