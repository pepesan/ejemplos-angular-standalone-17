import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioTipadoComponent } from './formulario-tipado.component';

describe('FormularioTipadoComponent', () => {
  let fixture: ComponentFixture<FormularioTipadoComponent>;
  let component: FormularioTipadoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioTipadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioTipadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('marks invalid fields and shows accessible validation messages on submit', () => {
    component.submit();
    fixture.detectChanges();

    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.nombre.touched).toBe(true);
    expect(component.form.controls.correo.touched).toBe(true);
    expect(component.form.controls.aceptarPolitica.touched).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('Escribe tu nombre.');
  });

  it('reports length and email validation errors', () => {
    component.form.setValue({
      nombre: 'Al',
      correo: 'not-an-email',
      aceptarPolitica: true,
    });
    component.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('El nombre debe tener al menos 3 caracteres.');
    expect(fixture.nativeElement.textContent).toContain('Introduce un correo electrónico válido.');
    expect(component.nombreConfirmado()).toBeNull();
  });

  it('confirms a valid registration', () => {
    component.form.setValue({
      nombre: 'Ana Pérez',
      correo: 'ana@example.com',
      aceptarPolitica: true,
    });
    component.submit();
    fixture.detectChanges();

    expect(component.nombreConfirmado()).toBe('Ana Pérez');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Ana Pérez');
  });
  it('clears the old confirmation when a later submission is invalid', () => {
    component.form.setValue({
      nombre: 'Ana Pérez',
      correo: 'ana@example.com',
      aceptarPolitica: true,
    });
    component.submit();
    expect(component.nombreConfirmado()).toBe('Ana Pérez');

    component.form.controls.correo.setValue('');
    component.submit();

    expect(component.nombreConfirmado()).toBeNull();
  });

});
