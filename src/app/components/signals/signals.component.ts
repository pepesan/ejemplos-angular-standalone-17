import {Component, computed, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {JsonPipe, NgForOf} from "@angular/common";
import {Dato} from "../propiedades/dato";

@Component({
    selector: 'app-signals',
  imports: [
    NgForOf,
    JsonPipe
  ],
    templateUrl: './signals.component.html',
    styleUrls: ['./signals.component.sass']
})
export class SignalsComponent implements OnInit{
  // defino una señal del tipo number
  senalNumero: WritableSignal<number> = signal(0);
  // defino una señal del tipo string
  senalCadena: WritableSignal<string> = signal("Valor");
  // definimos un signal que es un string[]
  cadenasSignal: WritableSignal<string[]> = signal([]);
  // defino una señal del tipo custom
  senalDato: WritableSignal<Dato> = signal(new Dato());
  // definición de una variable number de un contador con signals
  countSignal: WritableSignal<number> = signal(0);
  // Computed permite subscribirse al cambio de otro signal y aplicar una función que cambie el valor de la variable computada
  // cada vez que cambie count cambiará doubleCount, aplicando una función para el cálculo
  doubleCount: Signal<number> = computed(() => this.countSignal() * 2);

  // Signals are getter functions - calling them reads their value.

  ngOnInit(): void {
    // cambiar un valor por otro
    this.countSignal.set(2)
    // Increment the count by 1.
    // Cambiar el valor usando un a función dependiendo del valor actual del signal
    this.countSignal.update((value: number) => value + 1);
    // Mutate cambia el valor interno sin reescribir su contenido (fallo en v17)
    // this.cadenasSignal.mutate((value: string[]): void => {
    //   value.push("hola")
    // })
    // Modificación de señales para arrays
    this.cadenasSignal.set(["uno", "dos"])
    // Modificación manteniendo contenido anterior
    this.cadenasSignal.update((listadoActual: string[]) => {
      listadoActual.push("tres");
      return listadoActual;
    })
  }
  cambia(){
    this.countSignal.set(this.countSignal() + 1)
    /// Fallo en v17
    // this.cadenasSignal.mutate((value: string[]): void =>{
    //   value.push("Adios")
    // })
  }


}
