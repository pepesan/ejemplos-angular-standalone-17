import { coincidenSiHayValor, contieneMayuscula, contieneMinuscula, contieneNumero, contieneSimbolo } from './reglas';

describe('reglas puras', () => {
  it('detectan cada tipo de carácter', () => {
    expect(contieneNumero('abc1')).toBe(true);
    expect(contieneNumero('abc')).toBe(false);
    expect(contieneMinuscula('ABc')).toBe(true);
    expect(contieneMinuscula('ABC')).toBe(false);
    expect(contieneMayuscula('abC')).toBe(true);
    expect(contieneMayuscula('abc')).toBe(false);
    expect(contieneSimbolo('abc!')).toBe(true);
    expect(contieneSimbolo('abc 1ñ')).toBe(false);
  });

  it('coincidenSiHayValor no opina si alguno está vacío', () => {
    expect(coincidenSiHayValor('a', 'a')).toBe(true);
    expect(coincidenSiHayValor('a', 'b')).toBe(false);
    expect(coincidenSiHayValor('', 'b')).toBe(true);
    expect(coincidenSiHayValor('a', '')).toBe(true);
  });
});
