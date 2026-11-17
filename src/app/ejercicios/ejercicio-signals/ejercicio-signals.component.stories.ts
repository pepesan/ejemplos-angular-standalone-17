import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EjercicioSignalsComponent } from './ejercicio-signals.component';

const meta: Meta<EjercicioSignalsComponent> = {
  title: 'Componentes/ejercicios/ejercicio-signals/EjercicioSignalsComponent',
  component: EjercicioSignalsComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EjercicioSignalsComponent>;

export const Predeterminado: Story = {};
