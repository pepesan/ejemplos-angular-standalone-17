import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TodosComponent} from "./todos/todos.component";
import {CondicionalesComponent} from "./condicionales/condicionales.component";
import {ControlFlowComponent} from "./control-flow/control-flow.component";
import {UsoPipesComponent} from "./uso-pipes/uso-pipes.component";
import {PropiedadesComponent} from "./propiedades/propiedades.component";
import {Dato} from "./propiedades/dato";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TodosComponent,
    CondicionalesComponent,
    ControlFlowComponent,
    UsoPipesComponent,
    PropiedadesComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';
  objetoDato: Dato = new Dato("holiwi")
}
