import {Component, effect, signal} from '@angular/core';

/*
 Usos del effect:
 - Logging data being displayed and when it changes, either for analytics or as a debugging tool.
 - Keeping data in sync with window.localStorage.
 - Adding custom DOM behavior that can't be expressed with template syntax.
 - Performing custom rendering to a <canvas>, charting library, or other third party UI library.
 */

@Component({
    selector: 'app-signal-effect',
    imports: [],
    templateUrl: './signal-effect.component.html',
    styleUrl: './signal-effect.component.css'
})
export class SignalEffectComponent {
  count = signal(0); // Definimos el valor inicial del contador como 0

  constructor() {
    // Creamos un efecto para registrar el valor del contador cada vez que cambia
    effect(() => {
      console.log(`The current count is: ${this.count()}`);
    });
  }

  increment() {
    this.count.update((value) => value + 1); // Incrementamos el valor del contador
  }
}
