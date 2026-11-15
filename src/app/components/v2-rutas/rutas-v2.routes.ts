import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { V2RutasComponent } from './v2-rutas.component';
import { V2DetalleRutaComponent } from './v2-detalle-ruta.component';
import { V2RutaNoEncontradaComponent } from './v2-ruta-no-encontrada.component';

const accesoDemoGuard: CanActivateFn = (route) => route.queryParamMap.get('acceso') === 'permitido'
  || inject(Router).parseUrl('/v2/rutas?denegado=1');

export const V2_RUTAS: Routes = [
  { path: '', pathMatch: 'full', component: V2RutasComponent, title: 'Routing moderno' },
  { path: 'recurso/:id', component: V2DetalleRutaComponent, title: 'Detalle del recurso' },
  {
    path: 'privado', component: V2DetalleRutaComponent,
    canActivate: [accesoDemoGuard],
  },
  { path: '**', component: V2RutaNoEncontradaComponent },
];
