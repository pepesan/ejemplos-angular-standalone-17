import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPartidosComponent } from './listado-partidos.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('ListadoPartidosComponent', () => {
  let component: ListadoPartidosComponent;
  let fixture: ComponentFixture<ListadoPartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPartidosComponent ],
      imports: [
        HttpClientModule
      ],
      providers:[
        HttpClient
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
