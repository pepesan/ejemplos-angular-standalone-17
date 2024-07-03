import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {ApiClientService} from "../../services/apiclient.service";
import {Partido} from "../../models/partido";
import {Observable, Subscription} from "rxjs";
import {AsyncPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

@Component({
  selector: 'app-listado-partidos',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './listado-partidos.component.html',
  styleUrls: ['./listado-partidos.component.sass']
})
export class ListadoPartidosComponent implements OnInit, OnDestroy {

  // Promesa que pasamos a la vista para cuando dispongamos del dato pintarlo por pantalla
  public listado: Promise<Partido[]> ;
  public listadopartidosObservable: Observable<Partido[]>;
  public listadopartidosObservableSubscription: Subscription;
  public listadoVisible: Partido[] = [];
  public listadoVisiblePromesa: Partido[] | undefined = [];
  public listadoVisiblePromesaProcesada: Partido[] = [];
  public listadoVisibleSubscribeProcesado: Partido[] = [];
  // Uso con señales
  public partidosSignal: WritableSignal<Partido[]> = signal<Partido[]>([]);
  // Uso de señales para datos "Procesados"
  public listadoVisibleSignals: WritableSignal<Partido[]> = signal<Partido[]>([]);
  constructor(private apiClientService: ApiClientService) {
    // Directamente consultamos al servicio para que devuelva una promesa con los datos del JSON
    this.listado = this.apiClientService.getData().toPromise();

    // Devuelve un Observable
    // this.listado = this.apiClientService.getDataAsync();
    this.listadopartidosObservable = this.apiClientService.getData();

    // Coloco los datos iniciales al listado visible
    this.listadoVisible = [];
    // me subscribo al observable y guardo la subscripción
    this.listadopartidosObservableSubscription =
      this.listadopartidosObservable.subscribe((data: Partido[]): void => {
        console.log(data);
        console.log(data.length);
        // pasar los datos una vez recibidos al listado visible
        // poco a poco
        data.forEach( (value : Partido) =>
          this.listadoVisible.push(value)
        );
        // del tirón
        this.listadoVisible = data;

        console.log(this.listadoVisible);
      });
    // Uso con señales
    this.apiClientService.getData().subscribe(
      // Define una función que se ejecutará cuando se disponga del dato
      // data es el dato recibido
      data =>{
        // cargar en la señal el dato descargado
        this.partidosSignal.set(data);
      }
    );

    // Uso con señales pero con "procesado"
    this.apiClientService.getData().subscribe(
      // Define una función que se ejecutará cuando se disponga del dato
      // data es el dato recibido
      data =>{
        // cargar en la señal el dato descargado
        //this.partidosSignal.set(data);
        data.forEach( (value : Partido) => {
          // Aquí iría el procesado de la información
          // ejemplo de procesado
          value.nombre += "!";
          // Iríamos actualizando los datos según vayan viviendo
          // Actualizamos la vista con cada dato procesado
          // Actualiando la variable signal metiendo el dato nuevo
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
