import { Component } from '@angular/core';
import {UseSignalInputComponent} from "../use-signal-input/use-signal-input.component";

@Component({
  selector: 'app-signal-input',
  standalone: true,
  imports: [
    UseSignalInputComponent
  ],
  templateUrl: './signal-input.component.html',
  styleUrl: './signal-input.component.css'
})
export class SignalInputComponent {
  counter = 10;
  onIncrement() {
    this.counter++;
  }
}
