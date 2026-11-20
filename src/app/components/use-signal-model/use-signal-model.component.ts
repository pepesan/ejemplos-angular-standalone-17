import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {SignalModelComponent} from "../signal-model/signal-model.component";

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
// `model()` expone un valor escribible como input y emite los cambios por el output `...Change`.
// Usa `input()` cuando el hijo solo deba recibir el valor y no proponer cambios al padre.

@Component({
    selector: 'app-use-signal-model',
    imports: [
    SignalModelComponent,
    AvisoApiComponent
  ],
    templateUrl: './use-signal-model.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './use-signal-model.component.css'
})
export class UseSignalModelComponent {
  // El componente hijo puede actualizar este modelo y el enlace [(isAdmin)] refleja el cambio aquí.
  protected isAdmin: boolean = false;
}
