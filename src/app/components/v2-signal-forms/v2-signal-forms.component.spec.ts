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

    component.modelo.set({ nombre: 'Lucía', correo: 'lucia@example.com' });
    component.guardar(new Event('submit') as SubmitEvent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Lucía');
  });
});
