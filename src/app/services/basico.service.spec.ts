import { TestBed } from '@angular/core/testing';

import { BasicoService } from './basico.service';

describe('BasicoService (@Service)', () => {
  let service: BasicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('es singleton: @Service() lo registra en la raíz sin declarar providers', () => {
    expect(TestBed.inject(BasicoService)).toBe(service);
  });

  it('expone una propiedad y un método', () => {
    expect(service.propiedad).toBe('Valor');
    expect(service.getData()).toBe('Dato básico');
  });
});
