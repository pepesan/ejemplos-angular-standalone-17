import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService, DemoProfile } from '../../services/auth.service';

import {AvisoApiComponent} from "../aviso-api/aviso-api.component";
@Component({
  selector: 'app-v2-auth',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AvisoApiComponent
  ],
  templateUrl: './v2-auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2AuthComponent {
  readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);

  username = 'alumno';
  password = 'angular';
  readonly profile = signal<DemoProfile | null>(null);
  readonly expiresInSeconds = signal<number | null>(null);
  readonly loginError = signal<string | null>(null);

  login(): void {
    this.loginError.set(null);
    this.auth.login({ username: this.username, password: this.password }).pipe(
      switchMap((tokenResponse) => {
        this.expiresInSeconds.set(tokenResponse.expiresInSeconds);
        return this.auth.loadProfile();
      }),
    ).subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => this.loginError.set('No se pudo iniciar sesión. Revisa las credenciales del ejemplo.'),
    });
  }

  logout(): void {
    this.auth.logout();
    this.profile.set(null);
    this.expiresInSeconds.set(null);
    this.loginError.set(null);
  }

  triggerGlobalError(): void {
    // El interceptor global publica el error; este manejador local evita una suscripción sin tratar.
    this.http.get('/api/demo/error').subscribe({ error: () => undefined });
  }
}
