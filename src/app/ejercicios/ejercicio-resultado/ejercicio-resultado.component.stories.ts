import { of } from 'rxjs';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { EstadoResultados } from './resultado';
import { EjercicioResultadoComponent } from './ejercicio-resultado.component';
import { ResultadoService } from './resultado.service';

const con = (estado: EstadoResultados) => ({
  moduleMetadata: { providers: [{ provide: ResultadoService, useValue: { estado: () => of(estado) } }] },
});

const meta: Meta<EjercicioResultadoComponent> = {
  title: 'Componentes/ejercicios/ejercicio-resultado/EjercicioResultadoComponent',
  component: EjercicioResultadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioResultadoComponent>;

export const ConResultados: Story = {
  render: () => con({ status: 'success', items: [{ nombre: 'PP', dipu: 137, imagen: 'pp.png' }, { nombre: 'PSOE', dipu: 121, imagen: 'psoe.png' }] }),
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText(/PP: 137/)).toBeVisible();
  },
};

export const Vacio: Story = { render: () => con({ status: 'success', items: [] }) };

export const Cargando: Story = { render: () => con({ status: 'loading' }) };

export const ErrorEnLaPeticion: Story = {
  render: () => con({ status: 'error', mensaje: 'No se pudieron cargar los resultados. Inténtalo de nuevo más tarde.' }),
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('alert')).toBeVisible();
  },
};
