import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, Output, QueryList, ViewChild, ViewChildren, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-boton-evento-clasico',
  standalone: true,
  template: '<button class="btn btn-outline-primary" type="button" (click)="seleccion.emit(texto)">{{ texto }}</button>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonEventoClasicoComponent {
  @Input({ required: true }) texto!: string;
  @Output() seleccion = new EventEmitter<string>();
}

@Component({
  selector: 'app-boton-evento-signal',
  standalone: true,
  template: '<button class="btn btn-primary" type="button" (click)="seleccion.emit(texto())">{{ texto() }}</button>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonEventoSignalComponent {
  readonly texto = input.required<string>();
  readonly seleccion = output<string>();
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
  imports: [BotonEventoClasicoComponent, BotonEventoSignalComponent, PanelProyectadoComponent],
  templateUrl: './v2-comunicacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2ComunicacionComponent {
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('campoNombre') private campoNombre?: ElementRef<HTMLInputElement>;
  @ViewChildren(BotonEventoSignalComponent) botonesSignal!: QueryList<BotonEventoSignalComponent>;

  readonly mostrarBotonExtra = signal(true);
  readonly cantidadBotonesSignal = signal(0);
  readonly ultimoEvento = signal('Todavía no se ha emitido ningún evento.');

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
