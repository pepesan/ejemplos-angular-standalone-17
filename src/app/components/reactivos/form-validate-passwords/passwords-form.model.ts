import { FormControl, FormGroup } from '@angular/forms';

/**
 * Controles del formulario de contraseñas. Es el «modelo tipado» del formulario: cada clave es un
 * `FormControl<string>` (no nulo, porque los controles se crean con `nonNullable`), así que
 * `form.controls.password`, `.value` y `.setValue(...)` están tipados de extremo a extremo.
 */
export interface PasswordsFormControls {
  password: FormControl<string>;
  repeatedPassword: FormControl<string>;
}

/** El `FormGroup` tipado con esos controles. */
export type PasswordsForm = FormGroup<PasswordsFormControls>;

/** Valor plano del formulario, tal y como lo devuelve `getRawValue()`. */
export interface PasswordsValue {
  password: string;
  repeatedPassword: string;
}
