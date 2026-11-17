import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioListadoComponent } from './ejercicio-listado.component';

const meta: Meta<EjercicioListadoComponent> = {
  title: 'Componentes/ejercicios/ejercicio-listado/EjercicioListadoComponent',
  component: EjercicioListadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioListadoComponent>;

export const Predeterminado: Story = {};
