import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V2FormularioTipadoComponent } from './v2-formulario-tipado.component';

describe('V2FormularioTipadoComponent', () => {
  let fixture: ComponentFixture<V2FormularioTipadoComponent>;
  let component: V2FormularioTipadoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V2FormularioTipadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V2FormularioTipadoComponent);
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

  it('limpia el formulario tras un envío correcto sin mostrar errores', () => {
    component.form.setValue({ nombre: 'Ana Pérez', correo: 'ana@example.com', aceptarPolitica: true });
    component.submit();
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual({ nombre: '', correo: '', aceptarPolitica: false });
    expect(component.form.untouched).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBe(0);
    // La confirmación sigue visible aunque el formulario esté vacío.
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Ana Pérez');
  });

  it('no limpia el formulario si el envío no es válido', () => {
    component.form.setValue({ nombre: 'Ana Pérez', correo: 'no-es-correo', aceptarPolitica: true });
    component.submit();

    expect(component.form.controls.nombre.value).toBe('Ana Pérez');
  });
});
