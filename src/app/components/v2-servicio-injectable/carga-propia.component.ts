import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContadorInjectableService } from '../../services/contador-injectable.service';

/**
 * INSTANCIA PROPIA: NO es singleton.
 * Aunque el servicio es `providedIn: 'root'`, este componente lo declara en `providers`. Angular busca el proveedor
 * empezando por el inyector del propio componente, lo encuentra aquí y crea una instancia nueva, atada a la vida del
 * componente: se destruye con él. Los componentes A y B siguen usando la instancia raíz.
 */
@Component({
  selector: 'app-carga-propia',
  providers: [ContadorInjectableService],
  template: `
    <section class="card h-100 border-warning" aria-labelledby="carga-propia-title">
      <div class="card-body">
        <h2 class="h5 card-title" id="carga-propia-title">Componente C · instancia propia</h2>
        <p class="small text-body-secondary mb-2">Declara <code>providers: [ContadorInjectableService]</code></p>
        <p class="mb-1">Instancia del servicio: <strong>#{{ contador.id }}</strong></p>
        <p class="mb-2">Valor: <strong>{{ contador.valor() }}</strong></p>
        <button class="btn btn-warning" type="button" (click)="contador.incrementar()">Incrementar desde C</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CargaPropiaComponent {
  protected readonly contador = inject(ContadorInjectableService);
}
