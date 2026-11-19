import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V2FormularioAltaSignalComponent } from './v2-formulario-alta-signal.component';

const VALIDO = {
  username: 'anita',
  password: 'abcd',
  repeatPassword: 'abcd',
  email: 'ana@example.com',
  gender: 'female',
  orientation: 'hetero',
  relationType: '3',
  conditions: true,
};

describe('V2FormularioAltaSignalComponent', () => {
  let fixture: ComponentFixture<V2FormularioAltaSignalComponent>;
  let component: V2FormularioAltaSignalComponent;
  const el = () => fixture.nativeElement as HTMLElement;
  const campo = (id: string) => el().querySelector(`#${id}`) as HTMLInputElement;
  const errores = (campoId: string) => el().querySelector(`#${campoId}-error`)?.textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [V2FormularioAltaSignalComponent] }).compileComponents();
    fixture = TestBed.createComponent(V2FormularioAltaSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('empieza con los valores por defecto del ejercicio', () => {
    expect(component.modelo().gender).toBe('male');
    expect(component.modelo().relationType).toBe('3');
    expect(component.modelo().conditions).toBe(false);
    expect(component.formulario().invalid()).toBe(true);
  });

  it('no muestra errores hasta que el campo se toca', () => {
    expect(errores('username').trim()).toBe('');
    campo('username').dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(errores('username')).toContain('Username obligatorio.');
  });

  it('valida la longitud mínima de usuario y contraseñas', () => {
    component.modelo.update((m) => ({ ...m, username: 'ab', password: 'abc', repeatPassword: 'abc' }));
    component.formulario.username().markAsTouched();
    component.formulario.password().markAsTouched();
    fixture.detectChanges();
    expect(errores('username')).toContain('mínimo 4 caracteres');
    expect(errores('password')).toContain('Mínimo 4 caracteres.');
  });

  it('valida el formato del email', () => {
    component.modelo.update((m) => ({ ...m, email: 'no-es-email' }));
    component.formulario.email().markAsTouched();
    fixture.detectChanges();
    expect(errores('email')).toContain('Formato de email inválido.');
  });

  it('avisa si las contraseñas no coinciden y se revalida al cambiar la primera', () => {
    component.modelo.update((m) => ({ ...m, password: 'abcd', repeatPassword: 'abce' }));
    component.formulario.repeatPassword().markAsTouched();
    fixture.detectChanges();
    expect(errores('repeat-password')).toContain('Las contraseñas no coinciden.');

    component.modelo.update((m) => ({ ...m, password: 'abce' }));
    fixture.detectChanges();
    expect(errores('repeat-password')).not.toContain('Las contraseñas no coinciden.');
  });

  it('las condiciones desmarcadas cuentan como error (como requiredTrue)', () => {
    component.formulario.conditions().markAsTouched();
    fixture.detectChanges();
    expect(errores('conditions')).toContain('Debes aceptar las condiciones.');
    component.modelo.update((m) => ({ ...m, conditions: true }));
    fixture.detectChanges();
    expect(errores('conditions').trim()).toBe('');
  });

  it('mantiene deshabilitado el botón mientras el formulario sea inválido', () => {
    const boton = el().querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(boton.disabled).toBe(true);
    component.modelo.set({ ...VALIDO });
    fixture.detectChanges();
    expect(component.formulario().valid()).toBe(true);
    expect(boton.disabled).toBe(false);
  });

  it('el select de tipo de relación refleja el modelo (como texto) y lo actualiza al elegir', () => {
    const select = campo('relation-type') as unknown as HTMLSelectElement;
    expect(select.value).toBe('3');
    select.value = '4';
    select.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(component.modelo().relationType).toBe('4');
  });

  it('cada género muestra su icono decorativo, como en el ejercicio reactivo', () => {
    const iconos = Array.from(el().querySelectorAll('fieldset i.fas'));
    expect(iconos.map((i) => i.className.split(' ').find((c) => c.startsWith('fa-') && c !== 'fas'))).toEqual([
      'fa-male',
      'fa-female',
      'fa-genderless',
      'fa-user',
    ]);
    expect(iconos.every((i) => i.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('los radios de género reflejan el modelo y lo actualizan al elegir', () => {
    expect((campo('gender-male') as HTMLInputElement).checked).toBe(true);
    campo('gender-other').click();
    fixture.detectChanges();
    expect(component.modelo().gender).toBe('other');
  });

  it('al enviar un formulario válido confirma y reinicia valor y estado', async () => {
    const consola = vi.spyOn(console, 'log').mockImplementation(() => {});
    component.modelo.set({ ...VALIDO });
    fixture.detectChanges();
    await component.enviar(new Event('submit') as SubmitEvent);
    fixture.detectChanges();

    expect(consola).toHaveBeenCalledWith(expect.objectContaining({ username: 'anita' }));
    expect(el().textContent).toContain('Alta recibida para anita.');
    expect(component.modelo().username).toBe('');
    expect(component.modelo().conditions).toBe(false);
    expect(component.formulario.username().touched()).toBe(false);
    expect(errores('username').trim()).toBe('');
    consola.mockRestore();
  });

  it('no envía ni confirma si el formulario es inválido, y marca los campos como tocados', async () => {
    await component.enviar(new Event('submit') as SubmitEvent);
    fixture.detectChanges();
    expect(component.confirmacion()).toBe('');
    expect(component.formulario.username().touched()).toBe(true);
    expect(errores('username')).toContain('Username obligatorio.');
  });
});
