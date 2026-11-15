import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface DemoCredentials {
  username: string;
  password: string;
}

export interface DemoTokenResponse {
  tokenType: 'Bearer';
  accessToken: string;
  expiresInSeconds: number;
}

export interface DemoProfile {
  id: string;
  name: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenState = signal<string | null>(null);
  readonly accessToken = this.tokenState.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenState() !== null);

  constructor(private readonly http: HttpClient) {}

  login(credentials: DemoCredentials): Observable<DemoTokenResponse> {
    return this.http.post<DemoTokenResponse>('/api/auth/login', credentials).pipe(
      tap((response) => this.tokenState.set(response.accessToken)),
    );
  }

  loadProfile(): Observable<DemoProfile> {
    return this.http.get<DemoProfile>('/api/auth/profile');
  }

  logout(): void {
    // El JWT es de vida corta y se conserva solo en memoria en este ejemplo local.
    this.tokenState.set(null);
  }
}
