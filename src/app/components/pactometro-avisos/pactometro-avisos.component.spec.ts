import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PactometroAvisosComponent } from './pactometro-avisos.component';

describe('PactometroAvisosComponent', () => {
  const url = 'https://pactometro.cursosdedesarrollo.com/resultados.json';
  const error500 = { status: 500, statusText: 'Server Error' };

  function crear() {
    TestBed.configureTestingModule({
      imports: [PactometroAvisosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(PactometroAvisosComponent);
    fixture.detectChanges();
    return { fixture, http: TestBed.inject(HttpTestingController) };
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('avisa de cada reintento y muestra datos de respaldo si todo falla', async () => {
    const { fixture, http } = crear();
    for (let i = 0; i < 3; i++) {
      http.expectOne(url).flush('fallo', error500);
      await vi.advanceTimersByTimeAsync(500);
    }
    fixture.detectChanges();
    const avisos = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.alert')).map((a) => a.textContent);
    expect(avisos.length).toBe(3);
    expect(avisos[0]).toContain('Reintento 1 de 2');
    expect(avisos[1]).toContain('Reintento 2 de 2');
    expect(avisos[2]).toContain('datos de respaldo');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('avisa del éxito tras reintentar', async () => {
    const { fixture, http } = crear();
    http.expectOne(url).flush('fallo', error500);
    await vi.advanceTimersByTimeAsync(500);
    http.expectOne(url).flush([{ nombre: 'PP', dipu: 137, imagen: '' }]);
    fixture.detectChanges();
    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain('Reintento 1 de 2');
    expect(texto).toContain('se cargaron tras reintentar');
    expect(texto).toContain('PP: 137');
  });
});
