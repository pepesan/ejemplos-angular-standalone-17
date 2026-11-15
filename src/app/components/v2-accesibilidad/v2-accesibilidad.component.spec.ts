import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { V2AccesibilidadComponent } from './v2-accesibilidad.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { V2AccesibilidadHarness } from './v2-accesibilidad.harness';

describe('V2AccesibilidadComponent', () => {
  it('asocia la etiqueta al campo y anuncia el error al enviar vacío', async () => {
    await TestBed.configureTestingModule({ imports: [FormsModule, V2AccesibilidadComponent] }).compileComponents();
    const fixture = TestBed.createComponent(V2AccesibilidadComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('label[for="nombre"]')).toBeTruthy();
    fixture.nativeElement.querySelector('button[type="submit"]').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('obligatorio');
  });

  it('prueba guardar el formulario a través del contrato del harness', async () => {
    await TestBed.configureTestingModule({ imports: [V2AccesibilidadComponent] }).compileComponents();
    const fixture = TestBed.createComponent(V2AccesibilidadComponent);
    fixture.detectChanges();
    const form = await TestbedHarnessEnvironment.harnessForFixture(fixture, V2AccesibilidadHarness);

    await form.save();
    expect(await form.getValidationMessage()).toContain('obligatorio');
    await form.enterName('Ada');
    await form.save();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Formulario válido');
  });
});
