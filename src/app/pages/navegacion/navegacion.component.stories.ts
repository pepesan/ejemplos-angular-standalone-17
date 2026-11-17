import type { Meta, StoryObj } from '@storybook/angular-vite';
import { NavegacionComponent } from './navegacion.component';

const meta: Meta<NavegacionComponent> = {
  title: 'Componentes/pages/navegacion/NavegacionComponent',
  component: NavegacionComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<NavegacionComponent>;

export const Predeterminado: Story = {};
