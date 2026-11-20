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

  describe('formulario con ConfirmedControlValidator (recibe el FormControl)', () => {
    const el = (selector: string) => fixture.nativeElement.querySelector(selector);
    const escribir = (selector: string, valor: string) => {
      const input = el(selector) as HTMLInputElement;
      input.value = valor;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    };
    const password = () => `#form-controles input[formControlName="password"]`;
    const repetida = () => `#form-controles input[formControlName="repeatedPassword"]`;
    const boton = () => el('#form-controles button[type="submit"]') as HTMLButtonElement;
    const avisoNoCoinciden = () => el('#form-controles')?.textContent?.includes('Las contraseñas no coinciden');

    it('empieza inválido y con el botón deshabilitado', () => {
      expect(component.controlesForm.invalid).toBe(true);
      expect(boton().disabled).toBe(true);
    });

    it('avisa si las contraseñas no coinciden y deshabilita el botón', () => {
      escribir(password(), 'secreto');
      escribir(repetida(), 'otro');

      expect(avisoNoCoinciden()).toBe(true);
      expect(component.controlesForm.controls.repeatedPassword.hasError('confirmedValidator')).toBe(true);
      expect(boton().disabled).toBe(true);
    });

    it('es válido y habilita el botón cuando coinciden', () => {
      escribir(password(), 'secreto');
      escribir(repetida(), 'secreto');

      expect(avisoNoCoinciden()).toBe(false);
      expect(component.controlesForm.valid).toBe(true);
      expect(boton().disabled).toBe(false);
    });

    it('revalida la repetida al cambiar después la contraseña', () => {
      escribir(password(), 'secreto');
      escribir(repetida(), 'secreto');
      expect(component.controlesForm.valid).toBe(true);

      escribir(password(), 'cambiada');

      expect(component.controlesForm.controls.repeatedPassword.hasError('confirmedValidator')).toBe(true);
      expect(avisoNoCoinciden()).toBe(true);
      expect(boton().disabled).toBe(true);
    });
  });
});
