import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {UseSignalInputComponent} from "../use-signal-input/use-signal-input.component";

@Component({
    selector: 'app-signal-input',
    imports: [
        UseSignalInputComponent
    ],
    templateUrl: './signal-input.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './signal-input.component.css'
})
export class SignalInputComponent {
  // Estado local como signal: el hijo recibe su valor actual mediante `[value]="counter()"`.
  counter = signal(10);
  onIncrement() {
    this.counter.update(v => v + 1);
  }
}
