# Angular · Aprende haciendo

Proyecto didáctico con ejemplos pequeños de Angular 22 (standalone, Signals, control flow, formularios reactivos, routing, HTTP, Storybook y pruebas). Cada ejemplo tiene una ruta propia, pruebas y una breve explicación.

El temario completo está en [TEMARIO.md](TEMARIO.md). TypeScript se imparte en el proyecto complementario.

## Cómo está organizada la navegación

La cabecera tiene **Inicio**, **Temario** y **Acerca de**. El menú **Temario** agrupa los ejemplos por unidad:

1. **Fundamentos de TypeScript y Angular**: arquitectura Angular y CLI.
2. **Componentes, plantillas y Data Binding**: lista de tareas, props, directivas, control flow, seguridad en plantillas, condicionales, ciclo de vida, pipes e internacionalización.
3. **Comunicación entre componentes y Signals**: `@Input`/`@Output`, `input()`/`output()`, `signal`/`computed`, `model`, queries, `effect` y estado compartido.
4. **Servicios y comunicación HTTP**: servicios, `HttpClient`, interceptores y JWT.
5. **Eventos y Formularios**: eventos, formularios de plantilla, reactivos tipados, Signal Forms y accesibilidad.
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

### Ficheros de cada ejemplo (`npm run fuentes`)

Encima de cada ejemplo, la aplicación muestra qué ficheros lo implementan, con una píldora de color según su tipo (Page, Componente, Pipe, Directiva, Servicio, Guarda, Modelo, Validador, Módulo, Rutas).

- Cada ruta declara su fichero principal con `data: { fuente: 'src/app/...' }` en `app.routes.ts` (o en el fichero de rutas de la sección).
- La lista completa de ficheros de cada ejemplo está en `src/app/navigation/fuente-ejemplo/fuentes-ejemplo.generated.ts`, un fichero **generado**: no se edita a mano.
- `npm run fuentes` lo regenera con `scripts/generar-fuentes-ejemplo.mjs`, que sigue los `import` de cada ejemplo dentro de `src/app` (sin specs ni stories) y deduce el tipo de cada fichero por su decorador.

**Cuándo ejecutarlo:** al añadir un ejemplo (con su `data.fuente` en la ruta), al mover o renombrar ficheros, y cuando un ejemplo empiece a usar otro componente, pipe, directiva o servicio. Después, commitea el fichero generado junto al cambio.

**Por qué:** el fichero generado es una copia del grafo de imports. Si no se regenera, el aviso muestra rutas que ya no existen o se deja fuera elementos nuevos, y el alumno acaba buscando código en un sitio equivocado. Generarlo con el script evita mantener esas listas a mano en cada ejemplo.

Solo se detectan los elementos importados en TypeScript; los cargados por otra vía no aparecerían.

## Servidor de desarrollo

Para la aplicación, ejecuta `npm start` y abre `http://localhost:4200/`. El backend didáctico se arranca en otra terminal con `npm run backend`; el proxy de desarrollo reenvía `/api/*` a ese backend. Sus endpoints están descritos en [backend/README.md](backend/README.md).

Las credenciales `alumno` / `angular` y la clave JWT predeterminada son solo para desarrollo local.

## Ejemplos V2 destacados

- `/todos`: lista de tareas con Signals (unidad 2).
- `/control-flow` y `/v2/seguridad`: control flow integrado y comparación entre interpolación literal y sanitización HTML (no usar `bypassSecurityTrustHtml` para contenido no confiable).
- `/v2/i18n`: textos y formatos de fecha y moneda para dos locales, con actualización reactiva.
- `/v2/formulario-tipado`: formulario reactivo no anulable y tipado, validación, `OnPush`, confirmación con Signals, mensajes de error accesibles y limpieza del formulario tras un envío correcto. La ruta carga el componente standalone de forma diferida.
- `/v2/formulario-alta-signal`: el formulario de alta del ejercicio de formularios reactivos rehecho con Signal Forms (`form()`): valor en una signal, reglas en un esquema, coincidencia de contraseñas con `validate` y `valueOf`, y una regla pura compartida con los validadores reactivos (`validators/reglas.ts`).
- `/v2/validadores-predefinidos`: catálogo de todos los validadores de `Validators` (`required`, `requiredTrue`, `min`, `max`, `minLength`, `maxLength`, `email`, `pattern`, `compose`, `nullValidator`) con el objeto de error real de cada uno en vivo y validadores que cambian en caliente.
- `/v2/formulario-registro`: formulario de registro con una pila de validadores por campo (predefinidos y propios: 20 caracteres como mínimo, número, minúscula, mayúscula y símbolo), un validador de grupo para que las dos contraseñas coincidan y mensajes definidos junto a cada validador (`conMensaje`).
- `/v2/consumo-api`: `HttpClient` contra `/api/resultados`, estados de carga, vacío y error, e integración RxJS-Signals con `toSignal`.
- `/v2/usuarios-crud`: CRUD de usuarios contra `/api/usuarios` (SQLite en memoria) con login/logout por JWT, listado paginado, filtrable y ordenable en el servidor, interfaz mobile first sin framework de UI y buenas prácticas de acceso a la API (`UsuariosApiService`).
- `/v2/usuarios-crud-signal`: el mismo CRUD con los formularios (login, búsqueda y alta/edición) hechos con Signal Forms: `submit()` y `submitting()` en lugar de señales de estado, errores 400/409 del servidor asociados a su campo desde la acción de `submit()`, `debounce()` en el esquema del filtro y el mismo `UsuariosApiService`.
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

## Cobertura de las pruebas

- `npm run test:unit:coverage`: cobertura de los tests unitarios (informe en `coverage/`).
- `npm run cobertura:stories`: cobertura de código que alcanzan las stories de Storybook al ejecutarse con Vitest (informe en `coverage-stories/`).
- `npm run cobertura:e2e`: ejecuta los tests de Playwright midiendo el JavaScript que corre en el navegador (V8) y lo traslada a los ficheros fuente de `src/app` con los source maps (resumen en `.cobertura-e2e/resumen.json`). Muestra también los ficheros `.ts` que ningún e2e llega a cargar. Para que un test cuente, debe importar `test` y `expect` de `e2e/fixtures.ts`.
