import type { Meta, StoryObj } from '@storybook/angular-vite';
import { DetalleComponent } from './detalle.component';

const meta: Meta<DetalleComponent> = {
  title: 'Componentes/pages/detalle/DetalleComponent',
  component: DetalleComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<DetalleComponent>;

export const Predeterminado: Story = {};
