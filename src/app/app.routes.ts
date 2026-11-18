import { inject } from '@angular/core';
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
import {SignalInputPadreComponent} from "./components/signal-input-padre/signal-input-padre.component";
import {SignalInputHijoComponent} from "./components/signal-input-hijo/signal-input-hijo.component";
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
import { LastVisitedRouteService } from './services/last-visited-route.service';


export const routes: Routes = [
  { path: 'home', component: HomeComponent,
    title: 'Home',},
  { path: 'about', component: AboutComponent,
    title: 'About', },
  { path: 'props', component: PropsPageComponent, data: { fuente: 'src/app/pages/props-page/props-page.component.ts' } },
  { path: 'props-listado-detalle', component: TodoListadoComponent, data: { fuente: 'src/app/components/todo-listado/todo-listado.component.ts' } },
  { path: 'todos', component: TodosComponent, data: { fuente: 'src/app/components/todos/todos.component.ts' } },
  { path: 'directivas', component: CondicionalesComponent, data: { fuente: 'src/app/components/directivas-builtin/condicionales.component.ts' } },
  { path: 'control-flow', component: ControlFlowComponent, data: { fuente: 'src/app/components/control-flow/control-flow.component.ts' } },
  { path: 'pipes', component: UsoPipesComponent, data: { fuente: 'src/app/components/uso-pipes/uso-pipes.component.ts' } },
  { path: 'signals', component: SignalsComponent, data: { fuente: 'src/app/components/signals/signals.component.ts' } },
  { path: 'signals-effect', component: SignalEffectComponent, data: { fuente: 'src/app/components/signal-effect/signal-effect.component.ts' } },
  { path: 'signals-input', component: SignalInputPadreComponent, data: { fuente: 'src/app/components/signal-input-padre/signal-input-padre.component.ts' } },
  { path: 'signals-model', component: UseSignalModelComponent, data: { fuente: 'src/app/components/use-signal-model/use-signal-model.component.ts' } },
  { path: 'signals-queries', component: SignalQueriesComponent, data: { fuente: 'src/app/components/signal-queries/signal-queries.component.ts' } },
  { path: 'service', component: UsoServiceComponent, data: { fuente: 'src/app/components/uso-service/uso-service.component.ts' } },
  { path: 'servicio-basico', component: UsoServicioBasicoComponent, data: { fuente: 'src/app/components/uso-servicio-basico/uso-servicio-basico.component.ts' } },
  { path: 'partidos', component: ListadoPartidosComponent, data: { fuente: 'src/app/components/partidos/components/listado-partidos/listado-partidos.component.ts' }},
  { path: 'peticion-post', component: PeticionPostComponent, data: { fuente: 'src/app/components/peticion-post/peticion-post.component.ts' }},
  { path: 'pactometro', component: PactometroComponent, data: { fuente: 'src/app/components/pactometro/pactometro.component.ts' }},
  { path: 'pactometro-avisos', loadComponent: () => import('./components/pactometro-avisos/pactometro-avisos.component').then(m => m.PactometroAvisosComponent), data: { fuente: 'src/app/components/pactometro-avisos/pactometro-avisos.component.ts' }},
  { path: 'pactometro-procesado', loadComponent: () => import('./components/pactometro-procesado/pactometro-procesado.component').then(m => m.PactometroProcesadoComponent), data: { fuente: 'src/app/components/pactometro-procesado/pactometro-procesado.component.ts' }},
  { path: 'ciclo', component: CicloDeVidaComponent, data: { fuente: 'src/app/components/ciclo-de-vida/ciclo-de-vida.component.ts' } },
  { path: 'events', component: PrincipalEventosComponent, data: { fuente: 'src/app/components/principal-eventos/principal-eventos.component.ts' } },
  { path: 'form', component: MainFormComponent, data: { fuente: 'src/app/components/formularios/main-form/main-form.component.ts' } },
  { path: 'form-radios', component: RadiosComponent, data: { fuente: 'src/app/components/formularios/radios/radios.component.ts' } },
  { path: 'reactivos', component: ReactivosComponent, data: { fuente: 'src/app/pages/reactivos/reactivos.component.ts' } },
  { path: 'ejercicio-componente', component: EjercicioListadoComponent, data: { fuente: 'src/app/ejercicios/ejercicio-listado/ejercicio-listado.component.ts' } },
  { path: 'ejercicio-misclientes', component: EjercicioMisClientesComponent, data: { fuente: 'src/app/ejercicios/ejercicio-mis-clientes/ejercicio-mis-clientes.component.ts' } },
  { path: 'ejercicio-condicionales', component: EjercicioCondicionalesComponent, data: { fuente: 'src/app/ejercicios/ejercicio-condicionales/ejercicio-condicionales.component.ts' } },
  { path: 'ejercicio-input', component: EjercicioInputComponent, data: { fuente: 'src/app/ejercicios/ejercicio-input/ejercicio-input.component.ts' } },
  { path: 'ejercicio-signals', component: EjercicioSignalsComponent, data: { fuente: 'src/app/ejercicios/ejercicio-signals/ejercicio-signals.component.ts' } },
  { path: 'ejercicio-tuberias', component: EjercicioTuberiasComponent, data: { fuente: 'src/app/ejercicios/ejercicio-tuberias/ejercicio-tuberias.component.ts' } },
  { path: 'ejercicio-servicios', component: EjercicioServiciosComponent, data: { fuente: 'src/app/ejercicios/ejercicio-servicios/ejercicio-servicios.component.ts' } },
  { path: 'ejercicio-resultado', component: EjercicioResultadoComponent, data: { fuente: 'src/app/ejercicios/ejercicio-resultado/ejercicio-resultado.component.ts' } },
  { path: 'ejercicio-eventos', component: EjercicioEventosComponent, data: { fuente: 'src/app/ejercicios/ejercicio-eventos/ejercicio-eventos.component.ts' } },
  { path: 'ejercicio-formulario', component: FormulariosComponent, data: { fuente: 'src/app/ejercicios/formularios/formularios.component.ts' } },
  { path: 'ejercicio-formulario-reactivo', component: FormulariosReactivosComponent, data: { fuente: 'src/app/ejercicios/formularios-reactivos/formularios-reactivos.component.ts' } },
  { path: 'subrutas', component: SubRutasComponent, data: { fuente: 'src/app/pages/sub-rutas/sub-rutas.component.ts' },
    children: [
      {
        path: 'a', // child route path
        component: ChildAComponent, data: { fuente: 'src/app/pages/child-a/child-a.component.ts' }, // child route component that the router renders
      },
      {
        path: 'b',
        component: ChildBComponent, data: { fuente: 'src/app/pages/child-b/child-b.component.ts' }, // another child route component that the router renders
      },
    ],
  },
  { path: 'nav', component: NavegacionComponent, data: { fuente: 'src/app/pages/navegacion/navegacion.component.ts' } },
  { path: 'list', component: ListadoComponent, data: { fuente: 'src/app/pages/listado/listado.component.ts' } },
  { path: 'list/:id', component: DetalleComponent, data: { fuente: 'src/app/pages/detalle/detalle.component.ts' } },  // Route with parameter
  { path: 'acordeon', component: AcordeonComponent, data: { fuente: 'src/app/pages/acordeon/acordeon.component.ts' } },
  { path: 'alertas', component: AlertasComponent, data: { fuente: 'src/app/pages/alertas/alertas.component.ts' } },
  { path: 'form-bootstrap', component: FormBootstrapComponent, data: { fuente: 'src/app/pages/form-bootstrap/form-bootstrap.component.ts' } },
  {
    path: 'lazy',
    loadChildren: () => import('./modules/lazy-module/lazy-module.module').then(m => m.LazyModuleModule) },
  {
    path: 'v2/fundamentos',
    data: { fuente: 'src/app/components/v2-fundamentos/v2-fundamentos.component.ts' },
    loadComponent: () => import('./components/v2-fundamentos/v2-fundamentos.component')
      .then((module) => module.V2FundamentosComponent),
    title: 'Fundamentos de Angular',
  },
  {
    path: 'v2/formulario-tipado',
    data: { fuente: 'src/app/components/formulario-tipado/formulario-tipado.component.ts' },
    loadComponent: () => import('./components/formulario-tipado/formulario-tipado.component')
      .then((module) => module.FormularioTipadoComponent),
    title: 'Formulario reactivo tipado',
  },
  {
    path: 'v2/consumo-api',
    data: { fuente: 'src/app/components/v2-consumo-api/v2-consumo-api.component.ts' },
    loadComponent: () => import('./components/v2-consumo-api/v2-consumo-api.component')
      .then((module) => module.V2ConsumoApiComponent),
    title: 'Consumo de API',
  },
  {
    path: 'v2/comunicacion',
    data: { fuente: 'src/app/components/v2-comunicacion/v2-comunicacion.component.ts' },
    loadComponent: () => import('./components/v2-comunicacion/v2-comunicacion.component')
      .then((module) => module.V2ComunicacionComponent),
    title: 'Comunicación entre componentes',
  },
  {
    path: 'v2/autenticacion',
    data: { fuente: 'src/app/components/v2-auth/v2-auth.component.ts' },
    loadComponent: () => import('./components/v2-auth/v2-auth.component')
      .then((module) => module.V2AuthComponent),
    title: 'HTTP, interceptores y JWT',
  },
  {
    path: 'v2/estado',
    data: { fuente: 'src/app/components/v2-estado/v2-estado.component.ts' },
    loadComponent: () => import('./components/v2-estado/v2-estado.component')
      .then((module) => module.V2EstadoComponent),
    title: 'Rendimiento y estado',
  },
  {
    path: 'v2/accesibilidad',
    data: { fuente: 'src/app/components/v2-accesibilidad/v2-accesibilidad.component.ts' },
    loadComponent: () => import('./components/v2-accesibilidad/v2-accesibilidad.component')
      .then((module) => module.V2AccesibilidadComponent),
    title: 'Accesibilidad y calidad',
  },
  {
    path: 'v2/rutas',
    loadChildren: () => import('./components/v2-rutas/rutas-v2.routes').then((module) => module.V2_RUTAS),
  },
  {
    path: 'v2/signal-forms',
    data: { fuente: 'src/app/components/v2-signal-forms/v2-signal-forms.component.ts' },
    loadComponent: () => import('./components/v2-signal-forms/v2-signal-forms.component')
      .then((module) => module.V2SignalFormsComponent),
    title: 'Signal Forms',
  },
  {
    path: 'v2/busqueda-reactiva',
    data: { fuente: 'src/app/components/v2-busqueda/v2-busqueda.component.ts' },
    loadComponent: () => import('./components/v2-busqueda/v2-busqueda.component')
      .then((module) => module.V2BusquedaComponent),
    title: 'Búsqueda reactiva',
  },
  {
    path: 'v2/estado-compartido',
    data: { fuente: 'src/app/components/v2-estado-compartido/v2-estado-compartido.component.ts' },
    loadComponent: () => import('./components/v2-estado-compartido/v2-estado-compartido.component')
      .then((module) => module.V2EstadoCompartidoComponent),
    title: 'Estado compartido entre componentes',
  },
  {
    path: 'v2/servicio-injectable',
    data: { fuente: 'src/app/components/v2-servicio-injectable/v2-servicio-injectable.component.ts' },
    loadComponent: () => import('./components/v2-servicio-injectable/v2-servicio-injectable.component')
      .then((module) => module.V2ServicioInjectableComponent),
    title: '@Injectable: constructor frente a inject()',
  },
  {
    path: 'v2/servicio-sin-injectable',
    data: { fuente: 'src/app/components/v2-servicio-sin-injectable/v2-servicio-sin-injectable.component.ts' },
    loadComponent: () => import('./components/v2-servicio-sin-injectable/v2-servicio-sin-injectable.component')
      .then((module) => module.V2ServicioSinInjectableComponent),
    title: 'Servicio sin @Injectable',
  },
  {
    path: 'v2/i18n',
    data: { fuente: 'src/app/components/v2-i18n/v2-i18n.component.ts' },
    loadComponent: () => import('./components/v2-i18n/v2-i18n.component')
      .then((module) => module.V2I18nComponent),
    title: 'Internacionalización',
  },
  {
    path: 'v2/seguridad',
    data: { fuente: 'src/app/components/v2-seguridad/v2-seguridad.component.ts' },
    loadComponent: () => import('./components/v2-seguridad/v2-seguridad.component')
      .then((module) => module.V2SeguridadComponent),
    title: 'Seguridad en plantillas',
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '', redirectTo: () => inject(LastVisitedRouteService).getInitialRoute(), pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
