import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioResultadoComponent } from './ejercicio-resultado.component';

const meta: Meta<EjercicioResultadoComponent> = {
  title: 'Componentes/ejercicios/ejercicio-resultado/EjercicioResultadoComponent',
  component: EjercicioResultadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioResultadoComponent>;

export const Predeterminado: Story = {};
