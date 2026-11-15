import {Component, computed, linkedSignal, OnInit, Signal, signal, WritableSignal, ChangeDetectionStrategy} from '@angular/core';
import { JsonPipe } from "@angular/common";
import {Dato} from "../propiedades/dato";

@Component({
    selector: 'app-signals',
  imports: [
    JsonPipe
],
    templateUrl: './signals.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./signals.component.sass']
})
export class SignalsComponent implements OnInit{
  // Signals también pueden contener objetos: su tipo se conserva en lectura y escritura.
  senalNumero: WritableSignal<number> = signal(0);
  senalCadena: WritableSignal<string> = signal("Valor");
  cadenasSignal: WritableSignal<string[]> = signal([]);
  senalDato: WritableSignal<Dato> = signal(new Dato());
  countSignal: WritableSignal<number> = signal(0);
  // `computed` deriva un valor de otras señales; no hace falta sincronizarlo con un efecto.
  doubleCount: Signal<number> = computed(() =>
    this.countSignal() * 2
  );

  // `linkedSignal` parte del valor de `count`, pero permite editarse de forma independiente.
  count = signal(0);
  linkedCount = linkedSignal(() => this.count());

  ngOnInit(): void {
    this.countSignal.set(2)
    // `update` recibe el valor actual y devuelve el siguiente.
    this.countSignal.update((value: number) =>
      value + 1
    );
    // `mutate()` ya no forma parte de la API; para arrays, usa `update()` y devuelve una referencia nueva.
    // this.cadenasSignal.mutate((value: string[]): void => {
    //   value.push("hola")
    // })
    this.cadenasSignal.set(["uno", "dos"])
    // Este ejemplo muta y devuelve la misma referencia; Signals puede no notificar ese cambio.
    // En código nuevo, crea una referencia nueva (por ejemplo, con [...listadoActual, 'tres']).
    this.cadenasSignal.update((listadoActual: string[]) => {
      listadoActual.push("tres");
      return listadoActual;
    })
  }
  cambia(){
    this.countSignal.set(this.countSignal() + 1)
    // La actualización inmutable también sirve para colecciones.
    // this.cadenasSignal.mutate((value: string[]): void =>{
    //   value.push("Adios")
    // })
  }


  cambiaLinked() {
    this.linkedCount.set(2);
  }

  cambiaCount() {
    this.count.update((value: number) => value +1 );
  }
}
