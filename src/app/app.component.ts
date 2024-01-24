import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TodosComponent} from "./todos/todos.component";
import {CondicionalesComponent} from "./directivas-builtin/condicionales.component";
import {ControlFlowComponent} from "./control-flow/control-flow.component";
import {UsoPipesComponent} from "./uso-pipes/uso-pipes.component";
import {PropiedadesComponent} from "./propiedades/propiedades.component";
import {ListadoPartidosComponent} from "./partidos/components/listado-partidos/listado-partidos.component";
import {UsoServiceComponent} from "./uso-service/uso-service.component";
import {PrincipalEventosComponent} from "./principal-eventos/principal-eventos.component";
import {SignalsComponent} from "./signals/signals.component";
import {MainFormComponent} from "./formularios/main-form/main-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TodosComponent,
    CondicionalesComponent,
    ControlFlowComponent,
    UsoPipesComponent,
    PropiedadesComponent,
    ListadoPartidosComponent,
    UsoServiceComponent,
    PrincipalEventosComponent,
    SignalsComponent,
    MainFormComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';
}
