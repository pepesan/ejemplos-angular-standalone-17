import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ContadorControlesComponent } from './contador-controles.component';

const meta: Meta<ContadorControlesComponent> = {
  title: 'Componentes/components/v2-estado-compartido/ContadorControlesComponent',
  component: ContadorControlesComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ContadorControlesComponent>;

export const Predeterminado: Story = {};
