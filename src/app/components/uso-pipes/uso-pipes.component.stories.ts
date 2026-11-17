import type { Meta, StoryObj } from '@storybook/angular-vite';
import { UsoPipesComponent } from './uso-pipes.component';

const meta: Meta<UsoPipesComponent> = {
  title: 'Componentes/components/uso-pipes/UsoPipesComponent',
  component: UsoPipesComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UsoPipesComponent>;

export const Predeterminado: Story = {};
