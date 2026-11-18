import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PactometroComponent } from './pactometro.component';
import { PARTIDOS_RESPALDO } from '../../services/pactometro.service';

describe('PactometroComponent', () => {
  const url = 'https://pactometro.cursosdedesarrollo.com/resultados.json';

  function crear() {
    TestBed.configureTestingModule({
      imports: [PactometroComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(PactometroComponent);
    return { fixture, http: TestBed.inject(HttpTestingController) };
  }

  it('pinta los partidos recibidos', async () => {
    const { fixture, http } = crear();
    http.expectOne(url).flush([{ nombre: 'PP', dipu: 137, imagen: 'pp.png' }]);
    fixture.detectChanges();
    await fixture.whenStable();
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('PP: 137');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('si la petición falla, pinta los datos de respaldo y avisa', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { fixture, http } = crear();
    http.expectOne(url).flush('fallo', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('datos de respaldo');
    expect(el.textContent).toContain(`${PARTIDOS_RESPALDO[0].nombre}: ${PARTIDOS_RESPALDO[0].dipu}`);
  });
});
