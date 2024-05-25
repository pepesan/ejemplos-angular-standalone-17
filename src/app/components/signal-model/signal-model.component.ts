import {Component, model, ModelSignal} from '@angular/core';

@Component({
  selector: 'app-signal-model',
  standalone: true,
  imports: [],
  templateUrl: './signal-model.component.html',
  styleUrl: './signal-model.component.css'
})
export class SignalModelComponent {
  // This is a model input.
  // [(checked)]="variable" en la llamada al componente
  checked: ModelSignal<boolean> = model(false);


  toggle() {
    // While standard inputs are read-only, you can write directly to model inputs.
    this.checked.set(!this.checked());
  }
}
