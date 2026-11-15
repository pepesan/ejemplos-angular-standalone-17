import { TestBed } from '@angular/core/testing';
import { V2I18nComponent } from './v2-i18n.component';

describe('V2I18nComponent', () => {
  it('actualiza etiquetas y formatos al elegir otro locale', () => {
    TestBed.configureTestingModule({ imports: [V2I18nComponent] });
    const fixture = TestBed.createComponent(V2I18nComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Español (España)');
    expect(fixture.nativeElement.textContent).toContain('1234,50');

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#locale');
    select.value = 'en-GB';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('section').getAttribute('lang')).toBe('en-GB');
    expect(fixture.nativeElement.textContent).toContain('£1,234.50');
  });
});
