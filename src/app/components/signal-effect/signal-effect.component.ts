import {Component, effect, signal, ChangeDetectionStrategy} from '@angular/core';

// Usa `effect` para sincronizar una señal con un sistema externo; para valores derivados, prefiere `computed`.

@Component({
    selector: 'app-signal-effect',
    imports: [],
    templateUrl: './signal-effect.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './signal-effect.component.css'
})
export class SignalEffectComponent {
  count = signal(0);

  constructor() {
    // Este efecto solo registra cambios; no calcula estado que la interfaz necesite derivar.
    effect(() => {
      console.log(`The current count is: ${this.count()}`);
    });
  }

  increment() {
    this.count.update((value) => value + 1);
  }
}
