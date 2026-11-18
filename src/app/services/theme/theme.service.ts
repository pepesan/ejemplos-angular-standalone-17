import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal, untracked } from '@angular/core';

// DISPONIBILIDAD: `untracked()` es estable desde Angular 17 (developer preview en la v16), según los tipos de `@angular/core`.
type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'angular-examples-theme';

function prefersDarkScheme(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function onPrefersSchemeChange(callback: () => void): (() => void) | undefined {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return undefined;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => callback();
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>(this.readStoredTheme());
  readonly resolvedTheme = signal<'light' | 'dark'>(this.resolveEffectiveTheme(this.readStoredTheme()));

  constructor() {
    effect(() => {
      const current = this.theme();
      const effective = this.resolveEffectiveTheme(current);
      this.resolvedTheme.set(effective);
      untracked(() => this.applyTheme(effective, current));
    });

    onPrefersSchemeChange(() => {
      if (this.theme() === 'system') {
        this.resolvedTheme.set(this.resolveEffectiveTheme('system'));
      }
    });
  }

  setTheme(next: Theme): void {
    this.theme.set(next);
  }

  toggle(): void {
    const next = this.resolvedTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  private applyTheme(effective: 'light' | 'dark', selected: Theme): void {
    const html = this.document.documentElement;
    html.setAttribute('data-bs-theme', effective);
    html.setAttribute('data-theme-selected', selected);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, selected);
      } catch {
        // ignore storage errors
      }
    }
  }

  private resolveEffectiveTheme(selected: Theme): 'light' | 'dark' {
    if (selected !== 'system') {
      return selected;
    }

    return prefersDarkScheme() ? 'dark' : 'light';
  }

  private readStoredTheme(): Theme {
    if (typeof window === 'undefined') {
      return 'system';
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // ignore storage errors
    }

    return 'system';
  }
}
