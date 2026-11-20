import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FuenteEjemploComponent, MAPA_FUENTES } from './fuente-ejemplo.component';
import { ElementoFuente, TipoElemento } from './fuente-ejemplo.tipos';
import { FUENTES_EJEMPLO } from './fuentes-ejemplo.generated';

// Nº de ficheros del ejemplo de reactivos: sale de las fuentes generadas para que la story no se rompa al añadir uno.
const FICHEROS_REACTIVOS = FUENTES_EJEMPLO['src/app/pages/reactivos/reactivos.component.ts'].length;

/** Router mínimo: el aviso solo lee la jerarquía de `data.fuente` de la ruta activa. */
function routerCon(fuente?: string) {
  const root = { routeConfig: null, firstChild: fuente ? { routeConfig: { data: { fuente } }, firstChild: null } : null };
  return { provide: Router, useValue: { events: EMPTY, routerState: { snapshot: { root } } } };
}

const TIPOS: TipoElemento[] = ['page', 'componente', 'pipe', 'directiva', 'servicio', 'guarda', 'modelo', 'validador', 'modulo', 'rutas'];
const MAPA_TIPOS: Record<string, ElementoFuente[]> = {
  'src/app/demo/todos.ts': TIPOS.map((tipo) => ({ ruta: `src/app/demo/${tipo}.ts`, tipo })),
};
const MAPA_UNO: Record<string, ElementoFuente[]> = {
  'src/app/demo/uno.component.ts': [{ ruta: 'src/app/demo/uno.component.ts', tipo: 'componente' }],
};

const meta: Meta<FuenteEjemploComponent> = {
  title: 'Componentes/navigation/FuenteEjemploComponent',
  component: FuenteEjemploComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FuenteEjemploComponent>;

// Sin `data.fuente` (Inicio, Acerca de, 404) no se renderiza nada.
export const SinFuente: Story = {
  render: () => ({ moduleMetadata: { providers: [routerCon()] } }),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('complementary')).toBeNull();
  },
};

export const UnFichero: Story = {
  render: () => ({ moduleMetadata: { providers: [routerCon('src/app/demo/uno.component.ts'), { provide: MAPA_FUENTES, useValue: MAPA_UNO }] } }),
  play: async ({ canvasElement }) => {
    const aviso = within(canvasElement).getByRole('complementary', { name: 'Fichero del ejemplo' });
    await expect(within(aviso).getAllByRole('listitem')).toHaveLength(1);
  },
};

export const VariosFicherosReales: Story = {
  render: () => ({ moduleMetadata: { providers: [routerCon('src/app/components/uso-pipes/uso-pipes.component.ts')] } }),
  play: async ({ canvasElement }) => {
    const aviso = within(canvasElement).getByRole('complementary', { name: 'Ficheros del ejemplo' });
    await expect(within(aviso).getAllByRole('listitem')).toHaveLength(3);
  },
};

// Con más de 5 ficheros (aquí FICHEROS_REACTIVOS) la lista se pliega; el botón expone aria-expanded y despliega el resto.
export const ListaLargaReactivos: Story = {
  render: () => ({ moduleMetadata: { providers: [routerCon('src/app/pages/reactivos/reactivos.component.ts')] } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5);
    const boton = canvas.getByRole('button', { name: `Mostrar ${FICHEROS_REACTIVOS - 5} más` });
    await expect(boton).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(boton);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(FICHEROS_REACTIVOS);
    await expect(canvas.getByRole('button', { name: 'Mostrar menos' })).toHaveAttribute('aria-expanded', 'true');
  },
};

export const TodosLosTiposDePildora: Story = {
  render: () => ({ moduleMetadata: { providers: [routerCon('src/app/demo/todos.ts'), { provide: MAPA_FUENTES, useValue: MAPA_TIPOS }] } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar 5 más' }));
    await expect(canvas.getAllByRole('listitem')).toHaveLength(TIPOS.length);
  },
};
