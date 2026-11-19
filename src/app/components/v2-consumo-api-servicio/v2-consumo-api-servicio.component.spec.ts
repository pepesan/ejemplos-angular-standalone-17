import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResultadosApiService } from './resultados-api.service';
import { V2ConsumoApiServicioComponent } from './v2-consumo-api-servicio.component';

// El componente se prueba con un servicio falso: demuestra que solo depende del servicio, no de HttpClient.
function crear(obtener: () => unknown) {
  TestBed.configureTestingModule({
    imports: [V2ConsumoApiServicioComponent],
    providers: [{ provide: ResultadosApiService, useValue: { obtener } }],
  });
  const fixture = TestBed.createComponent(V2ConsumoApiServicioComponent);
  fixture.detectChanges();
  return fixture;
}

describe('V2ConsumoApiServicioComponent', () => {
  it('pinta los resultados que entrega el servicio', () => {
    const fixture = crear(() => of([{ nombre: 'Partido de ejemplo', dipu: 3, imagen: '' }]));
    expect(fixture.nativeElement.textContent).toContain('Partido de ejemplo: 3 escaños');
  });

  it('distingue una respuesta vacía', () => {
    expect(crear(() => of([])).nativeElement.textContent).toContain('No hay resultados disponibles');
  });

  it('muestra el error y reintenta llamando de nuevo al servicio', () => {
    let llamadas = 0;
    const fixture = crear(() => (++llamadas === 1 ? throwError(() => new HttpErrorResponse({ status: 500 })) : of([{ nombre: 'Recuperado', dipu: 1, imagen: '' }])));
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('No se pudieron cargar');
    expect(fixture.nativeElement.textContent).not.toContain('npm run backend');
    fixture.nativeElement.querySelector('button[type="button"]').click();
    fixture.detectChanges();
    expect(llamadas).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Recuperado');
  });

  it('avisa de arrancar el backend ante un 502', () => {
    const fixture = crear(() => throwError(() => new HttpErrorResponse({ status: 502 })));
    expect(fixture.nativeElement.textContent).toContain('npm run backend');
  });
});
