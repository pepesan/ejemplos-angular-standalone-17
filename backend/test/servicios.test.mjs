import { describe, expect, it } from 'vitest';
import { crearCatalogoService } from '../src/services/catalogo.service.mjs';
import { crearCatalogoRepositorio } from '../src/repositories/catalogo.repository.mjs';
import { crearAuthService } from '../src/services/auth.service.mjs';
import { crearServicioJwt } from '../src/services/jwt.service.mjs';

describe('catálogo', () => {
  const catalogo = crearCatalogoService({ repositorio: crearCatalogoRepositorio() });

  it('sin filtro devuelve todos los cursos; el filtro ignora mayúsculas y espacios', () => {
    expect(catalogo.cursos()).toHaveLength(4);
    expect(catalogo.cursos('  RUTING ')).toEqual([]);
    expect(catalogo.cursos('  ROUTING ').map((c) => c.id)).toEqual([2]);
  });

  it('resultados y recurso', () => {
    expect(catalogo.resultados()).toHaveLength(3);
    expect(catalogo.recurso('7')).toEqual({ id: '7', title: 'Recurso 7', source: 'backend local' });
  });
});

describe('autenticación', () => {
  const jwt = crearServicioJwt({ secreto: 's', emisor: 'e', duracionSegundos: 900 });
  const auth = crearAuthService({ jwt });

  it('login sin argumentos es un 401, no un error de programación', () => {
    expect(() => auth.login()).toThrow(expect.objectContaining({ estado: 401 }));
  });
});
