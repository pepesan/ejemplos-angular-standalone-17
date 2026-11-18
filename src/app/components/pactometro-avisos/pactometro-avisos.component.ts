import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { PactometroService } from '../../services/pactometro.service';
import { Partido } from '../partidos/models/partido';

interface Aviso {
  tipo: 'warning' | 'danger' | 'success';
  texto: string;
}

/**
 * Maneja los AVISOS de los fallos de la petición: el servicio reintenta y aplica el timeout
 * (`getResultadosConReintentos()`) y el componente solo traduce cada suceso en un aviso visible.
 */
@Component({
  selector: 'app-pactometro-avisos',
  imports: [],
  templateUrl: './pactometro-avisos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PactometroAvisosComponent {
  readonly avisos = signal<Aviso[]>([]);
  readonly partidos = signal<Partido[]>([]);
  readonly cargando = signal(true);

  constructor() {
    inject(PactometroService)
      .getResultadosConReintentos()
      .subscribe((evento) => {
        switch (evento.tipo) {
          case 'reintento':
            this.avisar('warning', `Fallo: ${evento.motivo}. Reintento ${evento.intento} de ${evento.maximo}…`);
            break;
          case 'exito':
            this.partidos.set(evento.partidos);
            this.cargando.set(false);
            if (this.avisos().length) this.avisar('success', 'Los resultados se cargaron tras reintentar.');
            break;
          case 'fallo':
            this.partidos.set(evento.partidos);
            this.cargando.set(false);
            this.avisar('danger', `No se pudo cargar: ${evento.motivo}. Se muestran datos de respaldo.`);
            break;
        }
      });
  }

  private avisar(tipo: Aviso['tipo'], texto: string): void {
    this.avisos.update((lista) => [...lista, { tipo, texto }]);
  }
}
