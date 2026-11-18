import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ResumenRendimientoComponent } from './resumen-rendimiento.component';

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
interface Tarea { id: number; nombre: string; completada: boolean; }

@Component({
  selector: 'app-v2-estado', standalone: true, imports: [
    ResumenRendimientoComponent,
    AvisoApiComponent
  ],
  templateUrl: './v2-estado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2EstadoComponent {
  readonly tareas = signal<Tarea[]>([
    { id: 1, nombre: 'Leer sobre Signals', completada: false },
    { id: 2, nombre: 'Probar computed', completada: true },
  ]);
  readonly mostrarPendientes = signal(false);
  readonly tareasVisibles = computed(() => this.mostrarPendientes()
    ? this.tareas().filter((tarea) => !tarea.completada)
    : this.tareas());

  alternarFiltro(): void { this.mostrarPendientes.update((actual) => !actual); }
}
