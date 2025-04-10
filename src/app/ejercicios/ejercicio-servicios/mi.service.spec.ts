import { TestBed } from '@angular/core/testing';

import { MiService } from './mi.service';

describe('MiService', () => {
  let service: MiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
