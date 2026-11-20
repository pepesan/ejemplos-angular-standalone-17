import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';
import { CONTACTO_VACIO, Contacto, contactoSchema, contactoSchemaFn } from './contacto.schema';
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

describe('contactoSchemaFn (la misma definición como función suelta)', () => {
  const crear = (esquema: typeof contactoSchema | typeof contactoSchemaFn, valor: Partial<Contacto> = {}) =>
    TestBed.runInInjectionContext(() => form(signal<Contacto>({ ...CONTACTO_VACIO, ...valor }), esquema));

  it.each([
    ['vacío', {}],
    ['correo mal formado', { nombre: 'Lucía', correo: 'no-es-un-correo' }],
    ['válido', { nombre: 'Lucía', correo: 'lucia@example.com' }]
  ] as [string, Partial<Contacto>][])('da el mismo resultado que schema() con el formulario %s', (_caso, valor) => {
    const conSchema = crear(contactoSchema, valor);
    const conFuncion = crear(contactoSchemaFn, valor);

    expect(conFuncion().valid()).toBe(conSchema().valid());
    expect(conFuncion.nombre().errors().map((e) => e.message)).toEqual(conSchema.nombre().errors().map((e) => e.message));
    expect(conFuncion.correo().errors().map((e) => e.message)).toEqual(conSchema.correo().errors().map((e) => e.message));
  });

  it('exige nombre y correo, y no valida la empresa', () => {
    const f = crear(contactoSchemaFn);

    expect(f.nombre().getError('required')?.message).toBe('Escribe tu nombre.');
    expect(f.correo().getError('required')?.message).toBe('Escribe tu correo.');
    expect(f.empresa().invalid()).toBe(false);
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
