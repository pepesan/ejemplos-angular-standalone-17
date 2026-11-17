import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PropiedadesComponent } from './propiedades.component';

const meta: Meta<PropiedadesComponent> = {
  title: 'Componentes/components/propiedades/PropiedadesComponent',
  component: PropiedadesComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PropiedadesComponent>;

export const Predeterminado: Story = {};
