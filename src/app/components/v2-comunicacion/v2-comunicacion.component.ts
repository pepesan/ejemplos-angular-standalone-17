import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, InputSignal, Output, OutputEmitterRef, QueryList, ViewChild, ViewChildren, WritableSignal, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AvisoApiComponent } from '../aviso-api/aviso-api.component';

@Component({
  selector: 'app-boton-evento-clasico',
  standalone: true,
  template: '<button class="btn btn-outline-primary" type="button" (click)="seleccion.emit(texto)">{{ texto }}</button>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonEventoClasicoComponent {
  @Input({ required: true }) texto!: string;
  @Output() seleccion: EventEmitter<string> = new EventEmitter<string>();
}

@Component({
  selector: 'app-boton-evento-signal',
  standalone: true,
  template: '<button class="btn btn-primary" type="button" (click)="seleccion.emit(texto())">{{ texto() }}</button>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// DISPONIBILIDAD: `input()` y `output()` son estables desde Angular 19 (según angular.dev).
// Sustituyen a `@Input()` y `@Output()` + `EventEmitter` del componente clásico anterior.
export class BotonEventoSignalComponent {
  readonly texto: InputSignal<string> = input.required<string>();
  readonly seleccion: OutputEmitterRef<string> = output<string>();
}

@Component({
  selector: 'app-panel-proyectado',
  standalone: true,
  template: '<article class="card"><header class="card-header"><ng-content select="[panelTitle]"></ng-content></header><div class="card-body"><ng-content></ng-content></div></article>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelProyectadoComponent {}

@Component({
  selector: 'app-v2-comunicacion',
  standalone: true,
  imports: [AvisoApiComponent, BotonEventoClasicoComponent, BotonEventoSignalComponent, PanelProyectadoComponent],
  templateUrl: './v2-comunicacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2ComunicacionComponent {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  @ViewChild('campoNombre') private campoNombre?: ElementRef<HTMLInputElement>;
  @ViewChildren(BotonEventoSignalComponent) botonesSignal!: QueryList<BotonEventoSignalComponent>;

  readonly mostrarBotonExtra: WritableSignal<boolean> = signal(true);
  readonly cantidadBotonesSignal: WritableSignal<number> = signal(0);
  readonly ultimoEvento: WritableSignal<string> = signal('Todavía no se ha emitido ningún evento.');

  constructor() {
    // Las queries se rellenan tras crear la vista; escucha también los cambios de hijos posteriores.
    afterNextRender(() => {
      this.cantidadBotonesSignal.set(this.botonesSignal.length);
      this.botonesSignal.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((botones) => {
        this.cantidadBotonesSignal.set(botones.length);
      });
    });
  }

  enfocarCampo(): void {
    this.campoNombre?.nativeElement.focus();
  }

  alternarBotonExtra(): void {
    this.mostrarBotonExtra.update((visible) => !visible);
  }

  registrarEvento(texto: string): void {
    this.ultimoEvento.set(`El padre recibió: ${texto}`);
  }
}
