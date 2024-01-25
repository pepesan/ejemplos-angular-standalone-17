import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleComponent } from './detalle.component';
import {RouterTestingModule} from "@angular/router/testing";

describe('DetalleComponent', () => {
  let component: DetalleComponent;
  let fixture: ComponentFixture<DetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
