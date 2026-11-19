import { Router } from '@angular/router';
import { Service, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService, DemoProfile } from '../../services/auth.service';
import { RUTA_BASE } from './ruta-base';
import { UsuariosAvisosService } from './usuarios-avisos.service';

/**
 * Sesión de la feature: el perfil del usuario (con su rol) sobre el JWT que guarda `AuthService`.
 * Lo comparten las guardas, el layout y las pantallas, así que es un servicio y no estado de un componente.
 */
@Service()
export class SesionUsuariosService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(UsuariosAvisosService);

  readonly perfil = signal<DemoProfile | null>(null);
  readonly esAdmin = computed(() => this.perfil()?.role === 'admin');

  /** Inicia sesión y carga el perfil. Lanza el error HTTP tal cual: cada pantalla decide qué mostrar. */
  async iniciarSesion(usuario: string, clave: string): Promise<void> {
    await firstValueFrom(this.auth.login({ username: usuario, password: clave }));
    this.perfil.set(await firstValueFrom(this.auth.loadProfile()));
  }

  /**
   * ¿Hay sesión utilizable? Si ya hay perfil, sí. Si hay token pero aún no perfil (otro ejemplo inició sesión
   * antes), lo carga. Es asíncrono a propósito: una guarda puede devolver una promesa.
   */
  async asegurarPerfil(): Promise<boolean> {
    if (this.perfil()) return true;
    if (!this.auth.isAuthenticated()) return false;
    try {
      this.perfil.set(await firstValueFrom(this.auth.loadProfile()));
      return true;
    } catch {
      this.auth.logout();
      return false;
    }
  }

  cerrar(): void {
    this.auth.logout();
    this.perfil.set(null);
  }

  /** El JWT ha caducado (401): se cierra la sesión y se vuelve al login recordando dónde estaba el usuario. */
  async caducada(urlActual: string): Promise<void> {
    this.cerrar();
    await this.router.navigate([RUTA_BASE, 'login'], { queryParams: { returnUrl: urlActual } });
    this.avisos.mostrar('Tu sesión ha caducado. Inicia sesión de nuevo.');
  }
}
