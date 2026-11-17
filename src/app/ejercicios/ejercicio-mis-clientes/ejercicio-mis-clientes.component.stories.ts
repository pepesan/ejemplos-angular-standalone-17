import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioMisClientesComponent } from './ejercicio-mis-clientes.component';

const meta: Meta<EjercicioMisClientesComponent> = {
  title: 'Componentes/ejercicios/ejercicio-mis-clientes/EjercicioMisClientesComponent',
  component: EjercicioMisClientesComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioMisClientesComponent>;

export const Predeterminado: Story = {};
