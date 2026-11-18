import {Component, computed, Signal, signal, WritableSignal, ChangeDetectionStrategy} from '@angular/core';
import {EnunciadoComponent} from "../enunciado/enunciado.component";

import {AvisoApiComponent} from "../../components/aviso-api/aviso-api.component";
@Component({
  selector: 'app-ejercicio-signals',
  imports: [
    EnunciadoComponent,
    AvisoApiComponent
  ],
  templateUrl: './ejercicio-signals.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
