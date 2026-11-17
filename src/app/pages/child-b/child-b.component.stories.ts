import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ChildBComponent } from './child-b.component';

const meta: Meta<ChildBComponent> = {
  title: 'Componentes/pages/child-b/ChildBComponent',
  component: ChildBComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ChildBComponent>;

export const Predeterminado: Story = {};
