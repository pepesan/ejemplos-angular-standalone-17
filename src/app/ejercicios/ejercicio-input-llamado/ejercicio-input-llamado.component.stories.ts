import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioInputLlamadoComponent } from './ejercicio-input-llamado.component';

const meta: Meta<EjercicioInputLlamadoComponent> = {
  title: 'Componentes/ejercicios/ejercicio-input-llamado/EjercicioInputLlamadoComponent',
  component: EjercicioInputLlamadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioInputLlamadoComponent>;

export const Predeterminado: Story = {};
