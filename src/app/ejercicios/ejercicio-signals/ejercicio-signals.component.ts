import {Component, computed, Signal, signal, WritableSignal} from '@angular/core';

@Component({
  selector: 'app-ejercicio-signals',
  imports: [],
  templateUrl: './ejercicio-signals.component.html',
  styleUrl: './ejercicio-signals.component.css'
})
export class EjercicioSignalsComponent {

  public numeroSenal: WritableSignal<number> = signal(3);
  public mitadSenal: Signal<number> = computed(
    () => this.numeroSenal() / 2
  );

  constructor() {
    // cambiar un valor por otro
    this.numeroSenal.set(7)
  }

}
