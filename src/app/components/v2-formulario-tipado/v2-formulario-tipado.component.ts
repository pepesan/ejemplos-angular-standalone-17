import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
      validators: [Validators.required, Validators.minLength(3)],
    }),
    correo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    aceptarPolitica: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

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
