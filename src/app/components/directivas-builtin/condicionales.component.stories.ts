import type { Meta, StoryObj } from '@storybook/angular-vite';
import { CondicionalesComponent } from './condicionales.component';

const meta: Meta<CondicionalesComponent> = {
  title: 'Componentes/components/directivas-builtin/CondicionalesComponent',
  component: CondicionalesComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CondicionalesComponent>;

export const Predeterminado: Story = {};
