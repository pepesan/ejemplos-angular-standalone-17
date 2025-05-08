import { TestBed } from '@angular/core/testing';

import { PactometroService } from './pactometro.service';

describe('PactometroService', () => {
  let service: PactometroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PactometroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
