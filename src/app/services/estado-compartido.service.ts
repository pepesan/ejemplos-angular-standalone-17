import { computed, Service, Signal, signal, WritableSignal } from '@angular/core';

/**
 * ESTADO COMPARTIDO CON SIGNALS en un servicio `@Service()` (Angular 22.0 o posterior).
 *
 * ¿ES SINGLETON? SÍ, y es justo lo que hace posible compartir estado. `@Service()` lo registra en el inyector raíz:
 * hay una sola instancia, así que todos los componentes que la pidan (con `inject()`) leen y escriben el mismo
 * Signal. Sin `providers` en ningún componente. Si un componente lo declarara en `providers`, recibiría su propia
 * copia y dejaría de compartir el estado (ver `v2/servicio-injectable`, componente C).
 *
 * LÍMITES: solo desde Angular 22.0 (antes: `@Injectable({ providedIn: 'root' })`) y solo con `inject()`.
 *
 * El patrón: el estado es privado y escribible (`valorInterno`); se expone de solo lectura (`asReadonly()`) y los
 * cambios solo entran por los métodos del servicio. Los valores derivados son `computed()`, no `effect()`.
 * Para estado global más complejo, NgRx ofrece SignalStore.
 */
@Service()
export class EstadoCompartidoService {
  private readonly valorInterno: WritableSignal<number> = signal(0);

  readonly valor: Signal<number> = this.valorInterno.asReadonly();
  readonly doble: Signal<number> = computed(() => this.valor() * 2);

  incrementar(): void {
    this.valorInterno.update((valor) => valor + 1);
  }

  decrementar(): void {
    this.valorInterno.update((valor) => valor - 1);
  }

  reiniciar(): void {
    this.valorInterno.set(0);
  }
}
