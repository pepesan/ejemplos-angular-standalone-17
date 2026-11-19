import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RUTA_BASE } from '../ruta-base';
import { SesionUsuariosService } from '../sesion-usuarios.service';

/**
 * Exige sesión. Si no la hay, DEVUELVE un `UrlTree` hacia el login (no navega él mismo: así el router decide y
 * el resultado se puede probar sin efectos secundarios) y recuerda a dónde quería ir el usuario en `returnUrl`.
 * Es asíncrona: puede tener que cargar el perfil.
 */
export const sesionGuard: CanActivateFn = async (_route, state) => {
  // `inject()` solo funciona de forma síncrona: tras el primer `await` ya no hay contexto de inyección.
  // Por eso se inyecta todo ANTES de esperar (inyectar el Router después lanzaría NG0203).
  const sesion = inject(SesionUsuariosService);
  const router = inject(Router);
  if (await sesion.asegurarPerfil()) return true;
  return router.createUrlTree([RUTA_BASE, 'login'], { queryParams: { returnUrl: state.url } });
};
