import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ReactivosComponent } from './reactivos.component';

const meta: Meta<ReactivosComponent> = {
  title: 'Componentes/pages/reactivos/ReactivosComponent',
  component: ReactivosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ReactivosComponent>;

export const Predeterminado: Story = {};
