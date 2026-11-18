import { Injectable, signal } from '@angular/core';

/**
 * SERVICIO con `@Injectable({ providedIn: 'root' })`: el estilo clásico, válido en todas las versiones de Angular.
 *
 * ¿ES SINGLETON? DEPENDE DE DÓNDE SE REGISTRE:
 *  - Con `providedIn: 'root'` y sin más: SÍ. Una única instancia en toda la app. Cualquier componente la recibe
 *    igual, la pida con el constructor o con `inject()`: ese es solo el modo de pedirla y no cambia el ámbito.
 *  - Si un componente lo declara además en `providers`: NO. Ese componente (y sus hijos de vista) recibe una
 *    instancia nueva, independiente de la raíz. Ver `CargaPropiaComponent`.
 *  - Sin `providedIn` (`@Injectable()` a secas): no se registra solo; hay que declararlo siempre en `providers`
 *    o Angular lanza un error de «No provider for ...».
 *
 * `id` numera cada instancia creada para que se vea en pantalla cuándo dos componentes comparten la misma.
 */
@Injectable({ providedIn: 'root' })
export class ContadorInjectableService {
  private static instanciasCreadas = 0;

  /** Número de instancia: si dos componentes muestran el mismo, comparten servicio. */
  readonly id = ++ContadorInjectableService.instanciasCreadas;
  readonly valor = signal(0);

  incrementar(): void {
    this.valor.update((v) => v + 1);
  }
}
