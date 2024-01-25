import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidatePasswordsComponent } from './form-validate-passwords.component';
import {ReactiveFormsModule} from "@angular/forms";

describe('FormValidatePasswordsComponent', () => {
  let component: FormValidatePasswordsComponent;
  let fixture: ComponentFixture<FormValidatePasswordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormValidatePasswordsComponent, ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(FormValidatePasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
