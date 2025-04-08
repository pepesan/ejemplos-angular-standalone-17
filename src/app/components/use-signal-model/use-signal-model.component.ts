import {Component, signal} from '@angular/core';
import {SignalModelComponent} from "../signal-model/signal-model.component";

/*
   Diferencias entre input y model:
    - model() defines both an input and an output. The output's name is always the name of
    the input suffixed with Change to support two-way bindings. It will be up to the consumer
    of your directive to decide if they want to use just the input, just the output, or both.
    - ModelSignal is a WritableSignal which means that its value can be changed
    from anywhere using the set and update methods. When a new value is assigned,
    the ModelSignal will emit to its output. This is different from InputSignal
    which is read-only and can only be changed through the template.
    - Model inputs do not support input transforms while signal inputs do.
 */

@Component({
    selector: 'app-use-signal-model',
    imports: [
        SignalModelComponent
    ],
    templateUrl: './use-signal-model.component.html',
    styleUrl: './use-signal-model.component.css'
})
export class UseSignalModelComponent {
  // al cambiar el modelo del componente hijo debería cambiar el valor del padre
  // se supone que es porque es tanto input como output
  protected isAdmin = false;
}
