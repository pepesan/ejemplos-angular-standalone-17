import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ErrorApi, Usuario, UsuariosApiService } from '../../services/usuarios-api.service';
import { RUTA_BASE } from './ruta-base';

/**
 * Carga el usuario de `:id` ANTES de activar la ruta, así la pantalla de edición recibe el dato ya listo
 * (llega como `input()` gracias a `withComponentInputBinding()`).
 * Si no existe (404) o el id no es un número, devuelve un `RedirectCommand` a «no encontrado» en vez de dejar la
 * pantalla vacía. Cualquier otro fallo vuelve al listado, que ya sabe explicar si el backend no responde.
 */
export const usuarioResolver: ResolveFn<Usuario | RedirectCommand> = async (route) => {
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));
  if (!Number.isInteger(id) || id < 1) return new RedirectCommand(router.createUrlTree([RUTA_BASE, 'no-encontrado']));
  try {
    return await firstValueFrom(inject(UsuariosApiService).obtener(id));
  } catch (error) {
    const destino = error instanceof ErrorApi && error.estado === 404 ? [RUTA_BASE, 'no-encontrado'] : [RUTA_BASE];
    return new RedirectCommand(router.createUrlTree(destino));
  }
};
