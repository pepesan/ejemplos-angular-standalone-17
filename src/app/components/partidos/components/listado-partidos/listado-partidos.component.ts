import {Component, OnDestroy, OnInit, signal, WritableSignal, ChangeDetectionStrategy} from '@angular/core';
import {ApiClientService} from "../../services/apiclient.service";
import {Partido} from "../../models/partido";
import {Observable, Subscription} from "rxjs";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: 'app-listado-partidos',
    imports: [
    AsyncPipe
],
    templateUrl: './listado-partidos.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./listado-partidos.component.sass']
})
export class ListadoPartidosComponent implements OnInit, OnDestroy {

  // Comparación didáctica: esta conversión usa `toPromise()`, API obsoleta; en código nuevo se prefiere firstValueFrom/lastValueFrom.
  public listado: Promise<Partido[]> ;
  // El Observable representa el flujo asíncrono; la vista puede consumirlo con AsyncPipe.
  public listadopartidosObservable: Observable<Partido[]>;
  public listadopartidosObservableSubscription: Subscription | undefined;
  public listadoVisible: Partido[] = [];
  public listadoVisiblePromesa: Partido[] | undefined = [];
  public listadoVisiblePromesaProcesada: Partido[] = [];
  public listadoVisibleSubscribeProcesado: Partido[] = [];
  // Signal para conservar localmente el último conjunto recibido del servicio.
  public partidosSignal: WritableSignal<Partido[]> = signal<Partido[]>([]);
  // Variante didáctica que va acumulando elementos procesados en una signal.
  public listadoVisibleSignals: WritableSignal<Partido[]> = signal<Partido[]>([]);

  // inyección de dependencias del servicio ApiClientService
  constructor(private apiClientService: ApiClientService) {
    // Conversión heredada para comparar Promesas con Observables; no usar `toPromise()` en código nuevo.
    this.listado = this.apiClientService.getData().toPromise();

    // Devuelve un Observable
    // this.listado = this.apiClientService.getDataAsync();
    this.listadopartidosObservable = this.apiClientService.getData();

    // La suscripción explícita permite mostrar el procesamiento incremental y practicar su limpieza en ngOnDestroy.
    this.listadopartidosObservableSubscription =
      this.listadopartidosObservable.subscribe(
        (data: Partido[]): void =>
        {
        console.log(data);
        console.log(data.length);
        // Ejemplo incremental: se añade una marca a cada nombre y se acumulan los elementos.
        data.forEach( (value : Partido) =>{
            value.nombre += "!";
            this.listadoVisible.push(value)
        });
        // Asignación completa para comparar con el procesamiento incremental anterior.
        this.listadoVisible = data;

        console.log(this.listadoVisible);
      });
    // La suscripción adapta el flujo RxJS al estado local de la signal.
    this.apiClientService.getData().subscribe(
      (data: Partido[]) =>{
        this.partidosSignal.set(data);
      }
    );

    // Variante de comparación: procesa cada elemento antes de añadirlo al estado de la signal.
    this.apiClientService.getData().subscribe(
      (data: Partido[]) =>{
        //this.partidosSignal.set(data);
        data.forEach( (value : Partido) => {
          // Transformación de ejemplo para hacer visible el procesamiento.
          value.nombre += "!";
          this.listadoVisibleSignals.update((listadoActual: Partido[]) => {
            listadoActual.push(value);
            return listadoActual;
          });
        });
      }
    );
  }

  ngOnInit(): void {
    // console.log(this.listado);
    let listadoPromesa = this.listadopartidosObservable.toPromise();
    listadoPromesa.then(
      (data: Partido[] | undefined): void =>
      {
        this.listadoVisiblePromesa = data;
      }
    );
    listadoPromesa.catch(
      (error): void =>{
        console.log("Promise rejected with " + JSON.stringify(error));
      }
    );



    let datosPromesa = this.apiClientService.getProcesedDataAsync();
    console.log("datos promesa");
    datosPromesa.then(
      (data: Partido[])=>{
        console.log(data);
        this.listadoVisiblePromesaProcesada = data;
      }
    );
    datosPromesa.catch(
      (error)=>{
        console.log("Promise rejected with " + JSON.stringify(error));
      }
    );
    let datosSubscribe = this.apiClientService.getProcesedSubscribeDataAsync();
    console.log("datos subscribe");
    datosSubscribe.then(
      (data: Partido[]): void => {
        console.log(data);
        this.listadoVisibleSubscribeProcesado = data;
      }
    );
    datosSubscribe.catch(
      (error)=>{
        console.log("Promise rejected with " + JSON.stringify(error));
      }
    );
  }
  ngOnDestroy(): void {
    // unsubscribe

    if(this.listadopartidosObservableSubscription){
      this.listadopartidosObservableSubscription.unsubscribe();
    }


  }

}
