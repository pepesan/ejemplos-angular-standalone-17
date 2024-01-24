import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {AboutComponent} from "./pages/about/about.component";
import {PropsPageComponent} from "./pages/props-page/props-page.component";
import {CondicionalesComponent} from "./directivas-builtin/condicionales.component";
import {ControlFlowComponent} from "./control-flow/control-flow.component";
import {TodosComponent} from "./todos/todos.component";
import {UsoPipesComponent} from "./uso-pipes/uso-pipes.component";
import {PrincipalEventosComponent} from "./principal-eventos/principal-eventos.component";
import {UsoServiceComponent} from "./uso-service/uso-service.component";
import {ListadoPartidosComponent} from "./partidos/components/listado-partidos/listado-partidos.component";
import {SignalsComponent} from "./signals/signals.component";
import {MainFormComponent} from "./main-form/main-form.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'props', component: PropsPageComponent },
  { path: 'todos', component: TodosComponent },
  { path: 'directivas', component: CondicionalesComponent },
  { path: 'control-flow', component: ControlFlowComponent },
  { path: 'pipes', component: UsoPipesComponent },
  { path: 'signals', component: SignalsComponent },
  { path: 'service', component: UsoServiceComponent },
  { path: 'partidos', component:  ListadoPartidosComponent},
  { path: 'events', component: PrincipalEventosComponent },
  { path: 'form', component: MainFormComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
