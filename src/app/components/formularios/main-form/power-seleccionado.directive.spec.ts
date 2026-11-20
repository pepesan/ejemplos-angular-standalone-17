import { FormControl } from '@angular/forms';
import { PowerSeleccionadoDirective } from './power-seleccionado.directive';

describe('PowerSeleccionadoDirective', () => {
  const directiva = new PowerSeleccionadoDirective();
  const validar = (valor: unknown) => directiva.validate(new FormControl(valor));

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['cadena vacía', ''],
    ['el número 0 («None»)', 0],
    ['la cadena "0" que emite el <select>', '0']
  ])('marca error si el valor es %s', (_descripcion, valor) => {
    expect(validar(valor)).toEqual({ powerRequerido: true });
  });

  it.each([
    ['un número', 1],
    ['la cadena "2" que emite el <select>', '2'],
    ['el último poder', 4]
  ])('no marca error con %s', (_descripcion, valor) => {
    expect(validar(valor)).toBeNull();
  });
});
