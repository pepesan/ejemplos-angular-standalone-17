import {Component, input, InputSignal, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-use-signal-input',
    imports: [],
    templateUrl: './use-signal-input.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './use-signal-input.component.css'
})
export class UseSignalInputComponent {
  // `input()` crea un input de solo lectura; el valor predeterminado lo hace opcional.
  value: InputSignal<number> = input(0);
  // Para exigir que el componente padre proporcione este input, usa `input.required<number>()`.
  // value: InputSignal<number> = input.required();
  // Un alias permite enlazarlo desde la plantilla con el nombre público `valor`.
  // value: InputSignal<number> = input(0, { alias: "valor"});
}
