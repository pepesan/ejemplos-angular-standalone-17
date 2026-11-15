import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  readonly lastError = signal<string | null>(null);

  report(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = typeof error.error?.message === 'string' ? error.error.message : error.message;
      this.lastError.set(`Error HTTP ${error.status}: ${backendMessage}`);
      return;
    }
    this.lastError.set('Se produjo un error inesperado.');
  }

  clear(): void {
    this.lastError.set(null);
  }
}
