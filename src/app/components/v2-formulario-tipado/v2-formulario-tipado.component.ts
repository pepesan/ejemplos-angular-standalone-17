import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { conMensaje, mensajesDe } from '../../validators/validador-con-mensaje';

@Component({
  selector: 'app-v2-formulario-tipado',
  imports: [ReactiveFormsModule],
  templateUrl: './v2-formulario-tipado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2FormularioTipadoComponent {
  readonly form = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      // Cada validador lleva su mensaje: el texto se define junto a la regla, no en la plantilla.
      validators: [
        conMensaje(Validators.required, 'Escribe tu nombre.'),
        conMensaje<{ requiredLength: number }>(
          Validators.minLength(3),
          ({ requiredLength }) => `El nombre debe tener al menos ${requiredLength} caracteres.`,
        ),
      ],
    }),
    correo: new FormControl('', {
      nonNullable: true,
      validators: [
        conMensaje(Validators.required, 'Escribe tu correo electrónico.'),
        conMensaje(Validators.email, 'Introduce un correo electrónico válido.'),
      ],
    }),
    aceptarPolitica: new FormControl(false, {
      nonNullable: true,
      validators: [conMensaje(Validators.requiredTrue, 'Debes aceptar la política de privacidad.')],
    }),
  });

  /** Primer mensaje del control: el que definió el validador que falló. La plantilla ya no decide los textos. */
  mensajeDe(control: AbstractControl): string {
    return mensajesDe(control.errors)[0] ?? '';
  }

  readonly nombreConfirmado = signal<string | null>(null);

  submit(): void {
    this.nombreConfirmado.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.nombreConfirmado.set(this.form.controls.nombre.value);
    // Envío correcto: se vacía el formulario. Con controles `nonNullable`, `reset()` vuelve al valor inicial
    // ('' y false) y además limpia touched/dirty, así que no aparecen errores de «campo obligatorio» al vaciarlo.
    this.form.reset();
  }
}
