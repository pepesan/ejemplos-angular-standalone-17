import {Component, model, ModelSignal, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-signal-model',
    imports: [],
    templateUrl: './signal-model.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './signal-model.component.css'
})
export class SignalModelComponent {
  // `model()` permite que el hijo proponga cambios al padre mediante [(checked)].
  checked: ModelSignal<boolean> = model(false);


  toggle() {
    // A diferencia de `input()`, el hijo puede escribir en un `ModelSignal`.
    this.checked.set(!this.checked());
  }
}
