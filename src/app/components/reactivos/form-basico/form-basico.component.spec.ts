import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBasicoComponent } from './form-basico.component';
import {ReactiveFormsModule} from "@angular/forms";

describe('FormBasicoComponent', () => {
  let component: FormBasicoComponent;
  let fixture: ComponentFixture<FormBasicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormBasicoComponent , ReactiveFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBasicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
