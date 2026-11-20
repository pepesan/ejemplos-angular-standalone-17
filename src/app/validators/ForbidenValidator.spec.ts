import { FormControl } from '@angular/forms';
import { ForbiddenNameValidator } from './ForbidenValidator';

describe('ForbiddenNameValidator', () => {
  const validar = (valor: string | null, patron = /bob/i) => ForbiddenNameValidator(patron)(new FormControl(valor));

  it.each(['bob', 'Bob', 'BOB'])('rechaza "%s" y devuelve el valor en el error', (nombre) => {
    expect(validar(nombre)).toEqual({ forbiddenName: { value: nombre } });
  });

  it('rechaza los nombres que contienen el patrón, no solo los idénticos', () => {
    expect(validar('bobby')?.['forbiddenName']).toBeDefined();
    expect(validar('el bobo')?.['forbiddenName']).toBeDefined();
  });

  it('acepta los nombres que no coinciden con el patrón', () => {
    expect(validar('alice')).toBeNull();
    expect(validar('bo b')).toBeNull();
  });

  it('acepta el valor vacío o nulo: la obligatoriedad es cosa de Validators.required', () => {
    expect(validar('')).toBeNull();
    expect(validar(null)).toBeNull();
  });

  it('usa el patrón que recibe, no uno fijo', () => {
    expect(validar('alice', /alice/i)).toEqual({ forbiddenName: { value: 'alice' } });
    expect(validar('bob', /alice/i)).toBeNull();
  });

  it('en un control, la clave forbiddenName permite a la plantilla identificar el error', () => {
    const control = new FormControl('Bob', ForbiddenNameValidator(/bob/i));

    expect(control.invalid).toBe(true);
    expect(control.hasError('forbiddenName')).toBe(true);

    control.setValue('Alice');
    expect(control.valid).toBe(true);
  });
});
