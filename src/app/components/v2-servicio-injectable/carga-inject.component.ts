import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContadorInjectableService } from '../../services/contador-injectable.service';

/**
 * CARGA CON inject(). Pide la MISMA instancia que el componente A: el modo de pedirla (constructor o `inject()`)
 * no cambia el ámbito. Lo que decide si es singleton es dónde está registrado el servicio, no cómo se pide.
 * `inject()` solo funciona en un contexto de inyección: constructor, inicializadores de campo (como aquí) o
 * funciones que Angular ejecuta dentro de uno (guardas, interceptores, factorías...).
 */
@Component({
  selector: 'app-carga-inject',
  template: `
    <section class="card h-100 border-primary" aria-labelledby="carga-inject-title">
      <div class="card-body">
        <h2 class="h5 card-title" id="carga-inject-title">Componente B · inject()</h2>
        <p class="small text-body-secondary mb-2">Lo carga con <code>inject(ContadorInjectableService)</code></p>
        <p class="mb-1">Instancia del servicio: <strong>#{{ contador.id }}</strong></p>
        <p class="mb-2">Valor: <strong>{{ contador.valor() }}</strong></p>
        <button class="btn btn-primary" type="button" (click)="contador.incrementar()">Incrementar desde B</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CargaInjectComponent {
  protected readonly contador = inject(ContadorInjectableService);
}
