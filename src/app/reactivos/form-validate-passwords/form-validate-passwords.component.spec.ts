import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidatePasswordsComponent } from './form-validate-passwords.component';

describe('FormValidatePasswordsComponent', () => {
  let component: FormValidatePasswordsComponent;
  let fixture: ComponentFixture<FormValidatePasswordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormValidatePasswordsComponent]
    });
    fixture = TestBed.createComponent(FormValidatePasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
