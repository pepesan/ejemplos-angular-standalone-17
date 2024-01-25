import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroupBasicoComponent } from './form-group-basico.component';
import {ReactiveFormsModule} from "@angular/forms";

describe('FormGroupBasicoComponent', () => {
  let component: FormGroupBasicoComponent;
  let fixture: ComponentFixture<FormGroupBasicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormGroupBasicoComponent, ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupBasicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
