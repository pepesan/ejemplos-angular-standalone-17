import { Component, signal, WritableSignal, OnInit, OnDestroy } from '@angular/core';
import {Resultado} from "./resultado";
import {ResultadoService} from "./resultado.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-ejercicio-resultado',
  imports: [
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './ejercicio-resultado.component.html',
  styleUrl: './ejercicio-resultado.component.css'
})
export class EjercicioResultadoComponent implements OnDestroy {

  public listado: Promise<Resultado[]> ;

  // Uso con señales
  public partidosSignal: WritableSignal<Resultado[]> = signal<Resultado[]>([]);
  private resultadosObservable: Observable<Resultado[]>;
  private resultadosObservableSubscription: Subscription;

  constructor(private resultadoService: ResultadoService) {
    // Directamente consultamos al servicio para que devuelva una promesa con los datos del JSON
    this.listado = this.resultadoService.getData().toPromise();

    // Uso con señales
    this.resultadosObservable = this.resultadoService.getData();
    this.resultadosObservableSubscription = this.resultadosObservable.subscribe(
      // Define una función que se ejecutará cuando se disponga del dato
      // data es el dato recibido
      data =>{
        // cargar en la señal el dato descargado
        this.partidosSignal.set(data);
      }
    );
  }


  ngOnDestroy(): void {
    this.resultadosObservableSubscription.unsubscribe();
  }


}
