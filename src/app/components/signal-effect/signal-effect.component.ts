import {Component, effect, signal, WritableSignal, ChangeDetectionStrategy} from '@angular/core';

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
// DISPONIBILIDAD: `effect()` es estable desde Angular 20 (según angular.dev). `linkedSignal()` también.
// Usa `effect` para sincronizar una señal con un sistema externo; para valores derivados, prefiere `computed`.

@Component({
    selector: 'app-signal-effect',
    imports: [
    AvisoApiComponent
  ],
    templateUrl: './signal-effect.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './signal-effect.component.css'
})
export class SignalEffectComponent {
  count: WritableSignal<number> = signal(0);

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
