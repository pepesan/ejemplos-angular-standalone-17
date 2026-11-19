import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ErrorApi, Usuario, UsuarioNuevo, UsuariosApiService } from '../../services/usuarios-api.service';
import { ConCambiosSinGuardar } from './guards/cambios-sin-guardar.guard';
import { RUTA_BASE } from './ruta-base';
import { SesionUsuariosService } from './sesion-usuarios.service';
import { UsuarioFormComponent } from './usuario-form.component';
import { UsuariosAvisosService } from './usuarios-avisos.service';

/** Pantalla «Nuevo usuario»: delgada, solo une el formulario compartido con la API y la navegación. */
@Component({
  selector: 'app-v2-usuario-nuevo',
  imports: [UsuarioFormComponent],
  styleUrl: './usuarios-navegacion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Nuevo usuario</h2>
    <app-usuario-form
      [valorInicial]="inicial"
      [enviar]="enviar"
      textoEnviar="Crear usuario"
      (guardado)="alGuardar($event)"
      (cancelar)="volver()" />
  `,
})
export class V2UsuarioNuevoComponent implements ConCambiosSinGuardar {
  private readonly api = inject(UsuariosApiService);
  private readonly router = inject(Router);
  private readonly sesion = inject(SesionUsuariosService);
  private readonly avisos = inject(UsuariosAvisosService);
  private readonly formulario = viewChild.required(UsuarioFormComponent);

  readonly inicial: UsuarioNuevo = { nombre: '', email: '', rol: 'alumno' };

  /** Función (no método) para pasarla como `input()` sin perder `this`. */
  readonly enviar = async (datos: UsuarioNuevo): Promise<Usuario> => {
    try {
      return await firstValueFrom(this.api.crear(datos));
    } catch (error) {
      if (error instanceof ErrorApi && error.estado === 401) await this.sesion.caducada(this.router.url);
      throw error;
    }
  };

  hayCambios(): boolean {
    return this.formulario().hayCambios();
  }

  async alGuardar(usuario: Usuario): Promise<void> {
    await this.router.navigate([RUTA_BASE]);
    // El aviso se muestra después de navegar: el layout lo limpia en la navegación SIGUIENTE.
    this.avisos.mostrar(`Usuario «${usuario.nombre}» creado.`);
  }

  volver(): void {
    void this.router.navigate([RUTA_BASE]);
  }
}
