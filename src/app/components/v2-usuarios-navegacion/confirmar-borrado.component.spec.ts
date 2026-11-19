import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Usuario } from '../../services/usuarios-api.service';
import { ConfirmarBorradoComponent } from './confirmar-borrado.component';

const ana: Usuario = { id: 1, nombre: 'Ana', email: 'ana@example.com', rol: 'profesor' };

describe('ConfirmarBorradoComponent', () => {
  let fixture: ComponentFixture<ConfirmarBorradoComponent>;
  let confirmados: number;
  let cancelados: number;
  const dialogo = () => (fixture.nativeElement as HTMLElement).querySelector('dialog')!;
  const botones = () => Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'));

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ConfirmarBorradoComponent] });
    fixture = TestBed.createComponent(ConfirmarBorradoComponent);
    confirmados = 0;
    cancelados = 0;
    fixture.componentInstance.confirmar.subscribe(() => confirmados++);
    fixture.componentInstance.cancelar.subscribe(() => cancelados++);
    fixture.detectChanges();
  });

  it('está cerrado mientras no haya usuario', () => {
    expect(dialogo().hasAttribute('open')).toBe(false);
  });

  it('se abre cuando recibe un usuario y nombra a quién se va a borrar', () => {
    fixture.componentRef.setInput('usuario', ana);
    fixture.detectChanges();
    expect(dialogo().hasAttribute('open')).toBe(true);
    expect(dialogo().textContent).toContain('Ana');
    expect(dialogo().textContent).toContain('ana@example.com');
    expect(dialogo().getAttribute('aria-labelledby')).toBe('borrar-titulo');
  });

  it('se cierra cuando el usuario vuelve a ser null', () => {
    fixture.componentRef.setInput('usuario', ana);
    fixture.detectChanges();
    fixture.componentRef.setInput('usuario', null);
    fixture.detectChanges();
    expect(dialogo().hasAttribute('open')).toBe(false);
  });

  it('«Eliminar» emite confirmar y «Cancelar» emite cancelar', () => {
    fixture.componentRef.setInput('usuario', ana);
    fixture.detectChanges();
    botones().find((b) => b.textContent?.includes('Eliminar'))!.click();
    botones().find((b) => b.textContent?.includes('Cancelar'))!.click();
    expect(confirmados).toBe(1);
    expect(cancelados).toBe(1);
  });

  it('mientras elimina deshabilita los dos botones para no repetir la acción', () => {
    fixture.componentRef.setInput('usuario', ana);
    fixture.componentRef.setInput('eliminando', true);
    fixture.detectChanges();
    expect(botones().every((b) => b.disabled)).toBe(true);
    expect(dialogo().textContent).toContain('Eliminando');
  });

  it('muestra el error dentro del modal, que sigue abierto', () => {
    fixture.componentRef.setInput('usuario', ana);
    fixture.componentRef.setInput('error', 'El servidor ha fallado.');
    fixture.detectChanges();
    expect(dialogo().hasAttribute('open')).toBe(true);
    expect(dialogo().querySelector('[role="alert"]')?.textContent).toContain('El servidor ha fallado.');
  });
});
