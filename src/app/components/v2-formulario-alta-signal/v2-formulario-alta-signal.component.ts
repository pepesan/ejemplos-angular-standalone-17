import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { AvisoApiComponent } from '../aviso-api/aviso-api.component';
import { coincidenSiHayValor } from '../../validators/reglas';

interface Alta {
  username: string;
  password: string;
  repeatPassword: string;
  email: string;
  gender: string;
  orientation: string;
  // Texto, no número: un <select> siempre entrega el `value` de la opción como string.
  relationType: string;
  conditions: boolean;
}

const INICIAL: Alta = {
  username: '',
  password: '',
  repeatPassword: '',
  email: '',
  gender: 'male',
  orientation: 'hetero',
  relationType: '3',
  conditions: false,
};

/**
 * El formulario de alta del ejercicio de formularios reactivos, rehecho con Signal Forms.
 * Compáralos campo a campo: aquí el estado es una signal (`modelo`) y las reglas se declaran en un esquema,
 * en vez de un `FormGroup` con `Validators`.
 */
@Component({
  selector: 'app-v2-formulario-alta-signal',
  imports: [FormField, AvisoApiComponent],
  templateUrl: './v2-formulario-alta-signal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2FormularioAltaSignalComponent {
  readonly genders = [
    { name: 'Masculino', id: 'male', icon: 'fa-male' },
    { name: 'Femenino', id: 'female', icon: 'fa-female' },
    { name: 'No binario', id: 'no-binary', icon: 'fa-genderless' },
    { name: 'Otro', id: 'other', icon: 'fa-user' },
  ];

  readonly orientations = [
    { name: 'Hetero', id: 'hetero' },
    { name: 'Homo', id: 'homo' },
    { name: 'Bi', id: 'bi' },
  ];

  readonly relationTypes = [
    { id: '1', name: 'Amistad' },
    { id: '2', name: 'Relación seria' },
    { id: '3', name: 'Relación casual' },
    { id: '4', name: 'Networking' },
  ];

  /** Fuente de verdad del formulario: el valor vive en esta signal. */
  readonly modelo = signal<Alta>({ ...INICIAL });

  readonly formulario = form(this.modelo, (ruta) => {
    required(ruta.username, { message: 'Username obligatorio.' });
    minLength(ruta.username, 4, { message: 'Username debe tener mínimo 4 caracteres.' });

    required(ruta.password, { message: 'Password obligatorio.' });
    minLength(ruta.password, 4, { message: 'Mínimo 4 caracteres.' });

    required(ruta.repeatPassword, { message: 'Repetir contraseña es obligatorio.' });
    minLength(ruta.repeatPassword, 4, { message: 'Mínimo 4 caracteres.' });
    // Regla entre campos: se comprueba sobre `repeatPassword` leyendo `password` con `valueOf`. Como todo son
    // signals, se revalida sola cuando cambia cualquiera de los dos (sin `updateValueAndValidity`).
    // La regla pura es la misma que usa el validador de grupo de los formularios reactivos.
    validate(ruta.repeatPassword, ({ value, valueOf }) =>
      coincidenSiHayValor(valueOf(ruta.password), value())
        ? undefined
        : { kind: 'noCoinciden', message: 'Las contraseñas no coinciden.' },
    );

    required(ruta.email, { message: 'Email obligatorio.' });
    email(ruta.email, { message: 'Formato de email inválido.' });

    required(ruta.gender, { message: 'Elige un género.' });
    required(ruta.orientation, { message: 'Elige una orientación.' });
    required(ruta.relationType, { message: 'Elige un tipo de relación.' });

    // Equivalente a `Validators.requiredTrue`: una casilla desmarcada debe contar como error.
    validate(ruta.conditions, ({ value }) =>
      value() ? undefined : { kind: 'required', message: 'Debes aceptar las condiciones.' },
    );
  });

  readonly confirmacion = signal('');

  async enviar(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    // `submit()` marca todos los campos como tocados y solo ejecuta la acción si el formulario es válido.
    await submit(this.formulario, async () => {
      // Aquí se enviaría el valor al backend.
      console.log(this.modelo());
      this.confirmacion.set(`Alta recibida para ${this.modelo().username}.`);
      // Reinicia el valor y el estado (tocado, sucio) de todos los campos.
      this.formulario().reset({ ...INICIAL });
    });
  }
}
