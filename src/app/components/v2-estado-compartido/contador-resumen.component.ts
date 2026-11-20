import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EstadoCompartidoService } from '../../services/estado-compartido.service';

@Component({
  selector: 'app-contador-resumen',
  template: `
    <section class="card h-100 border-primary" aria-labelledby="contador-resumen-title">
      <div class="card-body">
        <h2 class="h5 card-title" id="contador-resumen-title">Componente B · Resumen</h2>
        <p class="display-4 mb-1" aria-live="polite">{{ estado.valor() }}</p>
        <p class="text-body-secondary mb-0">Valor derivado (doble): <strong>{{ estado.doble() }}</strong></p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContadorResumenComponent {
  readonly estado: EstadoCompartidoService = inject(EstadoCompartidoService);
}
