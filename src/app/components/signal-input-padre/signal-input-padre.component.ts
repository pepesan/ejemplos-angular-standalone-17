import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {SignalInputHijoComponent} from "../signal-input-hijo/signal-input-hijo.component";

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
@Component({
    selector: 'app-signal-input-padre',
    imports: [
    SignalInputHijoComponent,
    AvisoApiComponent
  ],
    templateUrl: './signal-input-padre.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './signal-input-padre.component.css'
})
export class SignalInputPadreComponent {
  // Estado local como signal: el hijo recibe su valor actual mediante `[value]="counter()"`.
  counter = signal(10);
  onIncrement() {
    this.counter.update(v => v + 1);
  }
}
