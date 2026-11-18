import { Component, signal, WritableSignal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {Resultado} from "./resultado";
import {ResultadoService} from "./resultado.service";
import { AsyncPipe } from "@angular/common";
import {Observable, Subscription} from "rxjs";
import {EnunciadoComponent} from "../enunciado/enunciado.component";

@Component({
  selector: 'app-ejercicio-resultado',
  imports: [
    AsyncPipe,
    EnunciadoComponent
  ],
  templateUrl: './ejercicio-resultado.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ejercicio-resultado.component.css'
})
export class EjercicioResultadoComponent implements OnDestroy {

  public listado: Promise<Resultado[]> ;

  // Comparación didáctica: la conversión de abajo es legado; usa firstValueFrom/lastValueFrom en código nuevo.
  // La signal conserva el último resultado recibido del Observable.
  public partidosSignal: WritableSignal<Resultado[]> = signal<Resultado[]>([]);
  private resultadosObservable: Observable<Resultado[]>;
  private resultadosObservableSubscription: Subscription;

  constructor(private resultadoService: ResultadoService) {
    // Ejemplo legado para comparar Promesa y Observable; `toPromise()` está obsoleto.
    this.listado = this.resultadoService.getData().toPromise();

    // La suscripción actualiza el estado local; se libera en ngOnDestroy.
    this.resultadosObservable = this.resultadoService.getData();
    this.resultadosObservableSubscription = this.resultadosObservable.subscribe(
      data =>{
        this.partidosSignal.set(data);
      }
    );
  }


  ngOnDestroy(): void {
    this.resultadosObservableSubscription.unsubscribe();
  }


}
