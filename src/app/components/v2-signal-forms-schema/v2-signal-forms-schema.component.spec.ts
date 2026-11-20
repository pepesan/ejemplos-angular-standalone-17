import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';
import { CONTACTO_VACIO, Contacto, contactoSchema } from './contacto.schema';
import { V2SignalFormsSchemaComponent } from './v2-signal-forms-schema.component';

describe('contactoSchema (el esquema, sin renderizar ningún componente)', () => {
  const crear = (valor: Partial<Contacto> = {}) =>
    TestBed.runInInjectionContext(() => form(signal<Contacto>({ ...CONTACTO_VACIO, ...valor }), contactoSchema));

  it('exige nombre y correo', () => {
    const f = crear();

    expect(f.nombre().getError('required')?.message).toBe('Escribe tu nombre.');
    expect(f.correo().getError('required')?.message).toBe('Escribe tu correo.');
    expect(f().valid()).toBe(false);
  });

  it('rechaza un correo mal formado con el error «email» y no con «required»', () => {
    const f = crear({ nombre: 'Lucía', correo: 'no-es-un-correo' });

    expect(f.correo().getError('email')?.message).toBe('Introduce un correo válido.');
    expect(f.correo().getError('required')).toBeUndefined();
  });

  it('es válido con nombre y correo correctos', () => {
    expect(crear({ nombre: 'Lucía', correo: 'lucia@example.com' })().valid()).toBe(true);
  });

  it('no valida la empresa: ni vacía ni con cualquier valor', () => {
    expect(crear({ nombre: 'Lucía', correo: 'lucia@example.com', empresa: '' }).empresa().invalid()).toBe(false);
    expect(crear({ nombre: 'Lucía', correo: 'lucia@example.com', empresa: '  ??? 1' }).empresa().invalid()).toBe(false);
  });
});

describe('V2SignalFormsSchemaComponent', () => {
  const crear = () => {
    TestBed.configureTestingModule({ imports: [V2SignalFormsSchemaComponent] });
    const fixture = TestBed.createComponent(V2SignalFormsSchemaComponent);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  };
  const enviar = (fixture: ReturnType<typeof crear>['fixture']) => {
    fixture.componentInstance.guardar(new Event('submit') as SubmitEvent);
    fixture.detectChanges();
  };

  it('valida con el esquema aparte y confirma un contacto válido', () => {
    const { fixture, component } = crear();

    enviar(fixture);
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBe(2);
    expect(component.formulario().valid()).toBe(false);

    component.modelo.set({ nombre: 'Lucía', correo: 'lucia@example.com', empresa: '' });
    enviar(fixture);
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Lucía');
  });

  it('muestra el error del correo por tipo', () => {
    const { fixture, component } = crear();

    enviar(fixture);
    expect(fixture.nativeElement.querySelector('#esquema-correo-error .error-required')?.textContent).toContain('Escribe tu correo.');
    expect(fixture.nativeElement.querySelector('#esquema-correo-error .error-email')).toBeNull();

    component.modelo.set({ nombre: 'Lucía', correo: 'no-es-un-correo', empresa: '' });
    enviar(fixture);
    expect(fixture.nativeElement.querySelector('#esquema-correo-error .error-email')?.textContent).toContain('Introduce un correo válido.');
    expect(fixture.nativeElement.querySelector('#esquema-correo-error .error-required')).toBeNull();
  });

  it('el campo empresa se enlaza al modelo y no se valida', () => {
    const { fixture, component } = crear();
    const input = fixture.nativeElement.querySelector('#esquema-empresa') as HTMLInputElement;
    input.value = 'Cursos de Desarrollo';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.modelo().empresa).toBe('Cursos de Desarrollo');
    expect(component.formulario.empresa().invalid()).toBe(false);
  });

  it('cada instancia parte de un modelo propio (no comparte el objeto inicial)', () => {
    const a = crear().component;
    a.modelo.update((m) => ({ ...m, nombre: 'Ana' }));

    expect(CONTACTO_VACIO.nombre).toBe('');
  });
});
