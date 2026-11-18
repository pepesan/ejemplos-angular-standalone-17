import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Estructura común de los ejercicios: primero el enunciado y, debajo, la posible solución.
 *
 * Uso:
 * ```html
 * <app-enunciado titulo="Ejercicio de servicios">
 *   <p>Texto del enunciado…</p>
 *   <div solucion> …la solución propuesta… </div>
 * </app-enunciado>
 * ```
 * El contenido sin marcar es el enunciado; el elemento con el atributo `solucion` es la solución.
 */
@Component({
  selector: 'app-enunciado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="enunciado card mb-4" aria-labelledby="enunciado-titulo">
      <div class="card-body">
        <h1 class="h4" id="enunciado-titulo">{{ titulo() }}</h1>
        <h2 class="h6 text-uppercase text-secondary">Enunciado</h2>
        <ng-content />
      </div>
    </section>
    <section class="solucion" aria-labelledby="solucion-titulo">
      <h2 class="h5" id="solucion-titulo">Posible solución</h2>
      <ng-content select="[solucion]" />
    </section>
  `,
  styles: `
    :host { display: block; }
    .enunciado { border-left: 0.35rem solid var(--bs-primary, #0d6efd); }
  `,
})
export class EnunciadoComponent {
  readonly titulo = input.required<string>();
}
