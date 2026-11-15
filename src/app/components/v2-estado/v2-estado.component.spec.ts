import { TestBed } from '@angular/core/testing';
import { DeferBlockState } from '@angular/core/testing';
import { V2EstadoComponent } from './v2-estado.component';

describe('V2EstadoComponent', () => {
  it('deriva la lista pendiente y permite volver a todas las tareas', () => {
    TestBed.configureTestingModule({ imports: [V2EstadoComponent] });
    const fixture = TestBed.createComponent(V2EstadoComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(2);
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Leer sobre Signals');
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(2);
  });

  it('carga el panel secundario después de la interacción', async () => {
    TestBed.configureTestingModule({ imports: [V2EstadoComponent] });
    const fixture = TestBed.createComponent(V2EstadoComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-resumen-rendimiento')).toBeNull();
    const [bloque] = await fixture.getDeferBlocks();
    await bloque.render(DeferBlockState.Complete);
    expect(fixture.nativeElement.textContent).toContain('Este panel se descarga cuando lo solicitas');
  });
});
