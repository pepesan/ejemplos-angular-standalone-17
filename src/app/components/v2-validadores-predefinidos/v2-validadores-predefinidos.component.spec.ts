import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V2ValidadoresPredefinidosComponent } from './v2-validadores-predefinidos.component';

describe('V2ValidadoresPredefinidosComponent', () => {
  let fixture: ComponentFixture<V2ValidadoresPredefinidosComponent>;
  let component: V2ValidadoresPredefinidosComponent;
  const f = () => component.form.controls;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [V2ValidadoresPredefinidosComponent] }).compileComponents();
    fixture = TestBed.createComponent(V2ValidadoresPredefinidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('required: falla vacío y acepta texto', () => {
    expect(f().nombre.hasError('required')).toBe(true);
    f().nombre.setValue('Ana');
    expect(f().nombre.valid).toBe(true);
  });

  it('requiredTrue: solo acepta true', () => {
    expect(f().condiciones.hasError('required')).toBe(true);
    f().condiciones.setValue(true);
    expect(f().condiciones.valid).toBe(true);
  });

  it('min y max: devuelven su límite y el valor real', () => {
    f().edad.setValue(10);
    expect(f().edad.errors?.['min'].detalle).toEqual({ min: 18, actual: 10 });
    f().edad.setValue(70);
    expect(f().edad.errors?.['max'].detalle).toEqual({ max: 65, actual: 70 });
    f().edad.setValue(30);
    expect(f().edad.valid).toBe(true);
  });

  it('min y max no validan un campo vacío', () => {
    expect(f().edad.value).toBeNull();
    expect(f().edad.valid).toBe(true);
  });

  it('minLength y maxLength: devuelven longitud requerida y real', () => {
    f().usuario.setValue('ab');
    expect(f().usuario.errors?.['minlength'].detalle).toEqual({ requiredLength: 3, actualLength: 2 });
    f().usuario.setValue('a'.repeat(13));
    expect(f().usuario.errors?.['maxlength'].detalle).toEqual({ requiredLength: 12, actualLength: 13 });
  });

  it('email: valida el formato y acepta vacío', () => {
    expect(f().correo.valid).toBe(true);
    f().correo.setValue('no-es-correo');
    expect(f().correo.hasError('email')).toBe(true);
    f().correo.setValue('ana@example.com');
    expect(f().correo.valid).toBe(true);
  });

  it('pattern: devuelve el patrón y el valor recibido', () => {
    f().codigoPostal.setValue('123');
    // Con un RegExp, Angular guarda el patrón como texto con las barras: '/^\\d{5}$/'.
    expect(f().codigoPostal.errors?.['pattern'].detalle).toEqual({ requiredPattern: '/^\\d{5}$/', actualValue: '123' });
    f().codigoPostal.setValue('28001');
    expect(f().codigoPostal.valid).toBe(true);
  });

  it('nullValidator: el teléfono no exige nada hasta que se marca la casilla', () => {
    expect(f().telefono.valid).toBe(true);
  });

  it('compose: al exigir el teléfono se aplican varios validadores a la vez', () => {
    f().exigirTelefono.setValue(true);
    component.alternarTelefono();
    expect(f().telefono.hasError('required')).toBe(true);

    f().telefono.setValue('12ab');
    expect(f().telefono.hasError('pattern')).toBe(true);
    expect(f().telefono.hasError('minlength')).toBe(true);

    f().telefono.setValue('600123456');
    expect(f().telefono.valid).toBe(true);

    f().exigirTelefono.setValue(false);
    component.alternarTelefono();
    f().telefono.setValue('');
    expect(f().telefono.valid).toBe(true);
  });

  it('la plantilla muestra el objeto de error real y el mensaje del validador', () => {
    f().usuario.setValue('ab');
    fixture.detectChanges();
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('minlength: {"requiredLength":3,"actualLength":2}');
    expect(texto).toContain('Mínimo 3 caracteres.');
  });

  it('el catálogo recorre todos los validadores predefinidos', () => {
    const usados = [...component.catalogo.flatMap((e) => e.validadores), 'Validators.compose', 'Validators.nullValidator'].join(' ');
    for (const nombre of ['required', 'requiredTrue', 'min(', 'max(', 'minLength', 'maxLength', 'email', 'pattern', 'compose', 'nullValidator']) {
      expect(usados).toContain(nombre);
    }
  });
});
