import { ChangeDetectionStrategy, Component, input, linkedSignal, output, signal } from '@angular/core';
import { email, form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { ErrorApi, Rol, Usuario, UsuarioNuevo } from '../../services/usuarios-api.service';
import { AvisoSinBackendComponent } from './aviso-sin-backend.component';
import { esSinBackend } from './sin-backend';

/**
 * Formulario de usuario COMPARTIDO por alta y edición. Es presentacional: recibe el valor inicial y la función que
 * guarda (`enviar`) y avisa del resultado con `guardado`/`cancelar`; no conoce el router ni decide a dónde ir.
 * Signal Forms aporta tres cosas: `submit()` (no envía si es inválido y evita el doble envío con `submitting()`),
 * los errores 400/409 del servidor asociados a su campo, y `dirty()` para saber si hay cambios sin guardar.
 */
@Component({
  selector: 'app-usuario-form',
  imports: [FormField, AvisoSinBackendComponent],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuarios-navegacion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioFormComponent {
  readonly roles: Rol[] = ['alumno', 'profesor', 'admin'];

  readonly valorInicial = input.required<UsuarioNuevo>();
  /** Guarda en el servidor. Lanza `ErrorApi` si falla: aquí se traduce a errores por campo o a un aviso. */
  readonly enviar = input.required<(datos: UsuarioNuevo) => Promise<Usuario>>();
  readonly textoEnviar = input('Guardar');
  readonly guardado = output<Usuario>();
  readonly cancelar = output<void>();

  // `linkedSignal` es una signal escribible que se reinicia si cambia `valorInicial`: el modelo del formulario.
  readonly modelo = linkedSignal<UsuarioNuevo>(() => ({ ...this.valorInicial() }));
  readonly formulario = form(this.modelo, (ruta) => {
    required(ruta.nombre, { message: 'El nombre es obligatorio.' });
    minLength(ruta.nombre, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });
    maxLength(ruta.nombre, 80, { message: 'El nombre no puede superar los 80 caracteres.' });
    required(ruta.email, { message: 'El email es obligatorio.' });
    email(ruta.email, { message: 'Introduce un email válido.' });
    required(ruta.rol, { message: 'Elige un rol.' });
  });
  readonly errorGeneral = signal<string | null>(null);
  readonly sinBackend = signal(false);

  /** Para `canDeactivate`: ¿hay cambios sin guardar? */
  hayCambios(): boolean {
    return this.formulario().dirty();
  }

  async enviarFormulario(evento: SubmitEvent): Promise<void> {
    evento.preventDefault();
    this.errorGeneral.set(null);
    this.sinBackend.set(false);
    await submit(this.formulario, async (campos) => {
      try {
        const guardado = await this.enviar()(this.modelo());
        // Se deja el formulario como «sin cambios» ANTES de avisar: así la guarda no pregunta al salir tras guardar.
        this.formulario().reset({ ...this.modelo() });
        this.guardado.emit(guardado);
        return undefined;
      } catch (e) {
        const error = e as ErrorApi;
        // Errores 400/409 por campo: se devuelven asociados a su campo y se muestran junto a él.
        const porCampo = (['nombre', 'email', 'rol'] as const)
          .filter((campo) => error.errores?.[campo])
          .map((campo) => ({ kind: 'servidor', message: error.errores[campo], fieldTree: campos[campo] }));
        if (porCampo.length) return porCampo;
        if (esSinBackend(error)) this.sinBackend.set(true);
        else this.errorGeneral.set(error.message ?? 'No se ha podido guardar.');
        return undefined;
      }
    });
  }
}
