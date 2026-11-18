import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { EnvioPostService } from '../../services/envio-post.service';
import { PostDataResponse } from '../../classes/post-data-response';

@Component({
  selector: 'app-envio-post',
  imports: [JsonPipe],
  templateUrl: './envio-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvioPostComponent {
  private readonly servicio = inject(EnvioPostService);

  // Signals: la aplicación es zoneless, así que lo que se asigna dentro de subscribe() debe
  // guardarse en una signal para que Angular repinte la plantilla.
  readonly respuesta = signal<PostDataResponse | null>(null);
  readonly error = signal<string | null>(null);

  enviar(): void {
    this.error.set(null);
    this.servicio.enviar({ title: 'Hola', body: 'Mi primer POST desde Angular', userId: 1 }).subscribe({
      next: (datos) => this.respuesta.set(datos),
      error: () => this.error.set('No se pudo enviar el POST.'),
    });
  }
}
