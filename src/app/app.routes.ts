import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {AboutComponent} from "./pages/about/about.component";
import {PropsPageComponent} from "./pages/props-page/props-page.component";
import {CondicionalesComponent} from "./components/directivas-builtin/condicionales.component";
import {ControlFlowComponent} from "./components/control-flow/control-flow.component";
import {TodosComponent} from "./components/todos/todos.component";
import {UsoPipesComponent} from "./components/uso-pipes/uso-pipes.component";
import {PrincipalEventosComponent} from "./components/principal-eventos/principal-eventos.component";
import {CicloDeVidaComponent} from "./components/ciclo-de-vida/ciclo-de-vida.component";
import {UsoServiceComponent} from "./components/uso-service/uso-service.component";
import {UsoServicioBasicoComponent} from "./components/uso-servicio-basico/uso-servicio-basico.component";
import {ListadoPartidosComponent} from "./components/partidos/components/listado-partidos/listado-partidos.component";
import {PeticionPostComponent} from "./components/peticion-post/peticion-post.component";
import {PactometroComponent} from "./components/pactometro/pactometro.component";
import {SignalsComponent} from "./components/signals/signals.component";
import {MainFormComponent} from "./components/formularios/main-form/main-form.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {SubRutasComponent} from "./pages/sub-rutas/sub-rutas.component";
import {ChildAComponent} from "./pages/child-a/child-a.component";
import {ChildBComponent} from "./pages/child-b/child-b.component";
import {NavegacionComponent} from "./pages/navegacion/navegacion.component";
import {ListadoComponent} from "./pages/listado/listado.component";
import {DetalleComponent} from "./pages/detalle/detalle.component";
import {ReactivosComponent} from "./pages/reactivos/reactivos.component";
import {RadiosComponent} from "./components/formularios/radios/radios.component";
import {AcordeonComponent} from "./pages/acordeon/acordeon.component";
import {AlertasComponent} from "./pages/alertas/alertas.component";
import {FormBootstrapComponent} from "./pages/form-bootstrap/form-bootstrap.component";
import {SignalEffectComponent} from "./components/signal-effect/signal-effect.component";
import {SignalInputComponent} from "./components/signal-input/signal-input.component";
import {UseSignalInputComponent} from "./components/use-signal-input/use-signal-input.component";
import {UseSignalModelComponent} from "./components/use-signal-model/use-signal-model.component";
import {SignalQueriesComponent} from "./components/signal-queries/signal-queries.component";
import {TodoListadoComponent} from "./components/todo-listado/todo-listado.component";
import {FormulariosComponent} from "./ejercicios/formularios/formularios.component";
import {EjercicioListadoComponent} from "./ejercicios/ejercicio-listado/ejercicio-listado.component";
import {EjercicioMisClientesComponent} from "./ejercicios/ejercicio-mis-clientes/ejercicio-mis-clientes.component";
import {EjercicioCondicionalesComponent} from "./ejercicios/ejercicio-condicionales/ejercicio-condicionales.component";
import {EjercicioInputComponent} from "./ejercicios/ejercicio-input/ejercicio-input.component";
import {EjercicioSignalsComponent} from "./ejercicios/ejercicio-signals/ejercicio-signals.component";
import {EjercicioTuberiasComponent} from "./ejercicios/ejercicio-tuberias/ejercicio-tuberias.component";
import {EjercicioServiciosComponent} from "./ejercicios/ejercicio-servicios/ejercicio-servicios.component";
import {EjercicioResultadoComponent} from "./ejercicios/ejercicio-resultado/ejercicio-resultado.component";
import {EjercicioEventosComponent} from "./ejercicios/ejercicio-eventos/ejercicio-eventos.component";
import {FormulariosReactivosComponent} from "./ejercicios/formularios-reactivos/formularios-reactivos.component";


export const routes: Routes = [
  { path: 'home', component: HomeComponent,
    title: 'Home',},
  { path: 'about', component: AboutComponent,
    title: 'About', },
  { path: 'props', component: PropsPageComponent },
  { path: 'props-listado-detalle', component: TodoListadoComponent },
  { path: 'todos', component: TodosComponent },
  { path: 'directivas', component: CondicionalesComponent },
  { path: 'control-flow', component: ControlFlowComponent },
  { path: 'pipes', component: UsoPipesComponent },
  { path: 'signals', component: SignalsComponent },
  { path: 'signals-effect', component: SignalEffectComponent },
  { path: 'signals-input', component: SignalInputComponent },
  { path: 'signals-model', component: UseSignalModelComponent },
  { path: 'signals-queries', component: SignalQueriesComponent },
  { path: 'service', component: UsoServiceComponent },
  { path: 'servicio-basico', component: UsoServicioBasicoComponent },
  { path: 'partidos', component:  ListadoPartidosComponent},
  { path: 'peticion-post', component:  PeticionPostComponent},
  { path: 'pactometro', component:  PactometroComponent},
  { path: 'ciclo', component: CicloDeVidaComponent },
  { path: 'events', component: PrincipalEventosComponent },
  { path: 'form', component: MainFormComponent },
  { path: 'form-radios', component: RadiosComponent },
  { path: 'reactivos', component: ReactivosComponent },
  { path: 'ejercicio-componente', component: EjercicioListadoComponent },
  { path: 'ejercicio-misclientes', component: EjercicioMisClientesComponent },
  { path: 'ejercicio-condicionales', component: EjercicioCondicionalesComponent },
  { path: 'ejercicio-input', component: EjercicioInputComponent },
  { path: 'ejercicio-signals', component: EjercicioSignalsComponent },
  { path: 'ejercicio-tuberias', component: EjercicioTuberiasComponent },
  { path: 'ejercicio-servicios', component: EjercicioServiciosComponent },
  { path: 'ejercicio-resultado', component: EjercicioResultadoComponent },
  { path: 'ejercicio-eventos', component: EjercicioEventosComponent },
  { path: 'ejercicio-formulario', component: FormulariosComponent },
  { path: 'ejercicio-formulario-reactivo', component: FormulariosReactivosComponent },
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
  { path: 'acordeon', component: AcordeonComponent },
  { path: 'alertas', component: AlertasComponent },
  { path: 'form-bootstrap', component: FormBootstrapComponent },
  {
    path: 'lazy',
    loadChildren: () => import('./modules/lazy-module/lazy-module.module').then(m => m.LazyModuleModule) },
  { path: '404', component: PageNotFoundComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `home`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
