import {Component, input, InputSignal, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-signal-input-hijo',
    imports: [],
    templateUrl: './signal-input-hijo.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './signal-input-hijo.component.css'
})
export class SignalInputHijoComponent {
  // `input()` crea un input de solo lectura; el valor predeterminado lo hace opcional.
  // Este componente (el que RECIBE el dato) lo maneja como signal: `value` es un
  // `InputSignal<number>` y se lee llamándolo, `value()`, tanto en la plantilla como aquí.
  // El padre NO pasa un signal: pasa el valor, `[value]="counter()"`, y Angular actualiza
  // este signal cada vez que ese valor cambia. Por eso se puede usar en `computed()`/`effect()`
  // y funciona con `OnPush`. Para escribir de vuelta al padre se usaría `model()`.
  value: InputSignal<number> = input(0);
  // Para exigir que el componente padre proporcione este input, usa `input.required<number>()`.
  // value: InputSignal<number> = input.required();
  // Un alias permite enlazarlo desde la plantilla con el nombre público `valor`.
  // value: InputSignal<number> = input(0, { alias: "valor"});
}
