import { TestBed } from '@angular/core/testing';

import {ApiClientService} from "./apiclient.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('ApiclientService', () => {
  let service: ApiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers:[
        HttpClient
      ]
    });
    service = TestBed.inject(ApiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
