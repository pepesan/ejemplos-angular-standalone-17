import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AvisoApiComponent } from '../aviso-api/aviso-api.component';
import { RUTA_BASE } from './ruta-base';
import { SesionUsuariosService } from './sesion-usuarios.service';
import { UsuariosAvisosService } from './usuarios-avisos.service';

/**
 * Layout de la feature: lo que NO cambia entre pantallas (cabecera, sesión, menú y avisos) y un `<router-outlet>`
 * donde el router pinta la pantalla activa (login, listado, alta, edición o «no encontrado»).
 */
@Component({
  selector: 'app-v2-usuarios-navegacion',
  imports: [AvisoApiComponent, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './v2-usuarios-navegacion.component.html',
  styleUrl: './usuarios-navegacion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2UsuariosNavegacionComponent {
  readonly sesion = inject(SesionUsuariosService);
  readonly avisos = inject(UsuariosAvisosService);
  private readonly router = inject(Router);
  readonly base = RUTA_BASE;

  constructor() {
    // Un aviso se muestra tras la acción que lo provoca y desaparece en la navegación siguiente.
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationStart), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.avisos.limpiar());
  }

  async cerrarSesion(): Promise<void> {
    this.sesion.cerrar();
    await this.router.navigate([RUTA_BASE, 'login']);
    this.avisos.mostrar('Has cerrado la sesión.');
  }
}
