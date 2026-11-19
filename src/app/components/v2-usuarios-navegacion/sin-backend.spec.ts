import { HttpErrorResponse } from '@angular/common/http';
import { ErrorApi } from '../../services/usuarios-api.service';
import { esUrlInterna } from './ruta-base';
import { esSinBackend } from './sin-backend';

describe('esSinBackend', () => {
  it('reconoce los estados del proxy sin backend, en HttpErrorResponse y en ErrorApi', () => {
    for (const status of [0, 502, 503, 504]) {
      expect(esSinBackend(new HttpErrorResponse({ status }))).toBe(true);
      expect(esSinBackend(new ErrorApi('x', status))).toBe(true);
    }
  });

  it('no confunde los errores de la API con un backend apagado', () => {
    for (const status of [400, 401, 404, 409, 500]) {
      expect(esSinBackend(new HttpErrorResponse({ status }))).toBe(false);
      expect(esSinBackend(new ErrorApi('x', status))).toBe(false);
    }
    expect(esSinBackend(new Error('x'))).toBe(false);
    expect(esSinBackend(null)).toBe(false);
  });
});

describe('esUrlInterna', () => {
  it('acepta solo URLs de la propia feature', () => {
    expect(esUrlInterna('/v2/usuarios-navegacion')).toBe(true);
    expect(esUrlInterna('/v2/usuarios-navegacion/nuevo')).toBe(true);
    expect(esUrlInterna('/v2/usuarios-navegacion?q=ana')).toBe(true);
  });

  it('rechaza otras rutas, otras webs y valores vacíos (open redirect)', () => {
    for (const url of ['https://malo.example', '//malo.example', '/otra', '/v2/usuarios-navegacionX', '', null, undefined]) {
      expect(esUrlInterna(url)).toBe(false);
    }
  });
});
