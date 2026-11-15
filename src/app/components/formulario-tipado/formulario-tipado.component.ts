import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-tipado',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-tipado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioTipadoComponent {
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
  }
}
