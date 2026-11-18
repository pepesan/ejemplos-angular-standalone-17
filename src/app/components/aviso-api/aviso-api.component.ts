import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type TipoAviso = 'legado' | 'moderno';

/**
 * Aviso de disponibilidad de una API de Angular, con el mismo patrón que el ejemplo de directivas obsoletas:
 *  - `legado`: enfoque clásico u obsoleto; enlaza a la alternativa recomendada.
 *  - `moderno`: API reciente; indica desde qué versión de Angular es estable.
 * El texto del aviso es el contenido proyectado. Las versiones se anotan "según angular.dev".
 */
@Component({
  selector: 'app-aviso-api',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="alert py-2 px-3 small mb-3" [class]="clase()" role="note" [attr.data-tipo]="tipo()">
      <strong>{{ titulo() }}</strong>{{ ' ' }}<ng-content />
      @if (alternativa()) {
        <a [routerLink]="alternativa()">{{ textoAlternativa() }}</a>.
      }
    </aside>
  `,
})
export class AvisoApiComponent {
  readonly tipo = input<TipoAviso>('moderno');
  readonly titulo = input.required<string>();
  /** Ruta de la alternativa recomendada (solo para avisos `legado`). */
  readonly alternativa = input<string>();
  readonly textoAlternativa = input('ver la alternativa recomendada');

  protected readonly clase = computed(() => (this.tipo() === 'legado' ? 'alert-warning' : 'alert-success'));
}
