import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {PactometroService} from "../../services/pactometro.service";

import {Partido} from "../uso-service/partido";
import {Observable, Subscription} from "rxjs";

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
  resultadosObservable: Observable<Partido[]>;
  error = signal(false);
  private resultadosSubscribe: Subscription;

  constructor(private pactometroService: PactometroService) {
    this.resultadosObservable = this.pactometroService.getResultados();
    this.resultadosSubscribe = this.resultadosObservable.subscribe({
      next: data => this.resultados.set(data),
      error: () => this.error.set(true)
    });
  }
}
