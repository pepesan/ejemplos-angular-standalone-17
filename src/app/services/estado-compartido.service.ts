import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EstadoCompartidoService {
  private readonly valorInterno = signal(0);

  readonly valor = this.valorInterno.asReadonly();
  readonly doble = computed(() => this.valor() * 2);

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
