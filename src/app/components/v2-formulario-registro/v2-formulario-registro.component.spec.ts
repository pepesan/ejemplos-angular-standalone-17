import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V2FormularioRegistroComponent } from './v2-formulario-registro.component';

const SEGURA = 'Contrasena-Muy-Segura-2026!';

describe('V2FormularioRegistroComponent', () => {
  let fixture: ComponentFixture<V2FormularioRegistroComponent>;
  let component: V2FormularioRegistroComponent;
  const texto = () => fixture.nativeElement.textContent as string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [V2FormularioRegistroComponent] }).compileComponents();
    fixture = TestBed.createComponent(V2FormularioRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('no registra con campos vacíos y avisa en cada campo', () => {
    component.registrar();
    fixture.detectChanges();
    expect(component.correoRegistrado()).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBe(3);
    expect(texto()).toContain('Escribe la contraseña.');
  });

  it('muestra qué requisitos faltan en la contraseña', () => {
    component.form.controls.contrasena.setValue('abc');
    fixture.detectChanges();
    expect(component.cumple(component.form.controls.contrasena, 'minuscula')).toBe(true);
    expect(component.cumple(component.form.controls.contrasena, 'minlength')).toBe(false);
    expect(component.cumple(component.form.controls.contrasena, 'numero')).toBe(false);
  });

  it('con el campo vacío ningún requisito se marca como cumplido', () => {
    for (const r of component.requisitos) {
      expect(component.cumple(component.form.controls.contrasena, r.clave)).toBe(false);
    }
  });

  it('aplica la misma pila de validadores a «repite contraseña»', () => {
    component.form.setValue({ correo: 'ana@example.com', contrasena: SEGURA, repite: 'corta' });
    component.registrar();
    fixture.detectChanges();
    expect(component.form.controls.repite.hasError('minlength')).toBe(true);
    expect(component.correoRegistrado()).toBeNull();
  });

  it('avisa si las contraseñas son válidas pero no coinciden', () => {
    component.form.setValue({ correo: 'ana@example.com', contrasena: SEGURA, repite: SEGURA + 'x' });
    component.registrar();
    fixture.detectChanges();
    expect(component.form.controls.contrasena.valid).toBe(true);
    expect(component.form.controls.repite.valid).toBe(true);
    expect(component.form.hasError('noCoinciden')).toBe(true);
    expect(texto()).toContain('Las contraseñas no coinciden.');
    expect(component.correoRegistrado()).toBeNull();
  });

  it('registra, confirma y vacía el formulario cuando todo es correcto', () => {
    component.form.setValue({ correo: 'ana@example.com', contrasena: SEGURA, repite: SEGURA });
    component.registrar();
    fixture.detectChanges();
    expect(component.correoRegistrado()).toBe('ana@example.com');
    expect(component.form.getRawValue()).toEqual({ correo: '', contrasena: '', repite: '' });
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBe(0);
    expect(texto()).toContain('Registro correcto para ana@example.com.');
    expect(texto()).not.toContain(SEGURA);
  });
});
