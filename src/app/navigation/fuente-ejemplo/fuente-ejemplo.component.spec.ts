import { ActivatedRouteSnapshot } from '@angular/router';
import { expandirFuentes, recogerFuentes } from './fuente-ejemplo.component';
import { ElementoFuente } from './fuente-ejemplo.tipos';
import { FUENTES_EJEMPLO } from './fuentes-ejemplo.generated';

function snapshot(fuente?: string, hijo: ActivatedRouteSnapshot | null = null): ActivatedRouteSnapshot {
  return { routeConfig: fuente ? { data: { fuente } } : null, firstChild: hijo } as unknown as ActivatedRouteSnapshot;
}

describe('recogerFuentes', () => {
  it('devuelve el fichero declarado en la ruta activa', () => {
    expect(recogerFuentes(snapshot(undefined, snapshot('src/app/a.ts')))).toEqual(['src/app/a.ts']);
  });

  it('incluye padre e hijo sin duplicados', () => {
    const ruta = snapshot('src/app/padre.ts', snapshot('src/app/hijo.ts', snapshot('src/app/hijo.ts')));
    expect(recogerFuentes(ruta)).toEqual(['src/app/padre.ts', 'src/app/hijo.ts']);
  });

  it('devuelve una lista vacía si ninguna ruta declara fuente', () => {
    expect(recogerFuentes(snapshot())).toEqual([]);
  });
});

describe('expandirFuentes', () => {
  const mapa: Record<string, ElementoFuente[]> = {
    'p.ts': [{ ruta: 'p.ts', tipo: 'page' }, { ruta: 'c.ts', tipo: 'componente' }],
    'h.ts': [{ ruta: 'h.ts', tipo: 'componente' }, { ruta: 'c.ts', tipo: 'componente' }],
  };

  it('incluye los elementos que usa cada fichero principal, sin duplicados', () => {
    expect(expandirFuentes(['p.ts', 'h.ts'], mapa).map((e) => e.ruta)).toEqual(['p.ts', 'c.ts', 'h.ts']);
  });

  it('usa el fichero como componente si no está en el mapa', () => {
    expect(expandirFuentes(['x.ts'], mapa)).toEqual([{ ruta: 'x.ts', tipo: 'componente' }]);
  });

  it('todos los ejemplos generados empiezan por su propio fichero', () => {
    for (const [raiz, elementos] of Object.entries(FUENTES_EJEMPLO)) {
      expect(elementos[0].ruta).toBe(raiz);
    }
  });
});
