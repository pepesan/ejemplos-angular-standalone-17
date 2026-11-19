import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { AvisoSinBackendComponent } from './aviso-sin-backend.component';
import { esUrlInterna, RUTA_BASE } from './ruta-base';
import { SesionUsuariosService } from './sesion-usuarios.service';
import { esSinBackend } from './sin-backend';

/** Login de la feature. A él llega `sesionGuard` con `?returnUrl=`, que aquí entra como `input()`. */
@Component({
  selector: 'app-v2-usuarios-login',
  imports: [FormField, AvisoSinBackendComponent],
  templateUrl: './v2-usuarios-login.component.html',
  styleUrl: './usuarios-navegacion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2UsuariosLoginComponent {
  private readonly sesion = inject(SesionUsuariosService);
  private readonly router = inject(Router);

  /** Query param `returnUrl` (llega por `withComponentInputBinding`). */
  readonly returnUrl = input<string | undefined>();

  readonly modelo = signal({ usuario: 'admin', clave: 'angular' });
  readonly formulario = form(this.modelo, (ruta) => {
    required(ruta.usuario, { message: 'Escribe el usuario.' });
    required(ruta.clave, { message: 'Escribe la contraseña.' });
  });
  readonly error = signal<string | null>(null);
  readonly sinBackend = signal(false);

  async iniciarSesion(evento: SubmitEvent): Promise<void> {
    evento.preventDefault();
    this.error.set(null);
    await submit(this.formulario, async () => {
      const { usuario, clave } = this.modelo();
      try {
        await this.sesion.iniciarSesion(usuario, clave);
      } catch (error) {
        // Sin backend no se sabe si las credenciales valen: se avisa de arrancarlo en vez de acusar al usuario.
        if (esSinBackend(error)) this.sinBackend.set(true);
        else this.error.set('Usuario o contraseña incorrectos.');
        return;
      }
      this.sinBackend.set(false);
      const destino = this.returnUrl();
      await this.router.navigateByUrl(esUrlInterna(destino) ? destino : RUTA_BASE);
    });
  }
}
