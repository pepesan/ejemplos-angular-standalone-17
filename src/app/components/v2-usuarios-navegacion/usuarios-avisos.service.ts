import { Service, signal } from '@angular/core';

/**
 * Aviso de confirmación de la última acción («Usuario creado.»). Vive en un servicio de la feature, y no en una
 * pantalla, porque se muestra DESPUÉS de navegar (de «nuevo» al listado) y el layout lo anuncia con `aria-live`.
 * Se muestra una vez navegado: el layout lo limpia en la navegación siguiente.
 */
@Service()
export class UsuariosAvisosService {
  readonly aviso = signal<string | null>(null);

  mostrar(mensaje: string): void {
    this.aviso.set(mensaje);
  }

  limpiar(): void {
    this.aviso.set(null);
  }
}
