# Proyecto

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) and currently uses Angular 22.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.


## V2: formulario reactivo tipado

Abre `/v2/formulario-tipado` desde el menú «V2 · Angular moderno». Este ejemplo usa controles reactivos no anulables y tipados, validación, `OnPush`, un estado de confirmación con Signals y mensajes de error accesibles. La ruta carga el componente standalone de forma diferida.

El mismo flujo se cubre con tests unitarios Vitest, una story interactiva de Storybook, escenarios Cucumber/Playwright y una prueba E2E de Playwright. Ejecuta todas las suites con `npm run test:all`.

## V2: ejemplos modernos

- `/v2/consumo-api`: `HttpClient` consulta `https://pactometro.cursosdedesarrollo.com/resultados.json`, muestra estados de carga/vacío/error y usa `toSignal` para integrar RxJS con Signals. Las pruebas simulan el endpoint y sus respuestas, sin depender de la red.
- `/v2/rutas`: feature standalone de carga diferida, parámetro de ruta, guarda funcional y pantalla para rutas inexistentes.
- `/v2/estado`: Signals para el estado local, `computed` para filtrar, `OnPush` y `track` por identidad estable; no necesita `effect` para derivar valores.
- `/v2/accesibilidad`: etiqueta, ayuda, validación asociada y anuncio accesible del error, con story de Storybook para el estado límite.
- `/v2/signal-forms`: Signal Forms, estable en Angular 22, con esquema de validación y modelo basado en Signals.
- `/v2/busqueda-reactiva`: `toObservable`, debounce y `switchMap` para flujos asíncronos con cancelación de peticiones obsoletas.
- `/v2/i18n`: textos y formatos de fecha/moneda para dos locales, con actualización reactiva.
- `/v2/seguridad`: comparación entre interpolación literal y sanitización HTML; evita confiar contenido con `bypassSecurityTrustHtml`.

La validación HTTP del Pactómetro ahora permite reintentar tras un error. El test de accesibilidad usa un harness de Angular CDK para interactuar por un contrato estable. El ejemplo de estado incluye un bloque `@defer` y su prueba comprueba que el contenido aparece al renderizar la sección diferida.

Cada ejemplo tiene pruebas de comportamiento. Las rutas nuevas también tienen recorridos Playwright; puedes ejecutarlos con `npm run test:e2e`.

## Unit tests with Vitest

Existing Angular `.spec.ts` files stay in place and run through Angular's Vitest test builder:

- `npm test` or `npm run test:unit`: run once.
- `npm run test:unit:watch`: watch mode.
- `npm run test:unit:coverage`: generate coverage with V8; open `coverage/proyecto/index.html` for the HTML report. Summary and per-file metrics are also printed to the terminal.

## Browser tests

- `npm run test:e2e:install`: install Playwright's Chromium browser once.
- `npm run test:e2e`: run direct Playwright E2E tests; Playwright starts and stops Angular.
- `npm run test:bdd`: start Angular and run the Cucumber.js Gherkin scenarios using Playwright.

## Storybook

- `npm run storybook`: start component workbench at `http://localhost:6006`.
- `npm run build-storybook`: build the static Storybook site.
- `npm run test:stories`: run Storybook stories through the Vitest addon.

Run all automated suites with `npm run test:all`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
