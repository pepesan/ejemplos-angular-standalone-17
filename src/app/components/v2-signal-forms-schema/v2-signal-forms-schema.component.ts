import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';

import { AvisoApiComponent } from '../aviso-api/aviso-api.component';
import { CONTACTO_VACIO, Contacto, contactoSchema } from './contacto.schema';

// DISPONIBILIDAD: `schema()` y `form()` de `@angular/forms/signals` son API estable desde Angular 22.0.
// Mismo formulario que «Signal Forms», pero con las reglas en un esquema aparte (`contacto.schema.ts`).
@Component({
  selector: 'app-v2-signal-forms-schema',
  imports: [FormField, AvisoApiComponent],
  templateUrl: './v2-signal-forms-schema.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2SignalFormsSchemaComponent {
  // Por un lado, los campos (el modelo)...
  readonly modelo: WritableSignal<Contacto> = signal<Contacto>({ ...CONTACTO_VACIO });
  // ...y por otro las reglas (el esquema), que se enlazan al crear el formulario.
  readonly formulario: FieldTree<Contacto>
    = form(this.modelo, contactoSchema);
  readonly confirmacion: WritableSignal<string> = signal('');

  guardar(event: SubmitEvent): void {
    event.preventDefault();
    this.formulario.nombre().markAsTouched();
    this.formulario.correo().markAsTouched();
    if (this.formulario().valid()) this.confirmacion.set(`Contacto guardado para ${this.modelo().nombre}.`);
    else this.confirmacion.set('');
  }
}
