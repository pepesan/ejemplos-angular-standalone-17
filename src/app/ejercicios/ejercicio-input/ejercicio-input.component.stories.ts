import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioInputComponent } from './ejercicio-input.component';

const meta: Meta<EjercicioInputComponent> = {
  title: 'Componentes/ejercicios/ejercicio-input/EjercicioInputComponent',
  component: EjercicioInputComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioInputComponent>;

export const Predeterminado: Story = {};
