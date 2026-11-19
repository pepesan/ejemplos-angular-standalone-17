import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorApi, Usuario, UsuarioNuevo } from '../../services/usuarios-api.service';
import { UsuarioFormComponent } from './usuario-form.component';

const VACIO: UsuarioNuevo = { nombre: '', email: '', rol: 'alumno' };
const guardado: Usuario = { id: 3, nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' };
const ciclo = () => new Promise<void>((resolver) => setTimeout(resolver, 0));

describe('UsuarioFormComponent', () => {
  let fixture: ComponentFixture<UsuarioFormComponent>;
  let component: UsuarioFormComponent;
  let enviar: ReturnType<typeof vi.fn>;
  let guardados: Usuario[];
  const el = () => fixture.nativeElement as HTMLElement;

  function crear(valorInicial: UsuarioNuevo = VACIO, resultado: () => Promise<Usuario> = () => Promise.resolve(guardado)) {
    enviar = vi.fn(resultado);
    guardados = [];
    TestBed.configureTestingModule({ imports: [UsuarioFormComponent] });
    fixture = TestBed.createComponent(UsuarioFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('valorInicial', valorInicial);
    fixture.componentRef.setInput('enviar', enviar);
    component.guardado.subscribe((u) => guardados.push(u));
    fixture.detectChanges();
  }

  function escribir(selector: string, valor: string) {
    const campo = el().querySelector<HTMLInputElement>(selector)!;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  async function enviarFormulario() {
    el().querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await ciclo();
    fixture.detectChanges();
  }

  it('precarga el valor inicial', () => {
    crear({ nombre: 'Ana', email: 'ana@example.com', rol: 'profesor' });
    expect(el().querySelector<HTMLInputElement>('#u-nombre')!.value).toBe('Ana');
    expect(el().querySelector<HTMLSelectElement>('#u-rol')!.value).toBe('profesor');
  });

  it('no envía si es inválido y muestra el aviso junto a cada campo', async () => {
    crear();
    await enviarFormulario();
    expect(enviar).not.toHaveBeenCalled();
    expect(el().querySelector('#e-nombre')?.textContent).toContain('El nombre es obligatorio.');
    expect(el().querySelector('#e-email')?.textContent).toContain('El email es obligatorio.');
    expect(el().querySelector('#u-nombre')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('valida longitud del nombre y formato del email', async () => {
    crear();
    escribir('#u-nombre', 'E');
    escribir('#u-email', 'no-es-email');
    await enviarFormulario();
    expect(el().querySelector('#e-nombre')?.textContent).toContain('al menos 2 caracteres');
    expect(el().querySelector('#e-email')?.textContent).toContain('email válido');
  });

  it('con datos válidos llama a enviar y emite guardado', async () => {
    crear();
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'eva@example.com');
    await enviarFormulario();
    expect(enviar).toHaveBeenCalledExactlyOnceWith({ nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' });
    expect(guardados).toEqual([guardado]);
  });

  it('hayCambios es false al abrir, true al escribir y false otra vez tras guardar (la guarda no pregunta al salir)', async () => {
    crear();
    expect(component.hayCambios()).toBe(false);
    escribir('#u-nombre', 'Eva');
    expect(component.hayCambios()).toBe(true);
    escribir('#u-email', 'eva@example.com');
    await enviarFormulario();
    expect(guardados.length).toBe(1);
    expect(component.hayCambios()).toBe(false);
  });

  it('pone los errores 400/409 del servidor junto a su campo', async () => {
    crear(VACIO, () => Promise.reject(new ErrorApi('Ya existe', 409, { email: 'Ese email ya está en uso.' })));
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'ana@example.com');
    await enviarFormulario();
    expect(el().querySelector('#e-email')?.textContent).toContain('Ese email ya está en uso.');
    expect(el().querySelector('#u-email')?.getAttribute('aria-invalid')).toBe('true');
    expect(guardados).toEqual([]);
    expect(component.hayCambios()).toBe(true);
  });

  it('con el backend apagado muestra el aviso y no un error genérico', async () => {
    crear(VACIO, () => Promise.reject(new ErrorApi('No hay conexión', 502)));
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'eva@example.com');
    await enviarFormulario();
    expect(el().textContent).toContain('No hay conexión con el backend');
    expect(el().querySelector('.error[role="alert"]')).toBeNull();
  });

  it('otro error muestra su mensaje', async () => {
    crear(VACIO, () => Promise.reject(new ErrorApi('El servidor ha fallado.', 500)));
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'eva@example.com');
    await enviarFormulario();
    expect(el().querySelector('.error[role="alert"]')?.textContent).toContain('El servidor ha fallado.');
  });

  it('no envía dos veces: el botón se deshabilita mientras dura el envío', async () => {
    let terminar!: (u: Usuario) => void;
    crear(VACIO, () => new Promise<Usuario>((resolver) => (terminar = resolver)));
    escribir('#u-nombre', 'Eva');
    escribir('#u-email', 'eva@example.com');
    await enviarFormulario();
    const boton = el().querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(boton.disabled).toBe(true);
    expect(boton.textContent).toContain('Guardando');
    boton.click();
    await ciclo();
    expect(enviar).toHaveBeenCalledTimes(1);
    terminar(guardado);
    await ciclo();
  });

  it('Cancelar emite cancelar', () => {
    crear();
    let cancelado = 0;
    component.cancelar.subscribe(() => cancelado++);
    el().querySelector<HTMLButtonElement>('button[type="button"]')!.click();
    expect(cancelado).toBe(1);
  });

  it('si cambia el valor inicial el formulario se reinicia con él', () => {
    crear();
    escribir('#u-nombre', 'Eva');
    fixture.componentRef.setInput('valorInicial', { nombre: 'Otra', email: 'otra@example.com', rol: 'admin' });
    fixture.detectChanges();
    expect(el().querySelector<HTMLInputElement>('#u-nombre')!.value).toBe('Otra');
  });
});
