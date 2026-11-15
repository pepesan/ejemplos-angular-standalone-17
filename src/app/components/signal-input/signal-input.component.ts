import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  counter = 10;
  onIncrement() {
    this.counter++;
  }
}
