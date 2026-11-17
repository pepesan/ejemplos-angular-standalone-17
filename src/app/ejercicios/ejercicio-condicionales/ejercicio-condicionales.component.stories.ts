import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioCondicionalesComponent } from './ejercicio-condicionales.component';

const meta: Meta<EjercicioCondicionalesComponent> = {
  title: 'Componentes/ejercicios/ejercicio-condicionales/EjercicioCondicionalesComponent',
  component: EjercicioCondicionalesComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioCondicionalesComponent>;

export const Predeterminado: Story = {};
