import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EstadoCompartidoService } from '../../services/estado-compartido.service';

@Component({
  selector: 'app-contador-controles',
  template: `
    <section class="card h-100" aria-labelledby="contador-controles-title">
      <div class="card-body">
        <h2 class="h5 card-title" id="contador-controles-title">Componente A · Controles</h2>
        <p>Valor que lee este componente: <strong>{{ estado.valor() }}</strong></p>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-primary" type="button" (click)="estado.incrementar()">Incrementar</button>
          <button class="btn btn-outline-primary" type="button" (click)="estado.decrementar()">Decrementar</button>
          <button class="btn btn-outline-secondary" type="button" (click)="estado.reiniciar()">Reiniciar</button>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContadorControlesComponent {
  readonly estado: EstadoCompartidoService = inject(EstadoCompartidoService);
}
