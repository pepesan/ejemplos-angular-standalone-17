import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    TestBed.flushEffects();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('defaults to system theme', () => {
    expect(['light', 'dark']).toContain(service.resolvedTheme());
  });

  it('toggles between light and dark', () => {
    service.setTheme('light');
    TestBed.flushEffects();
    expect(service.resolvedTheme()).toBe('light');

    service.toggle();
    TestBed.flushEffects();
    expect(service.resolvedTheme()).toBe('dark');

    service.toggle();
    TestBed.flushEffects();
    expect(service.resolvedTheme()).toBe('light');
  });

  it('persists selected theme in localStorage', () => {
    service.setTheme('dark');
    TestBed.flushEffects();
    expect(localStorage.getItem('angular-examples-theme')).toBe('dark');
  });

  it('reads theme from localStorage when available', () => {
    localStorage.setItem('angular-examples-theme', 'light');
    service.setTheme('light');
    TestBed.flushEffects();
    expect(service.theme()).toBe('light');
    expect(service.resolvedTheme()).toBe('light');
  });
});
