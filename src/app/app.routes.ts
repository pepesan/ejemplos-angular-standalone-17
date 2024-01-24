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
import {MainFormComponent} from "./formularios/main-form/main-form.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {SubRutasComponent} from "./pages/sub-rutas/sub-rutas.component";
import {ChildAComponent} from "./pages/child-a/child-a.component";
import {ChildBComponent} from "./pages/child-b/child-b.component";
import {NavegacionComponent} from "./pages/navegacion/navegacion.component";
import {ListadoComponent} from "./pages/listado/listado.component";
import {DetalleComponent} from "./pages/detalle/detalle.component";
import {ReactivosComponent} from "./pages/reactivos/reactivos.component";
import {RadiosComponent} from "./formularios/radios/radios.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent,
    title: 'Home',},
  { path: 'about', component: AboutComponent,
    title: 'About', },
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
  { path: 'form-radios', component: RadiosComponent },
  { path: 'reactivos', component: ReactivosComponent },
  { path: 'subrutas', component: SubRutasComponent,
    children: [
      {
        path: 'a', // child route path
        component: ChildAComponent, // child route component that the router renders
      },
      {
        path: 'b',
        component: ChildBComponent, // another child route component that the router renders
      },
    ],
  },
  { path: 'nav', component: NavegacionComponent },
  { path: 'list', component: ListadoComponent },
  { path: 'list/:id', component: DetalleComponent },  // Route with parameter
  { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `home`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
