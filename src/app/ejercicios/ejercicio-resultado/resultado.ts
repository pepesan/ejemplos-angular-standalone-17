export class Resultado {
  nombre: string = "";
  dipu: number = 0;
  imagen:string = "";
}

/** Estado de la petición que entrega el servicio y que el componente solo pinta. */
export type EstadoResultados =
  | { status: 'loading' }
  | { status: 'success'; items: Resultado[] }
  | { status: 'error'; mensaje: string };
