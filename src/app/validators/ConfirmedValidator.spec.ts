import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfirmedValidator } from './ConfirmedValidator';

describe('ConfirmedValidator', () => {
  let grupo: FormGroup<{ password: FormControl<string | null>; repeated: FormControl<string | null> }>;

  beforeEach(() => {
    // El validador escribe trazas por consola; se silencian para no ensuciar la salida de los tests.
    vi.spyOn(console, 'log').mockImplementation(() => {});
    grupo = new FormGroup({
      password: new FormControl<string | null>(''),
      // Como en el ejemplo real: con Validators.required y el campo vacío, el validador asíncrono no llega a
      // ejecutarse al construir el control (cuando todavía no tiene grupo padre).
      repeated: new FormControl<string | null>('', {
        validators: Validators.required,
        asyncValidators: ConfirmedValidator('password')
      })
    });
  });

  afterEach(() => vi.restoreAllMocks());

  const validar = (password: string, repeated: string) => {
    grupo.controls.password.setValue(password);
    grupo.controls.repeated.setValue(repeated);
    return firstValueFrom(ConfirmedValidator('password')(grupo.controls.repeated) as Observable<ValidationErrors | null>);
  };

  it('devuelve null si los dos campos coinciden', async () => {
    expect(await validar('secreto', 'secreto')).toBeNull();
  });

  it('devuelve confirmedValidator con ambos valores si no coinciden', async () => {
    expect(await validar('secreto', 'otro')).toEqual({
      confirmedValidator: { value: 'otro', confirmed: 'secreto' }
    });
  });

  it('distingue mayúsculas de minúsculas', async () => {
    expect(await validar('Secreto', 'secreto')).not.toBeNull();
  });

  it('en el grupo, marca el campo repetido como inválido y lo valida al coincidir', () => {
    grupo.controls.password.setValue('secreto');
    grupo.controls.repeated.setValue('otro');

    expect(grupo.controls.repeated.hasError('confirmedValidator')).toBe(true);
    expect(grupo.controls.repeated.invalid).toBe(true);

    grupo.controls.repeated.setValue('secreto');

    expect(grupo.controls.repeated.valid).toBe(true);
  });

  it('exige un control con grupo padre: sin él lanza TypeError (precondición documentada en el validador)', () => {
    const suelto = new FormControl('abc');

    expect(() => ConfirmedValidator('password')(suelto)).toThrow(TypeError);
  });

  it('compara con el control cuyo nombre recibe', async () => {
    const otroGrupo = new FormGroup({
      clave: new FormControl('abc'),
      confirmacion: new FormControl('abc')
    });

    const resultado = await firstValueFrom(
      ConfirmedValidator('clave')(otroGrupo.controls.confirmacion) as Observable<ValidationErrors | null>
    );

    expect(resultado).toBeNull();
  });
});
