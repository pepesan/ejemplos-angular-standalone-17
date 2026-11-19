export interface NavLink {
  path: string;
  label: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavLink[];
}

/**
 * Menú del temario agrupado por unidades.
 * El orden de `items` es el orden en el que se muestran los ejemplos.
 */
export const TEMARIO_UNITS: NavGroup[] = [
  {
    id: 'temario-1',
    label: '1. Fundamentos de TypeScript y Angular',
    items: [
      { path: '/v2/fundamentos', label: 'V2 · Arquitectura Angular y CLI' },
    ],
  },
  {
    id: 'temario-2',
    label: '2. Componentes, plantillas y Data Binding',
    items: [
      { path: '/todos', label: 'V2 · Lista de tareas con Signals' },
      { path: '/props', label: 'V1 · Componentes, interpolación y property binding' },
      { path: '/directivas', label: 'V1 · Directivas *ngIf, *ngFor, *ngSwitch (obsoleto desde v20)' },
      { path: '/control-flow', label: 'V2 · Control flow integrado' },
      { path: '/v2/seguridad', label: 'V2 · Seguridad en plantillas' },
      { path: '/ejercicio-condicionales', label: 'V1 · Ejercicio de condicionales' },
      { path: '/ciclo', label: 'V1 · Ciclo de vida de componentes' },
      { path: '/pipes', label: 'V1 · Pipes y plantillas' },
      { path: '/ejercicio-tuberias', label: 'V1 · Ejercicio de pipes' },
      { path: '/v2/i18n', label: 'V2 · Internacionalización de plantillas' },
    ],
  },
  {
    id: 'temario-3',
    label: '3. Comunicación entre componentes y Signals',
    items: [
      { path: '/v2/comunicacion', label: 'V2 · Ejemplo de @Input/@Output, input()/output() (estables desde v19) y proyección' },
      { path: '/ejercicio-input', label: 'V1 · Ejercicio de comunicación con @Input (enfoque clásico; hoy input(), estable desde v19)' },
      { path: '/signals', label: 'V1 · Introducción a Signals' },
      { path: '/v2/estado', label: 'V2 · signal(), computed() y estado derivado (estables desde v17)' },
      { path: '/signals-input', label: 'V2 · input() basado en Signals (estable desde v19)' },
      { path: '/signals-model', label: 'V2 · Model y two-way binding (estable desde v19)' },
      { path: '/signals-queries', label: 'V2 · Queries con Signals (estable desde v19)' },
      { path: '/signals-effect', label: 'V2 · effect() para efectos externos (estable desde v20)' },
      { path: '/ejercicio-signals', label: 'V2 · Ejercicio práctico de Signals' },
      { path: '/service', label: 'V1 · Observables' },
      { path: '/partidos', label: 'V1 · Comparativa de Promesas, Observables y Signals' },
      { path: '/v2/busqueda-reactiva', label: 'V2 · Signals y Observables con RxJS (toSignal/toObservable estables desde v20)' },
    ],
  },
  {
    id: 'temario-4',
    label: '4. Servicios y comunicación HTTP',
    items: [
      { path: '/servicio-basico', label: 'V2 · Servicio básico con @Service() e inject() (@Service desde v22)' },
      { path: '/v2/servicio-injectable', label: 'V2 · @Injectable: constructor frente a inject(), singleton y límites' },
      { path: '/v2/servicio-sin-injectable', label: 'V2 · Servicio sin decorador, registrado en providers (no singleton)' },
      { path: '/v2/estado-compartido', label: 'V2 · Comunicación mediante estado compartido con Signals' },
      { path: '/ejercicio-servicios', label: 'V1 · Ejercicio de servicios' },
      { path: '/pactometro', label: 'V1 · Consumo de API con HttpClient (pactometro)' },
      { path: '/pactometro-procesado', label: 'V1 · Datos de la API modificados en el servicio (pactometro)' },
      { path: '/pactometro-avisos', label: 'V1 · Reintentos, timeout y avisos de fallo (pactometro)' },
      { path: '/envio-post', label: 'V1 · Petición POST sencilla (JSONPlaceholder)' },
      { path: '/v2/consumo-api', label: 'V2 · HttpClient y estados de carga/error' },
      { path: '/v2/consumo-api-servicio', label: 'V2 · Consumo de API con un servicio (@Service desde v22)' },
      { path: '/ejercicio-resultado', label: 'V2 · Ejercicio de consulta HTTP con toSignal y servicio' },
      { path: '/v2/autenticacion', label: 'V2 · Interceptor JWT y errores globales (interceptores funcionales desde v15)' },
      { path: '/v2/usuarios-crud', label: 'V2 · CRUD de usuarios y buenas prácticas de acceso a la API (@Service desde v22)' },
    ],
  },
  {
    id: 'temario-5',
    label: '5. Eventos y Formularios',
    items: [
      { path: '/events', label: 'V1 · Eventos y $event' },
      { path: '/ejercicio-eventos', label: 'V1 · Ejercicio de eventos' },
      { path: '/form-bootstrap', label: 'V1 · Controles de formulario y estilos Bootstrap' },
      { path: '/form', label: 'V1 · Formulario de plantilla con ngModel' },
      { path: '/form-radios', label: 'V1 · Radios y checkbox con ngModel' },
      { path: '/ejercicio-componente', label: 'V1 · Ejercicio de lista con two-way binding' },
      { path: '/ejercicio-misclientes', label: 'V1 · Ejercicio de formulario y listado con ngModel' },
      { path: '/ejercicio-formulario', label: 'V1 · Ejercicio de formulario de plantilla' },
      { path: '/reactivos', label: 'V1 · FormControl, FormGroup y validadores' },
      { path: '/ejercicio-formulario-reactivo', label: 'V1 · Ejercicio de formularios reactivos' },
      { path: '/v2/formulario-tipado', label: 'V2 · Formulario reactivo tipado' },
      { path: '/v2/validadores-predefinidos', label: 'V2 · Catálogo de validadores predefinidos (Validators)' },
      { path: '/v2/formulario-registro', label: 'V2 · Registro con validadores personalizados (contraseña segura y coincidencia)' },
      { path: '/v2/signal-forms', label: 'V2 · Formularios basados en Signals (estable desde v22)' },
      { path: '/v2/formulario-alta-signal', label: 'V2 · Formulario de alta con Signal Forms (el ejercicio reactivo, con signals)' },
      { path: '/v2/accesibilidad', label: 'V2 · Accesibilidad y calidad en formularios' },
    ],
  },
  {
    id: 'temario-6',
    label: '6. Routing, Guards y Lazy Loading',
    items: [
      { path: '/nav', label: 'V1 · Navegación entre componentes' },
      { path: '/subrutas', label: 'V1 · Rutas anidadas' },
      { path: '/lazy', label: 'V1 · Lazy loading de módulos' },
      { path: '/v2/rutas', label: 'V2 · Guards funcionales, resolvers y lazy loading standalone' },
    ],
  },
];
