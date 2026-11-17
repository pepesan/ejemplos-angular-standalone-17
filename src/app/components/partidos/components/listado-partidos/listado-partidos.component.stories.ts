import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ListadoPartidosComponent } from './listado-partidos.component';

const meta: Meta<ListadoPartidosComponent> = {
  title: 'Componentes/components/partidos/components/listado-partidos/ListadoPartidosComponent',
  component: ListadoPartidosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ListadoPartidosComponent>;

export const Predeterminado: Story = {};
