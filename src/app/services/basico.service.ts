import { Service } from '@angular/core';

/**
 * SERVICIO BÁSICO con `@Service()` (Angular 22.0 o posterior).
 *
 * ¿ES SINGLETON? SÍ. `@Service()` registra la clase en el inyector raíz, así que existe UNA sola instancia
 * para toda la aplicación y todos los componentes que la pidan reciben esa misma. Equivale a
 * `@Injectable({ providedIn: 'root' })` (ver `ContadorInjectableService`).
 *
 * LÍMITES: solo existe desde Angular 22.0; en versiones anteriores hay que usar `@Injectable()`.
 * Para que NO sea singleton habría que declararlo en `providers` de un componente o de una ruta.
 */
@Service()
export class BasicoService {

  public propiedad: string;

  constructor() {
    console.log('BasicoService cargado');
    this.propiedad = "Valor";
  }

  getData(): string{
    return "Dato básico";
  }
}
