import { TestBed } from '@angular/core/testing';

import { PeticionPostService } from './peticion-post.service';

describe('PeticionPostService', () => {
  let service: PeticionPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeticionPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
