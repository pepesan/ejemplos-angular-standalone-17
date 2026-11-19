import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { conMensaje, detallesDe, mensajesDe } from '../../validators/validador-con-mensaje';

type TipoCampo = 'text' | 'number' | 'checkbox' | 'tel';

interface EntradaCatalogo {
  id: string;
  etiqueta: string;
  tipo: TipoCampo;
  /** Validadores de `Validators` que usa el campo, tal y como se escriben en el código. */
  validadores: string[];
  explicacion: string;
  control: FormControl<string> | FormControl<number | null> | FormControl<boolean>;
}

/**
 * Catálogo de TODOS los validadores predefinidos de la clase `Validators`: `required`, `requiredTrue`, `min`,
 * `max`, `minLength`, `maxLength`, `email`, `pattern`, `compose` y `nullValidator`. Cada campo enseña, en vivo,
 * el objeto de error real que devuelve el validador (`control.errors`). Los mensajes se definen junto a cada
 * validador con `conMensaje`, igual que en el formulario tipado.
 */
@Component({
  selector: 'app-v2-validadores-predefinidos',
  imports: [ReactiveFormsModule],
  templateUrl: './v2-validadores-predefinidos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2ValidadoresPredefinidosComponent {
  readonly form = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [conMensaje(Validators.required, 'Escribe tu nombre.')],
    }),
    condiciones: new FormControl(false, {
      nonNullable: true,
      validators: [conMensaje(Validators.requiredTrue, 'Debes aceptar las condiciones.')],
    }),
    edad: new FormControl<number | null>(null, {
      validators: [
        conMensaje<{ min: number }>(Validators.min(18), ({ min }) => `La edad mínima es ${min}.`),
        conMensaje<{ max: number }>(Validators.max(65), ({ max }) => `La edad máxima es ${max}.`),
      ],
    }),
    usuario: new FormControl('', {
      nonNullable: true,
      validators: [
        conMensaje<{ requiredLength: number }>(Validators.minLength(3), ({ requiredLength }) => `Mínimo ${requiredLength} caracteres.`),
        conMensaje<{ requiredLength: number }>(Validators.maxLength(12), ({ requiredLength }) => `Máximo ${requiredLength} caracteres.`),
      ],
    }),
    correo: new FormControl('', {
      nonNullable: true,
      validators: [conMensaje(Validators.email, 'Introduce un correo electrónico válido.')],
    }),
    codigoPostal: new FormControl('', {
      nonNullable: true,
      validators: [conMensaje(Validators.pattern(/^\d{5}$/), 'El código postal tiene 5 dígitos.')],
    }),
    exigirTelefono: new FormControl(false, { nonNullable: true }),
    // Empieza sin exigir nada: `nullValidator` es un validador que nunca falla.
    telefono: new FormControl('', { nonNullable: true, validators: [Validators.nullValidator] }),
  });

  readonly catalogo: EntradaCatalogo[] = [
    {
      id: 'nombre', etiqueta: 'Nombre', tipo: 'text', control: this.form.controls.nombre,
      validadores: ['Validators.required'],
      explicacion: 'Falla si el valor está vacío (cadena vacía, null o undefined).',
    },
    {
      id: 'condiciones', etiqueta: 'Acepto las condiciones', tipo: 'checkbox', control: this.form.controls.condiciones,
      validadores: ['Validators.requiredTrue'],
      explicacion: 'Como required, pero para casillas: solo es válido si vale exactamente true.',
    },
    {
      id: 'edad', etiqueta: 'Edad (18 a 65)', tipo: 'number', control: this.form.controls.edad,
      validadores: ['Validators.min(18)', 'Validators.max(65)'],
      explicacion: 'Comparan un valor numérico. Con el campo vacío no fallan: combínalos con required si es obligatorio.',
    },
    {
      id: 'usuario', etiqueta: 'Usuario (3 a 12 caracteres)', tipo: 'text', control: this.form.controls.usuario,
      validadores: ['Validators.minLength(3)', 'Validators.maxLength(12)'],
      explicacion: 'Comprueban la longitud del texto. Un campo vacío no falla en minLength (usa required para eso).',
    },
    {
      id: 'correo', etiqueta: 'Correo electrónico', tipo: 'text', control: this.form.controls.correo,
      validadores: ['Validators.email'],
      explicacion: 'Valida el formato de un correo. Un campo vacío es válido: añade required si es obligatorio.',
    },
    {
      id: 'codigo-postal', etiqueta: 'Código postal', tipo: 'text', control: this.form.controls.codigoPostal,
      validadores: ['Validators.pattern(/^\\d{5}$/)'],
      explicacion: 'Comprueba el valor contra una expresión regular. Con un RegExp conviene anclarla con ^ y $.',
    },
  ];

  /** Primer mensaje del control: el que definió el validador que falló. */
  mensajeDe(control: AbstractControl): string {
    return mensajesDe(control.errors)[0] ?? '';
  }

  /** Errores reales del control (`control.errors`), tal y como los devuelven los validadores. */
  erroresDe(control: AbstractControl): string {
    const detalles = detallesDe(control.errors);
    return detalles.length ? detalles.map((d) => `${d.clave}: ${JSON.stringify(d.detalle)}`).join('\n') : 'null (válido)';
  }

  /**
   * Cambia los validadores del teléfono en caliente: `Validators.compose` junta varios en uno y `nullValidator`
   * quita la exigencia. Tras `setValidators` hay que llamar a `updateValueAndValidity` para recalcular.
   */
  alternarTelefono(): void {
    const telefono = this.form.controls.telefono;
    telefono.setValidators(
      this.form.controls.exigirTelefono.value
        ? Validators.compose([
            conMensaje(Validators.required, 'Escribe tu teléfono.'),
            conMensaje(Validators.pattern(/^\d+$/), 'Solo dígitos, sin espacios.'),
            conMensaje<{ requiredLength: number }>(Validators.minLength(9), ({ requiredLength }) => `Mínimo ${requiredLength} dígitos.`),
          ])
        : Validators.nullValidator,
    );
    telefono.updateValueAndValidity();
  }
}
