import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PactometroProcesadoComponent } from './pactometro-procesado.component';

describe('PactometroProcesadoComponent', () => {
  const url = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  it('pinta los partidos ordenados y con porcentaje', async () => {
    TestBed.configureTestingModule({
      imports: [PactometroProcesadoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(PactometroProcesadoComponent);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne(url).flush([
      { nombre: 'B', dipu: 25, imagen: '' },
      { nombre: 'A', dipu: 75, imagen: '' },
      { nombre: 'Cero', dipu: 0, imagen: '' },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();
    const filas = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('tbody tr')).map((f) =>
      Array.from(f.querySelectorAll('td')).map((c) => c.textContent!.trim()),
    );
    expect(filas).toEqual([['1', 'A', '75', '75 %'], ['2', 'B', '25', '25 %']]);
  });
});
