import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  REQUISITOS_CONTRASENA,
  coinciden,
  validadoresContrasena,
} from '../../validators/contrasena.validators';
import { conMensaje, mensajesDe } from '../../validators/validador-con-mensaje';

/**
 * Registro con validadores personalizados. Cada campo de contraseña combina validadores predefinidos
 * (`required`, `minLength`) y propios (número, minúscula, mayúscula, símbolo). Además, un validador de GRUPO
 * comprueba que «contraseña» y «repite contraseña» coinciden, porque esa regla depende de dos campos a la vez.
 */
@Component({
  selector: 'app-v2-formulario-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './v2-formulario-registro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2FormularioRegistroComponent {
  readonly requisitos = REQUISITOS_CONTRASENA;

  readonly form = new FormGroup(
    {
      correo: new FormControl('', {
        nonNullable: true,
        validators: [
          conMensaje(Validators.required, 'Escribe tu correo electrónico.'),
          conMensaje(Validators.email, 'Introduce un correo electrónico válido.'),
        ],
      }),
      // La misma pila de validadores en los dos campos de contraseña.
      contrasena: new FormControl('', { nonNullable: true, validators: validadoresContrasena() }),
      repite: new FormControl('', { nonNullable: true, validators: validadoresContrasena() }),
    },
    { validators: [coinciden('contrasena', 'repite')] },
  );

  readonly correoRegistrado = signal<string | null>(null);

  // Estado del botón «Ver»: con `true` el campo pasa de type="password" a type="text".
  readonly verContrasena = signal(false);
  readonly verRepite = signal(false);

  alternar(visible: WritableSignal<boolean>): void {
    visible.update((v) => !v);
  }

  /** Primer mensaje del control: el que definió el validador que falló. */
  mensajeDe(control: AbstractControl): string {
    return mensajesDe(control.errors)[0] ?? '';
  }

  /** Un requisito está cumplido si el campo tiene valor y su validador no ha dado error. */
  cumple(control: AbstractControl, clave: string): boolean {
    return control.value !== '' && !control.hasError(clave);
  }

  mostrarError(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }

  registrar(): void {
    this.correoRegistrado.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.correoRegistrado.set(this.form.controls.correo.value);
    // Las contraseñas no se muestran ni se guardan: se vacía todo el formulario tras el registro.
    this.form.reset();
    // Tras registrar, los campos vuelven a ocultar su contenido.
    this.verContrasena.set(false);
    this.verRepite.set(false);
  }
}
