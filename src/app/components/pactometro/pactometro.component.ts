import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {PactometroService, ResultadosPactometro} from "../../services/pactometro.service";

import {Partido} from "../partidos/models/partido";

@Component({
  selector: 'app-pactometro',
  imports: [],
  templateUrl: './pactometro.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pactometro.component.css'
})
export class PactometroComponent {
  // La aplicación es zoneless (sin provideZoneChangeDetection): una propiedad asignada dentro de
  // subscribe() no avisa a Angular de que debe repintar, así que el estado va en signals.
  resultados = signal<Partido[]>([]);
  origen = signal<ResultadosPactometro['origen']>('remoto');

  constructor(private pactometroService: PactometroService) {
    // El servicio ya resuelve los fallos (devuelve datos de respaldo), así que aquí solo se pinta.
    this.pactometroService.getResultados().subscribe(({ partidos, origen }) => {
      this.resultados.set(partidos);
      this.origen.set(origen);
    });
  }
}
