# Angular · Aprende haciendo

Proyecto didáctico con ejemplos pequeños de Angular 22 (standalone, Signals, control flow, formularios reactivos, routing, HTTP, Storybook y pruebas). Cada ejemplo tiene una ruta propia, pruebas y una breve explicación.

El temario completo está en [TEMARIO.md](TEMARIO.md). TypeScript se imparte en el proyecto complementario.

## Cómo está organizada la navegación

La cabecera tiene **Inicio**, **Temario** y **Acerca de**. El menú **Temario** agrupa los ejemplos por unidad:

1. **Fundamentos de TypeScript y Angular**: arquitectura Angular y CLI.
2. **Componentes, plantillas y Data Binding**: lista de tareas, props, directivas, control flow, seguridad en plantillas, condicionales, ciclo de vida, pipes, eventos e internacionalización.
3. **Comunicación entre componentes y Signals**: `@Input`/`@Output`, `input()`/`output()`, `signal`/`computed`, `model`, queries, `effect` y estado compartido.
4. **Servicios y comunicación HTTP**: servicios, `HttpClient`, interceptores y JWT.
5. **Formularios reactivos**: formularios de plantilla, reactivos tipados, Signal Forms y accesibilidad.
6. **Routing, Guards y Lazy Loading**: navegación, rutas anidadas, lazy loading y guards funcionales.

Dentro de cada unidad, los ejemplos llevan dos etiquetas:

- **V1 · …**: enfoque clásico o legado, que se conserva para comparar con la alternativa moderna.
- **V2 · …**: APIs modernas recomendadas para código nuevo.

El menú cambia según el ancho de pantalla: en escritorio, el desplegable **Temario** muestra las unidades a la izquierda y sus ejemplos a la derecha; en móvil, el botón de menú abre un panel con las unidades plegables.

### Estructura del código

- `src/app/navigation/temario-menu.ts`: datos del temario (unidades y ejemplos) y sus tipos. Para añadir o reordenar un ejemplo, se edita este fichero.
- `src/app/navigation/site-header/`: cabecera completa (marca, navegación, cambio de tema y botón de menú móvil).
- `src/app/navigation/temario-dropdown/`: desplegable del temario de escritorio.
- `src/app/navigation/temario-mobile-menu/`: acordeón del temario en el menú móvil.

## Servidor de desarrollo

Para la aplicación, ejecuta `npm start` y abre `http://localhost:4200/`. El backend didáctico se arranca en otra terminal con `npm run backend`; el proxy de desarrollo reenvía `/api/*` a ese backend. Sus endpoints están descritos en [backend/README.md](backend/README.md).

Las credenciales `alumno` / `angular` y la clave JWT predeterminada son solo para desarrollo local.

## Ejemplos V2 destacados

- `/todos`: lista de tareas con Signals (unidad 2).
- `/control-flow` y `/v2/seguridad`: control flow integrado y comparación entre interpolación literal y sanitización HTML (no usar `bypassSecurityTrustHtml` para contenido no confiable).
- `/v2/i18n`: textos y formatos de fecha y moneda para dos locales, con actualización reactiva.
- `/v2/formulario-tipado`: formulario reactivo no anulable y tipado, validación, `OnPush`, confirmación con Signals y mensajes de error accesibles. La ruta carga el componente standalone de forma diferida.
- `/v2/consumo-api`: `HttpClient` contra `/api/resultados`, estados de carga, vacío y error, e integración RxJS-Signals con `toSignal`.
- `/v2/comunicacion`: compara `@Input`/`@Output` con `input()`/`output()`, `ViewChild`, `ViewChildren` y proyección con `ng-content`.
- `/v2/autenticacion`: login didáctico, emisión de JWT en el backend, interceptor Bearer, endpoint protegido e informe global de errores HTTP.
- `/v2/rutas`: feature standalone con carga diferida, parámetros resueltos desde el backend, `CanActivate`, `CanMatch`, `CanDeactivate` y pantalla de ruta inexistente.
- `/v2/estado`: Signals para el estado local, `computed` para filtrar, `OnPush`, `track` por identidad estable y un bloque `@defer`; no usa `effect` para derivar valores.
- `/v2/accesibilidad`: etiqueta, ayuda, validación asociada y anuncio accesible del error.
- `/v2/signal-forms`: Signal Forms, con esquema de validación y modelo basado en Signals.
- `/v2/busqueda-reactiva`: `toObservable`, debounce y `switchMap` para cancelar peticiones obsoletas.

## Storybook

Cada componente de `src/app` tiene una story (82 en total), agrupada en el menú lateral por carpeta: `Componentes/<carpeta>/<Clase>`. La página **Guía/Bienvenida** resume las unidades del temario y los comandos del proyecto.

- `npm run storybook`: servidor de desarrollo en `http://localhost:6006`.
- `npm run build-storybook`: genera el sitio estático en `storybook-static/`.
- `npm run test:stories`: ejecuta las stories con el addon de Vitest.

Las stories comparten providers globales (router y `HttpClient`) definidos en `.storybook/preview.ts`. La mayoría muestra solo el estado inicial; las de formularios incluyen además un caso de validación, y las de la navegación muestran variantes como el menú móvil abierto o una unidad distinta.

## Scaffolding y build

- `ng generate component nombre`: genera un componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.
- `ng build`: compila la aplicación en `dist/`.

## Pruebas

Ejecuta todas las suites con `npm run test:all`. Cada una se puede lanzar por separado:

| Suite | Comando | Qué cubre |
| --- | --- | --- |
| Unitarias Angular | `npm test` o `npm run test:unit` | Specs `.spec.ts` con el builder de tests de Angular |
| Unitarias en watch | `npm run test:unit:watch` | Mismas pruebas, reejecutadas al guardar |
| Cobertura | `npm run test:unit:coverage` | Informe V8 en `coverage/proyecto/index.html` |
| Stories | `npm run test:stories` | Renderizado de cada story con Vitest y Storybook |
| E2E | `npm run test:e2e` | Recorridos con Playwright; levanta y para Angular solo |
| BDD | `npm run test:bdd` | Escenarios Gherkin en español con Cucumber.js y Playwright |

Para E2E por primera vez, instala Chromium con `npm run test:e2e:install`.

Los escenarios E2E y BDD navegan igual que un usuario: abren **Temario**, eligen la unidad y después el ejemplo.
