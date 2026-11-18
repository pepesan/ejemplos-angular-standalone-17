import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EstadoCompartidoService } from '../../services/estado-compartido.service';
import { V2EstadoCompartidoComponent } from './v2-estado-compartido.component';

describe('V2EstadoCompartidoComponent', () => {
  function crear() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(V2EstadoCompartidoComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const boton = (nombre: string) =>
      Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.trim() === nombre)!;
    return { fixture, el, boton };
  }

  it('el componente A cambia el estado y el componente B lo muestra, junto con su valor derivado', () => {
    const { fixture, el, boton } = crear();
    const resumen = () => el.querySelector('app-contador-resumen')!.textContent ?? '';
    expect(resumen()).toContain('0');

    boton('Incrementar').click();
    boton('Incrementar').click();
    boton('Incrementar').click();
    fixture.detectChanges();

    expect(el.querySelector('app-contador-resumen [aria-live]')?.textContent).toContain('3');
    expect(resumen()).toContain('(doble): 6');
    expect(el.querySelector('app-contador-controles')!.textContent).toContain('3');

    boton('Decrementar').click();
    fixture.detectChanges();
    expect(el.querySelector('app-contador-resumen [aria-live]')?.textContent).toContain('2');

    boton('Reiniciar').click();
    fixture.detectChanges();
    expect(el.querySelector('app-contador-resumen [aria-live]')?.textContent).toContain('0');
  });

  it('ambos componentes usan la misma instancia singleton del servicio', () => {
    const { fixture } = crear();
    const servicio = TestBed.inject(EstadoCompartidoService);
    servicio.incrementar();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-contador-resumen [aria-live]')?.textContent).toContain('1');
  });

  it('el estado se expone de solo lectura: el servicio no ofrece set() ni update() públicos', () => {
    const servicio = TestBed.inject(EstadoCompartidoService) as unknown as Record<string, unknown>;
    expect((servicio['valor'] as Record<string, unknown>)['set']).toBeUndefined();
    expect((servicio['valor'] as Record<string, unknown>)['update']).toBeUndefined();
  });
});
