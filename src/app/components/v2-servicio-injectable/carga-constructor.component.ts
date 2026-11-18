import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContadorInjectableService } from '../../services/contador-injectable.service';

/**
 * CARGA POR CONSTRUCTOR (inyección de dependencias clásica).
 * Angular lee el tipo del parámetro y entrega la instancia que haya registrada. Esto solo es posible con servicios
 * `@Injectable()`; `@Service()` no admite inyección por constructor (guía oficial de servicios de angular.dev).
 * El servicio es `providedIn: 'root'` y este componente no declara `providers`: recibe la instancia SINGLETON.
 */
@Component({
  selector: 'app-carga-constructor',
  template: `
    <section class="card h-100" aria-labelledby="carga-constructor-title">
      <div class="card-body">
        <h2 class="h5 card-title" id="carga-constructor-title">Componente A · constructor</h2>
        <p class="small text-body-secondary mb-2">Lo carga con <code>constructor(private contador: ...)</code></p>
        <p class="mb-1">Instancia del servicio: <strong>#{{ contador.id }}</strong></p>
        <p class="mb-2">Valor: <strong>{{ contador.valor() }}</strong></p>
        <button class="btn btn-primary" type="button" (click)="contador.incrementar()">Incrementar desde A</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CargaConstructorComponent {
  constructor(protected readonly contador: ContadorInjectableService) {}
}
