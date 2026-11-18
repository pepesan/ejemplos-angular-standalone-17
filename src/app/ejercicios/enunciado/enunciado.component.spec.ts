import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EnunciadoComponent } from './enunciado.component';

@Component({
  imports: [EnunciadoComponent],
  template: `
    <app-enunciado titulo="Ejercicio de prueba">
      <p id="texto">Haz algo.</p>
      <div solucion><p id="resultado">Hecho.</p></div>
    </app-enunciado>
  `,
})
class AnfitrionComponent {}

describe('EnunciadoComponent', () => {
  it('muestra el título, el enunciado y después la posible solución', () => {
    const fixture = TestBed.createComponent(AnfitrionComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h1')?.textContent).toContain('Ejercicio de prueba');
    const enunciado = el.querySelector('#texto')!;
    const solucion = el.querySelector('#resultado')!;
    expect(enunciado).toBeTruthy();
    expect(solucion).toBeTruthy();
    expect(el.querySelector('.solucion h2')?.textContent).toContain('Posible solución');
    // El enunciado precede a la solución en el documento.
    expect(enunciado.compareDocumentPosition(solucion) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // La solución no se cuela dentro del bloque del enunciado.
    expect(el.querySelector('.enunciado')?.contains(solucion)).toBe(false);
  });
});
