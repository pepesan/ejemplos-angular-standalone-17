import { FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ConfirmedControlValidator } from './ConfirmedControlValidator';

describe('ConfirmedControlValidator', () => {
  const validar = (password: string, repetida: string) =>
    ConfirmedControlValidator(new FormControl(password))(new FormControl(repetida));

  it('devuelve null si los dos valores coinciden', () => {
    expect(validar('secreto', 'secreto')).toBeNull();
  });

  it('devuelve confirmedValidator con ambos valores si no coinciden (mismo error que ConfirmedValidator)', () => {
    expect(validar('secreto', 'otro')).toEqual({
      confirmedValidator: { value: 'otro', confirmed: 'secreto' }
    });
  });

  it('distingue mayúsculas de minúsculas', () => {
    expect(validar('Secreto', 'secreto')).not.toBeNull();
  });

  it('funciona con controles sueltos, sin FormGroup padre (no lanza como ConfirmedValidator)', () => {
    const password = new FormControl('abc');
    const repetida = new FormControl('abc', ConfirmedControlValidator(password));

    expect(repetida.parent).toBeNull();
    expect(repetida.valid).toBe(true);
  });

  it('funciona con controles en grupos distintos', () => {
    const password = new FormGroup({ clave: new FormControl('abc') });
    const confirmacion = new FormGroup({
      clave: new FormControl('xyz', ConfirmedControlValidator(password.controls.clave))
    });

    expect(confirmacion.controls.clave.hasError('confirmedValidator')).toBe(true);
  });

  it('compara con el valor ACTUAL del otro control, no con el que tenía al crear el validador', () => {
    const password = new FormControl('uno');
    const repetida = new FormControl('dos', ConfirmedControlValidator(password));
    expect(repetida.invalid).toBe(true);

    password.setValue('dos');
    repetida.updateValueAndValidity();

    expect(repetida.valid).toBe(true);
  });

  it('limitación: cambiar el otro control no revalida el validado hasta que se pide', () => {
    const password = new FormControl('uno');
    const repetida = new FormControl('uno', ConfirmedControlValidator(password));
    expect(repetida.valid).toBe(true);

    password.setValue('cambiada');

    expect(repetida.valid).toBe(true); // sigue «válido» aunque ya no coincidan
    repetida.updateValueAndValidity();
    expect(repetida.invalid).toBe(true);
  });

  it('con la suscripción recomendada, el validado se revalida solo al cambiar el otro', () => {
    const password = new FormControl('uno');
    const repetida = new FormControl('uno', ConfirmedControlValidator(password));
    const suscripcion = password.valueChanges.subscribe(() => repetida.updateValueAndValidity());

    password.setValue('cambiada');
    expect(repetida.hasError('confirmedValidator')).toBe(true);

    password.setValue('uno');
    expect(repetida.valid).toBe(true);
    suscripcion.unsubscribe();
  });

  it('se combina con Validators.required: ambos errores conviven', () => {
    const password = new FormControl('abc');
    const repetida = new FormControl('', [Validators.required, ConfirmedControlValidator(password)]);

    expect(repetida.errors).toMatchObject({ required: true, confirmedValidator: { value: '', confirmed: 'abc' } });
  });
});
