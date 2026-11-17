import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ListadoComponent } from './listado.component';

const meta: Meta<ListadoComponent> = {
  title: 'Componentes/pages/listado/ListadoComponent',
  component: ListadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ListadoComponent>;

export const Predeterminado: Story = {};
