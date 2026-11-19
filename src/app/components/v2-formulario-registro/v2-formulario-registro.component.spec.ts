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

  describe('botón «Ver»', () => {
    const campo = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
    const boton = (id: string) => fixture.nativeElement.querySelector(`button[aria-controls="${id}"]`) as HTMLButtonElement;

    it('los dos campos empiezan ocultos', () => {
      expect(campo('contrasena').type).toBe('password');
      expect(campo('repite').type).toBe('password');
      expect(boton('contrasena').textContent).toContain('Ver');
    });

    it('alterna el tipo del campo entre password y text sin tocar su valor', () => {
      component.form.controls.contrasena.setValue(SEGURA);
      boton('contrasena').click();
      fixture.detectChanges();
      expect(campo('contrasena').type).toBe('text');
      expect(campo('contrasena').value).toBe(SEGURA);
      expect(boton('contrasena').textContent).toContain('Ocultar');

      boton('contrasena').click();
      fixture.detectChanges();
      expect(campo('contrasena').type).toBe('password');
    });

    it('cada campo tiene su propio botón', () => {
      boton('repite').click();
      fixture.detectChanges();
      expect(campo('repite').type).toBe('text');
      expect(campo('contrasena').type).toBe('password');
    });

    it('los botones no envían el formulario', () => {
      expect(boton('contrasena').type).toBe('button');
      boton('contrasena').click();
      fixture.detectChanges();
      expect(component.form.controls.correo.touched).toBe(false);
    });

    it('tras registrar vuelven a ocultar el contenido', () => {
      boton('contrasena').click();
      boton('repite').click();
      component.form.setValue({ correo: 'ana@example.com', contrasena: SEGURA, repite: SEGURA });
      component.registrar();
      fixture.detectChanges();
      expect(campo('contrasena').type).toBe('password');
      expect(campo('repite').type).toBe('password');
    });
  });
});
