import { FormControl, Validators } from '@angular/forms';
import { conMensaje, mensajesDe } from './validador-con-mensaje';

describe('conMensaje', () => {
  it('conserva el nombre del error y añade el mensaje', () => {
    const control = new FormControl('', conMensaje(Validators.required, 'Escribe algo.'));
    expect(control.hasError('required')).toBe(true);
    expect(mensajesDe(control.errors)).toEqual(['Escribe algo.']);
  });

  it('permite que el mensaje dependa del detalle del error', () => {
    const control = new FormControl('ab', conMensaje<{ requiredLength: number }>(Validators.minLength(3), (d) => `Mínimo ${d.requiredLength}.`));
    expect(mensajesDe(control.errors)).toEqual(['Mínimo 3.']);
  });

  it('no devuelve errores si el valor es válido', () => {
    expect(new FormControl('abc', conMensaje(Validators.required, 'x')).errors).toBeNull();
    expect(mensajesDe(null)).toEqual([]);
  });

  it('usa un mensaje genérico si el error no lleva mensaje propio', () => {
    expect(mensajesDe({ raro: true })).toEqual(['El valor no es válido.']);
  });
});
