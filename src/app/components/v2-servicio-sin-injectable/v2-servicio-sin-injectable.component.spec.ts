import { Service } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContadorPlanoService } from '../../services/contador-plano.service';
import { V2ServicioSinInjectableComponent } from './v2-servicio-sin-injectable.component';

describe('V2ServicioSinInjectableComponent', () => {
  function crear() {
    const fixture = TestBed.createComponent(V2ServicioSinInjectableComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const boton = (nombre: string) =>
      Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.trim() === nombre)!;
    return { fixture, el, boton };
  }

  it('usa un servicio sin @Injectable registrado en providers y lo muestra', () => {
    const { el } = crear();
    expect(el.querySelector('[aria-live]')?.textContent).toContain('Valor: 0');
  });

  it('incrementa y reinicia el valor del servicio desde la plantilla', () => {
    const { fixture, el, boton } = crear();

    boton('Incrementar').click();
    boton('Incrementar').click();
    fixture.detectChanges();
    expect(el.querySelector('[aria-live]')?.textContent).toContain('Valor: 2');

    boton('Reiniciar').click();
    fixture.detectChanges();
    expect(el.querySelector('[aria-live]')?.textContent).toContain('Valor: 0');
  });

  it('cada componente recibe su propia instancia del servicio (no es singleton)', () => {
    const a = crear();
    const b = crear();
    a.boton('Incrementar').click();
    a.fixture.detectChanges();
    b.fixture.detectChanges();

    expect(a.el.querySelector('[aria-live]')?.textContent).toContain('Valor: 1');
    expect(b.el.querySelector('[aria-live]')?.textContent).toContain('Valor: 0');
  });

  it('el servicio no está registrado a nivel de raíz', () => {
    expect(() => TestBed.inject(ContadorPlanoService)).toThrow();
  });
});

// Comprueba lo que explica la página sobre `@Service()` (Angular 22).
describe('@Service() frente a un servicio sin decorador', () => {
  @Service()
  class CompartidoService {}

  @Service({ autoProvided: false })
  class SoloConProvidersService {}

  it('@Service() es singleton: se registra solo y siempre devuelve la misma instancia', () => {
    expect(TestBed.inject(CompartidoService)).toBe(TestBed.inject(CompartidoService));
  });

  it('@Service({ autoProvided: false }) no se registra solo', () => {
    expect(() => TestBed.inject(SoloConProvidersService)).toThrow();
  });

  it('@Service({ autoProvided: false }) funciona al declararlo en providers', () => {
    TestBed.configureTestingModule({ providers: [SoloConProvidersService] });
    expect(TestBed.inject(SoloConProvidersService)).toBeInstanceOf(SoloConProvidersService);
  });
});
