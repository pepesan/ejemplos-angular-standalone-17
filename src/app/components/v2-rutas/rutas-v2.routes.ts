import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, CanMatchFn, ResolveFn, Router, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { V2RutasComponent } from './v2-rutas.component';
import { V2DetalleRutaComponent } from './v2-detalle-ruta.component';
import { V2RutaNoEncontradaComponent } from './v2-ruta-no-encontrada.component';
import { V2EditorRutaComponent } from './v2-editor-ruta.component';

// La guarda devuelve un UrlTree para redirigir; no navega como efecto secundario.
const accesoDemoGuard: CanActivateFn = (route) => route.queryParamMap.get('acceso') === 'permitido'
  || inject(Router).parseUrl('/v2/rutas?denegado=1');

// CanMatch evita seleccionar la ruta y manda a autenticación si todavía no hay JWT.
const jwtCanMatch: CanMatchFn = () => inject(AuthService).isAuthenticated()
  || inject(Router).createUrlTree(['/v2/autenticacion']);

interface EditorConCambios { confirmarSalida(): boolean; }
const confirmarSalidaEditor: CanDeactivateFn<EditorConCambios> = (editor) => editor.confirmarSalida();

interface RecursoRuta { id: string; title: string; source: string; }
// El resolver obtiene el recurso antes de activar la ruta y lo entrega en route.data.
const resolverRecurso: ResolveFn<RecursoRuta> = (route) =>
  inject(HttpClient).get<RecursoRuta>(`/api/recursos/${route.paramMap.get('id')}`);

export const V2_RUTAS: Routes = [
  { path: '', pathMatch: 'full', component: V2RutasComponent, data: { fuente: 'src/app/components/v2-rutas/v2-rutas.component.ts' }, title: 'Routing moderno' },
  { path: 'recurso/:id', component: V2DetalleRutaComponent, data: { fuente: 'src/app/components/v2-rutas/v2-detalle-ruta.component.ts' }, resolve: { recurso: resolverRecurso }, title: 'Detalle del recurso' },
  {
    path: 'privado', component: V2DetalleRutaComponent, data: { fuente: 'src/app/components/v2-rutas/v2-detalle-ruta.component.ts' },
    canActivate: [accesoDemoGuard],
  },
  { path: 'solo-miembros', component: V2DetalleRutaComponent, data: { fuente: 'src/app/components/v2-rutas/v2-detalle-ruta.component.ts' }, canMatch: [jwtCanMatch], title: 'Ruta protegida por JWT' },
  { path: 'editor', component: V2EditorRutaComponent, data: { fuente: 'src/app/components/v2-rutas/v2-editor-ruta.component.ts' }, canDeactivate: [confirmarSalidaEditor], title: 'Editor protegido' },
  { path: '**', component: V2RutaNoEncontradaComponent, data: { fuente: 'src/app/components/v2-rutas/v2-ruta-no-encontrada.component.ts' } },
];
