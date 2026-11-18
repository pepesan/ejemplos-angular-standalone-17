import { ActivatedRouteSnapshot, Route } from '@angular/router';
import { routes } from '../../app.routes';
import { V2_RUTAS as rutasV2 } from '../../components/v2-rutas/rutas-v2.routes';
import { LIMITE_VISIBLES, expandirFuentes, recogerFuentes } from './fuente-ejemplo.component';
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

// Contrato: toda ruta de ejemplo declara `data.fuente` y ese fichero existe en el mapa generado por `npm run fuentes`.
// Sin esto, una ruta nueva se queda sin el aviso de ficheros sin que nada falle.
describe('rutas de ejemplo', () => {
  const SIN_AVISO = ['home', 'about', '404', '**', '', 'lazy'];

  function aplanar(rutas: Route[], prefijo = ''): { ruta: string; config: Route }[] {
    return rutas.flatMap((config) => {
      const ruta = [prefijo, config.path ?? ''].filter(Boolean).join('/');
      return [{ ruta, config }, ...aplanar(config.children ?? [], ruta)];
    });
  }

  const conComponente = [...aplanar(routes), ...aplanar(rutasV2, 'v2/rutas')].filter(
    ({ config }) => config.component && !SIN_AVISO.includes(config.path ?? ''),
  );

  it('hay rutas que comprobar', () => {
    expect(conComponente.length).toBeGreaterThan(40);
  });

  it('cada ruta con componente declara data.fuente', () => {
    const sinFuente = conComponente.filter(({ config }) => !config.data?.['fuente']).map(({ ruta }) => ruta);
    expect(sinFuente).toEqual([]);
  });

  it('cada fuente declarada tiene entrada en el mapa generado', () => {
    const faltan = conComponente
      .map(({ config }) => config.data?.['fuente'] as string | undefined)
      .filter((f): f is string => !!f && !(f in FUENTES_EJEMPLO));
    expect(faltan).toEqual([]);
  });
});

describe('LIMITE_VISIBLES', () => {
  it('ningún ejemplo salvo los largos queda plegado por defecto', () => {
    const largos = Object.values(FUENTES_EJEMPLO).filter((e) => e.length > LIMITE_VISIBLES);
    expect(largos.length).toBeGreaterThan(0);
    expect(largos.length).toBeLessThan(10);
  });
});
