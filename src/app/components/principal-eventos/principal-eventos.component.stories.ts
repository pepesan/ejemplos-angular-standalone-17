import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PrincipalEventosComponent } from './principal-eventos.component';

const meta: Meta<PrincipalEventosComponent> = {
  title: 'Componentes/components/principal-eventos/PrincipalEventosComponent',
  component: PrincipalEventosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PrincipalEventosComponent>;

export const Predeterminado: Story = {};
