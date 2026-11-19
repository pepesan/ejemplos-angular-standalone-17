import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RUTA_BASE } from '../ruta-base';
import { SesionUsuariosService } from '../sesion-usuarios.service';

/**
 * Autorización por rol: crear y editar requieren ser `admin`. Redirige al listado con `?denegado=1` (estado en
 * la URL, sin efectos secundarios) y el listado muestra el motivo.
 * Importante: ocultar el botón no basta; el backend también rechaza escribir si no eres admin.
 */
export const adminGuard: CanActivateFn = () =>
  inject(SesionUsuariosService).esAdmin() || inject(Router).createUrlTree([RUTA_BASE], { queryParams: { denegado: 1 } });
