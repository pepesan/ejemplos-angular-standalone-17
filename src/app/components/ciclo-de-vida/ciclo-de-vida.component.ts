import {
  Component, OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked, OnDestroy, SimpleChanges, computed, Signal, signal, WritableSignal
} from '@angular/core';

@Component({
  selector: 'app-ciclo-vida',
  imports: [],
  templateUrl: './ciclo-de-vida.component.html',
  styleUrl: './ciclo-de-vida.component.css',
})
export class CicloDeVidaComponent implements OnInit, OnChanges, DoCheck,
  AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

  dato: string = 'Hola mundo';

  // definición de una variable number de un contador con signals
  countSignal: WritableSignal<number> = signal(0);
  // Computed permite subscribirse al cambio de otro signal y aplicar una función que cambie el valor de la variable computada
  // cada vez que cambie count cambiará doubleCount, aplicando una función para el cálculo
  doubleCount: Signal<number> = computed(() => this.countSignal() * 2);



  constructor() {
    console.log('Constructor: se ha creado el componente');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges: cambios detectados en @Input', changes);
  }

  ngOnInit(): void {
    console.log('ngOnInit: inicialización del componente');
  }

  ngDoCheck(): void {
    console.log('ngDoCheck: detección manual de cambios');
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit: contenido proyectado inicializado');
  }

  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked: contenido proyectado verificado');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: vista del componente inicializada');
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked: vista del componente verificada');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy: limpieza antes de destruir el componente');
  }
  cambia(){
    this.dato = 'Hola mundo cambiado';
    console.log('Cambiando dato');
  }

  cambiaSegnal() {
    this.countSignal.set(2);
  }
}
