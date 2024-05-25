import { TestBed } from '@angular/core/testing';

import {ApiClientService} from "./apiclient.service";
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe('ApiclientService', () => {
  let service: ApiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        HttpClient,
        provideHttpClient(withInterceptorsFromDi())
    ]
});
    service = TestBed.inject(ApiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
