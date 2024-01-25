import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPartidosComponent} from './listado-partidos.component';
import {HttpClientModule} from "@angular/common/http";


describe('ListadoPartidosComponent', () => {
  let component: ListadoPartidosComponent;
  let fixture: ComponentFixture<ListadoPartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoPartidosComponent, HttpClientModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListadoPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
