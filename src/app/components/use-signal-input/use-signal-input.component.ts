import {Component, input, InputSignal} from '@angular/core';

@Component({
  selector: 'app-use-signal-input',
  standalone: true,
  imports: [],
  templateUrl: './use-signal-input.component.html',
  styleUrl: './use-signal-input.component.css'
})
export class UseSignalInputComponent {
  // @Input
  // cada vez que cambie el signal en el componente madre cambia el input en la hija
  // por defecto el input es opcional
  value: InputSignal<number> = input(0);
  // para input requeridos
  // value: InputSignal<number> = input.required();
  // uso de alias debes cambiar la llamada al componente por [valor]
  // value: InputSignal<number> = input(0, { alias: "valor"});
  /*
   ¿Porqué usar los Signal Input?
    Signal inputs are more type safe:
      • Required inputs do not require initial values, or tricks to tell TypeScript that an input always has a value.
      • Transforms are automatically checked to match the accepted input values.
    Signal inputs, when used in templates, will automatically mark OnPush components as dirty.
    Values can be easily derived whenever an input changes using computed.
    Easier and more local monitoring of inputs using effect instead of ngOnChanges or setters.
   */
  // queda pendiende de documentar los deriving, monitor y value
}
