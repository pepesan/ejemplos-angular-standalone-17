import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioEventosComponent } from './ejercicio-eventos.component';

const meta: Meta<EjercicioEventosComponent> = {
  title: 'Componentes/ejercicios/ejercicio-eventos/EjercicioEventosComponent',
  component: EjercicioEventosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioEventosComponent>;

export const Predeterminado: Story = {};
