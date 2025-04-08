import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import {TodosComponent} from "./components/todos/todos.component";
import {CondicionalesComponent} from "./components/directivas-builtin/condicionales.component";
import {ControlFlowComponent} from "./components/control-flow/control-flow.component";
import {UsoPipesComponent} from "./components/uso-pipes/uso-pipes.component";
import {PropiedadesComponent} from "./components/propiedades/propiedades.component";
import {ListadoPartidosComponent} from "./components/partidos/components/listado-partidos/listado-partidos.component";
import {UsoServiceComponent} from "./components/uso-service/uso-service.component";
import {PrincipalEventosComponent} from "./components/principal-eventos/principal-eventos.component";
import {SignalsComponent} from "./components/signals/signals.component";
import {MainFormComponent} from "./components/formularios/main-form/main-form.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-root',
    imports: [
        RouterModule,
        NgbModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';
}
