export type TipoElemento = 'page' | 'componente' | 'pipe' | 'directiva' | 'servicio' | 'guarda' | 'modelo' | 'validador' | 'modulo' | 'rutas';

export interface ElementoFuente {
  ruta: string;
  tipo: TipoElemento;
}
