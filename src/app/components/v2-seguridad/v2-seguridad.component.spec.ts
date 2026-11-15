import { TestBed } from '@angular/core/testing';
import { V2SeguridadComponent } from './v2-seguridad.component';

describe('V2SeguridadComponent', () => {
  it('elimina manejadores de eventos de la vista HTML y conserva la interpolación literal', () => {
    TestBed.configureTestingModule({ imports: [V2SeguridadComponent] });
    const fixture = TestBed.createComponent(V2SeguridadComponent);
    fixture.detectChanges();
    const preview: HTMLElement = fixture.nativeElement.querySelector('.border');
    expect(preview.querySelector('img')?.hasAttribute('onerror')).toBe(false);
    expect(fixture.nativeElement.querySelector('pre')?.textContent).toContain('onerror="alert(1)"');
  });
});
