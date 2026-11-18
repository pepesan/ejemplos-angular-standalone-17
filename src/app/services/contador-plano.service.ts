import { signal } from '@angular/core';

/**
 * TIPO DE SERVICIO: servicio SIN decorador (ni `@Service()` ni `@Injectable()`), registrado en
 * `providers` de un componente.
 * Es una clase TypeScript normal, sin ningún decorador.
 *
 * ¿ES SINGLETON? NO.
 *  - Un servicio con `@Service()` (Angular 22+, lo que genera `ng g service`) o con
 *    `@Injectable({ providedIn: 'root' })` es singleton: una única instancia compartida por toda la
 *    aplicación, porque se registra en el inyector raíz.
 *  - Este NO se registra en la raíz; solo existe donde alguien lo declara en `providers`. Aquí lo declara
 *    `V2ServicioSinInjectableComponent`, así que se crea UNA instancia POR CADA instancia de ese
 *    componente (dos componentes abiertos a la vez = dos contadores independientes) y se destruye
 *    junto con el componente. Ningún otro componente puede inyectarlo, salvo sus hijos en la plantilla.
 *
 * ¿POR QUÉ FUNCIONA SIN DECORADOR? Angular solo necesita saber CÓMO crear la clase, y eso se
 * le indica en `providers`. Los decoradores sirven para registrar el servicio solos (`@Service()`,
 * `providedIn`) y, en el caso de `@Injectable()`, para que Angular pueda leer los parámetros del constructor.
 *
 * LÍMITE: sin decorador, Angular no puede inyectar dependencias por constructor.
 * Este servicio no recibe ninguna; si las necesitara por constructor, hay que usar `@Injectable()`
 * (`@Service()` solo admite `inject()`, según la guía oficial de servicios de angular.dev).
 *
 * DISPONIBILIDAD: `@Service()` se introdujo en Angular 22.0: no existe en `@angular/core` 21.2 y sí en 22.0.0,
 * donde figura como API pública (`@publicApi`), según los tipos publicados. El generador `ng g service`
 * lo usa por defecto desde entonces. En versiones anteriores, `@Injectable()`. `inject()` es API pública
 * desde Angular 14.
 *
 * EN LA PRÁCTICA, en Angular 22:
 *  - Servicio compartido por toda la app (singleton): `@Service()`. Es lo que genera `ng g service`
 *    (con `ng g service --injectable` se genera `@Injectable({ providedIn: 'root' })`, el estilo anterior,
 *    que sigue siendo válido y es el que usan `BasicoService` y otros servicios de este proyecto).
 *  - Instancia propia por componente: `@Service({ autoProvided: false })` más `providers`, o sin
 *    decorador como aquí. Este ejemplo es didáctico.
 */
export class ContadorPlanoService {
  readonly valor = signal(0);

  incrementar(): void {
    this.valor.update((v) => v + 1);
  }

  reiniciar(): void {
    this.valor.set(0);
  }
}
