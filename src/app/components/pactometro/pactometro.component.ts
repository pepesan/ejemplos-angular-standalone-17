import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  resultados: Partido[] = [];
  resultadosObservable: Observable<Partido[]>;
  error = false;
  private resultadosSubscribe: Subscription;

  constructor(private pactometroService: PactometroService) {
    this.resultadosObservable = this.pactometroService.getResultados();
    this.resultadosSubscribe = this.resultadosObservable.subscribe({
      next: data => this.resultados = data,
      error: () => this.error = true
    });
  }
}
