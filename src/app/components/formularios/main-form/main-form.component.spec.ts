import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MainFormComponent} from './main-form.component';
import {FormsModule, NgForm} from "@angular/forms";


describe('MainFormComponent', () => {
  let component: MainFormComponent;
  let fixture: ComponentFixture<MainFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFormComponent, FormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validación del poder', () => {
    const el = (selector: string) => fixture.nativeElement.querySelector(selector);
    const formulario = () => fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    const botonEnviar = () => el('button[type="submit"]') as HTMLButtonElement;
    const avisoPower = () =>
      [...fixture.nativeElement.querySelectorAll('.alert')].find((a: HTMLElement) =>
        a.textContent?.includes('Power is required'));

    const asentar = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const escribir = async (selector: string, valor: string) => {
      const input = el(selector) as HTMLInputElement;
      input.value = valor;
      input.dispatchEvent(new Event('input'));
      await asentar();
    };
    const elegirPoder = async (valor: string) => {
      const select = el('#power') as HTMLSelectElement;
      select.value = valor;
      select.dispatchEvent(new Event('change'));
      await asentar();
    };

    beforeEach(async () => {
      await asentar();
    });

    it('empieza inválido, con «None» seleccionado y el aviso visible', () => {
      expect(formulario().control.get('power')?.hasError('powerRequerido')).toBe(true);
      expect(formulario().invalid).toBe(true);
      expect(avisoPower()).toBeTruthy();
    });

    it('mantiene el formulario inválido y el botón deshabilitado si el nombre es válido pero el poder es «None»', async () => {
      await escribir('#name', 'Superman');

      expect(formulario().control.get('name')?.valid).toBe(true);
      expect(formulario().valid).toBe(false);
      expect(botonEnviar().disabled).toBe(true);
      expect(avisoPower()).toBeTruthy();
    });

    it('es válido, habilita el botón y oculta el aviso al elegir un poder distinto de «None»', async () => {
      await escribir('#name', 'Superman');
      await elegirPoder('2');

      expect(formulario().control.get('power')?.valid).toBe(true);
      expect(formulario().valid).toBe(true);
      expect(botonEnviar().disabled).toBe(false);
      expect(avisoPower()).toBeUndefined();
    });

    it('vuelve a invalidar el formulario si se regresa a «None»', async () => {
      await escribir('#name', 'Superman');
      await elegirPoder('3');
      expect(formulario().valid).toBe(true);

      await elegirPoder('0');

      expect(formulario().valid).toBe(false);
      expect(botonEnviar().disabled).toBe(true);
      expect(avisoPower()).toBeTruthy();
    });

    it('un poder válido no basta si el nombre es demasiado corto', async () => {
      await escribir('#name', 'abc');
      await elegirPoder('1');

      expect(formulario().control.get('power')?.valid).toBe(true);
      expect(formulario().valid).toBe(false);
      expect(botonEnviar().disabled).toBe(true);
    });
  });
});
