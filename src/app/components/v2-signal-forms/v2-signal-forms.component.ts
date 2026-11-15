import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';

interface Contacto { nombre: string; correo: string; }

@Component({
  selector: 'app-v2-signal-forms', standalone: true, imports: [FormField],
  templateUrl: './v2-signal-forms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2SignalFormsComponent {
  readonly modelo = signal<Contacto>({ nombre: '', correo: '' });
  readonly formulario = form(this.modelo, (ruta) => {
    required(ruta.nombre, { message: 'Escribe tu nombre.' });
    required(ruta.correo, { message: 'Escribe tu correo.' });
    email(ruta.correo, { message: 'Introduce un correo válido.' });
  });
  readonly confirmacion = signal('');

  guardar(event: SubmitEvent): void {
    event.preventDefault();
    this.formulario.nombre().markAsTouched();
    this.formulario.correo().markAsTouched();
    if (this.formulario().valid()) this.confirmacion.set(`Contacto guardado para ${this.modelo().nombre}.`);
    else this.confirmacion.set('');
  }
}
