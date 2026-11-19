import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { cambiosSinGuardarGuard } from './guards/cambios-sin-guardar.guard';
import { sesionGuard } from './guards/sesion.guard';
import { usuarioResolver } from './usuario.resolver';
import { V2UsuarioEditarComponent } from './v2-usuario-editar.component';
import { V2UsuarioNuevoComponent } from './v2-usuario-nuevo.component';
import { V2UsuariosListadoComponent } from './v2-usuarios-listado.component';
import { V2UsuariosLoginComponent } from './v2-usuarios-login.component';
import { V2UsuariosNavegacionComponent } from './v2-usuarios-navegacion.component';
import { V2UsuariosNoEncontradoComponent } from './v2-usuarios-no-encontrado.component';

/**
 * (`data.fuente` va con la ruta completa y entre comillas simples: `npm run fuentes` la busca con ese formato.)
 *
 * Rutas de la feature (se cargan de forma diferida desde `app.routes.ts`). Estructura:
 *  - el layout (cabecera, sesión, avisos) envuelve a todas las pantallas;
 *  - `login` es pública; el resto está dentro de un grupo sin componente que aplica `sesionGuard` a todos sus hijos;
 *  - `nuevo` y `:id/editar` añaden `adminGuard` (rol) y `canDeactivate` (cambios sin guardar);
 *  - `:id/editar` lleva un `resolve` (el usuario llega ya cargado) y un título calculado.
 */
export const USUARIOS_NAVEGACION_RUTAS: Routes = [
  {
    path: '',
    component: V2UsuariosNavegacionComponent,
    data: { fuente: 'src/app/components/v2-usuarios-navegacion/v2-usuarios-navegacion.component.ts' },
    children: [
      { path: 'login', component: V2UsuariosLoginComponent, title: 'Iniciar sesión', data: { fuente: 'src/app/components/v2-usuarios-navegacion/v2-usuarios-login.component.ts' } },
      {
        path: '',
        canActivate: [sesionGuard],
        children: [
          { path: '', pathMatch: 'full', component: V2UsuariosListadoComponent, title: 'Usuarios', data: { fuente: 'src/app/components/v2-usuarios-navegacion/v2-usuarios-listado.component.ts' } },
          {
            path: 'nuevo',
            component: V2UsuarioNuevoComponent,
            title: 'Nuevo usuario',
            data: { fuente: 'src/app/components/v2-usuarios-navegacion/v2-usuario-nuevo.component.ts' },
            canActivate: [adminGuard],
            canDeactivate: [cambiosSinGuardarGuard],
          },
          {
            path: ':id/editar',
            component: V2UsuarioEditarComponent,
            title: (ruta: ActivatedRouteSnapshot) => `Editar usuario #${ruta.paramMap.get('id')}`,
            data: { fuente: 'src/app/components/v2-usuarios-navegacion/v2-usuario-editar.component.ts' },
            canActivate: [adminGuard],
            canDeactivate: [cambiosSinGuardarGuard],
            resolve: { usuario: usuarioResolver },
          },
          { path: 'no-encontrado', component: V2UsuariosNoEncontradoComponent, title: 'No encontrado', data: { fuente: 'src/app/components/v2-usuarios-navegacion/v2-usuarios-no-encontrado.component.ts' } },
        ],
      },
      { path: '**', component: V2UsuariosNoEncontradoComponent, title: 'No encontrado', data: { fuente: 'src/app/components/v2-usuarios-navegacion/v2-usuarios-no-encontrado.component.ts' } },
    ],
  },
];
