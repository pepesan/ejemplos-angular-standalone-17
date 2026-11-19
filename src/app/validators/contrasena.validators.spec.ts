import { FormControl, FormGroup } from '@angular/forms';
import { coinciden, tieneMayuscula, tieneMinuscula, tieneNumero, tieneSimbolo, validadoresContrasena } from './contrasena.validators';

const VALIDA = 'Contrasena-Muy-Segura-2026!';

function errores(valor: string): string[] {
  return Object.keys(new FormControl(valor, validadoresContrasena()).errors ?? {});
}

describe('validadores de contraseña', () => {
  it('acepta una contraseña de 20 o más caracteres con número, minúscula, mayúscula y símbolo', () => {
    expect(VALIDA.length).toBeGreaterThanOrEqual(20);
    expect(errores(VALIDA)).toEqual([]);
  });

  it('cada validador propio detecta solo su requisito', () => {
    expect(tieneNumero(new FormControl('sin-numeros'))).toEqual({ numero: true });
    expect(tieneMinuscula(new FormControl('SOLO-MAYUSCULAS-1'))).toEqual({ minuscula: true });
    expect(tieneMayuscula(new FormControl('solo-minusculas-1'))).toEqual({ mayuscula: true });
    expect(tieneSimbolo(new FormControl('SinSimbolos1'))).toEqual({ simbolo: true });
  });

  it('acumula todos los requisitos incumplidos', () => {
    expect(errores('abc')).toEqual(['minlength', 'numero', 'mayuscula', 'simbolo']);
  });

  it('un valor vacío solo falla en required', () => {
    expect(errores('')).toEqual(['required']);
  });

  it('exige 20 caracteres exactos como mínimo', () => {
    expect(errores('Aa1!' + 'x'.repeat(15))).toContain('minlength'); // 19
    expect(errores('Aa1!' + 'x'.repeat(16))).not.toContain('minlength'); // 20
  });

  it('el símbolo no se confunde con letras acentuadas ni con espacios', () => {
    expect(tieneSimbolo(new FormControl('Contraseña con ñ y 1'))).toEqual({ simbolo: true });
  });
});

describe('coinciden', () => {
  const grupo = (a: string, b: string) =>
    new FormGroup({ a: new FormControl(a), b: new FormControl(b) }, { validators: [coinciden('a', 'b')] });

  it('falla si los dos campos tienen valor y son distintos', () => {
    expect(grupo('uno', 'dos').hasError('noCoinciden')).toBe(true);
  });

  it('no falla si son iguales', () => {
    expect(grupo('uno', 'uno').errors).toBeNull();
  });

  it('no opina si alguno está vacío', () => {
    expect(grupo('uno', '').errors).toBeNull();
    expect(grupo('', '').errors).toBeNull();
  });
});
