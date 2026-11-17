import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioServiciosComponent } from './ejercicio-servicios.component';

const meta: Meta<EjercicioServiciosComponent> = {
  title: 'Componentes/ejercicios/ejercicio-servicios/EjercicioServiciosComponent',
  component: EjercicioServiciosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioServiciosComponent>;

export const Predeterminado: Story = {};
