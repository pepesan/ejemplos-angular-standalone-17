import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { PactometroService, PartidoProcesado, ResultadosPactometro } from '../../services/pactometro.service';

/**
 * Usa los datos MODIFICADOS por el servicio (`getResultadosProcesados()`): ya llegan ordenados y con
 * el porcentaje calculado, así que el componente no contiene lógica de transformación.
 */
@Component({
  selector: 'app-pactometro-procesado',
  imports: [],
  templateUrl: './pactometro-procesado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PactometroProcesadoComponent {
  readonly partidos = signal<PartidoProcesado[]>([]);
  readonly origen = signal<ResultadosPactometro['origen']>('remoto');

  constructor() {
    inject(PactometroService)
      .getResultadosProcesados()
      .subscribe(({ partidos, origen }) => {
        this.partidos.set(partidos);
        this.origen.set(origen);
      });
  }
}
