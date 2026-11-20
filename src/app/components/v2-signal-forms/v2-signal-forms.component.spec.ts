import { TestBed } from '@angular/core/testing';
import { V2SignalFormsComponent } from './v2-signal-forms.component';

describe('V2SignalFormsComponent', () => {
  it('valida los campos y confirma un contacto válido', () => {
    TestBed.configureTestingModule({ imports: [V2SignalFormsComponent] });
    const fixture = TestBed.createComponent(V2SignalFormsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.guardar(new Event('submit') as SubmitEvent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBe(2);
    expect(component.formulario().valid()).toBe(false);

    component.modelo.set({ nombre: 'Lucía', correo: 'lucia@example.com', empresa: '' });
    component.guardar(new Event('submit') as SubmitEvent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Lucía');
  });

  describe('errores del correo por tipo', () => {
    const crear = () => {
      TestBed.configureTestingModule({ imports: [V2SignalFormsComponent] });
      const fixture = TestBed.createComponent(V2SignalFormsComponent);
      fixture.detectChanges();
      return { fixture, component: fixture.componentInstance };
    };
    const enviar = (fixture: ReturnType<typeof crear>['fixture']) => {
      fixture.componentInstance.guardar(new Event('submit') as SubmitEvent);
      fixture.detectChanges();
    };
    const texto = (fixture: ReturnType<typeof crear>['fixture'], selector: string): string | undefined =>
      fixture.nativeElement.querySelector(selector)?.textContent?.trim();

    it('con el correo vacío muestra solo el error «required»', () => {
      const { fixture } = crear();

      enviar(fixture);

      expect(texto(fixture, '#signal-correo-error .error-required')).toBe('Escribe tu correo.');
      expect(fixture.nativeElement.querySelector('#signal-correo-error .error-email')).toBeNull();
    });

    it('con un correo mal formado muestra solo el error «email»', () => {
      const { fixture, component } = crear();
      component.modelo.set({ nombre: 'Lucía', correo: 'no-es-un-correo', empresa: '' });

      enviar(fixture);

      expect(texto(fixture, '#signal-correo-error .error-email')).toBe('Introduce un correo válido.');
      expect(fixture.nativeElement.querySelector('#signal-correo-error .error-required')).toBeNull();
    });

    it('con un correo válido no muestra el bloque de errores', () => {
      const { fixture, component } = crear();
      component.modelo.set({ nombre: 'Lucía', correo: 'lucia@example.com', empresa: '' });

      enviar(fixture);

      expect(fixture.nativeElement.querySelector('#signal-correo-error')).toBeNull();
    });
  });

  describe('campo opcional «empresa» (sin validar)', () => {
    const crear = () => {
      TestBed.configureTestingModule({ imports: [V2SignalFormsComponent] });
      const fixture = TestBed.createComponent(V2SignalFormsComponent);
      fixture.detectChanges();
      return { fixture, component: fixture.componentInstance };
    };

    it('se muestra con su etiqueta y se enlaza al modelo', () => {
      const { fixture, component } = crear();
      const input = fixture.nativeElement.querySelector('#signal-empresa') as HTMLInputElement;

      expect(fixture.nativeElement.querySelector('label[for="signal-empresa"]')?.textContent).toContain('opcional');

      input.value = 'Cursos de Desarrollo';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.modelo().empresa).toBe('Cursos de Desarrollo');
    });

    it('vacío no impide que el formulario sea válido ni muestra errores', () => {
      const { fixture, component } = crear();
      component.modelo.set({ nombre: 'Lucía', correo: 'lucia@example.com', empresa: '' });
      component.guardar(new Event('submit') as SubmitEvent);
      fixture.detectChanges();

      expect(component.formulario.empresa().invalid()).toBe(false);
      expect(component.formulario().valid()).toBe(true);
      expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Lucía');
      expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    });

    it('con cualquier valor tampoco se valida', () => {
      const { component } = crear();
      component.modelo.set({ nombre: 'Lucía', correo: 'lucia@example.com', empresa: '   ??? 123' });

      expect(component.formulario.empresa().invalid()).toBe(false);
      expect(component.formulario().valid()).toBe(true);
    });
  });
});
