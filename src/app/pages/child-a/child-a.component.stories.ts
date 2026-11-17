import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ChildAComponent } from './child-a.component';

const meta: Meta<ChildAComponent> = {
  title: 'Componentes/pages/child-a/ChildAComponent',
  component: ChildAComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ChildAComponent>;

export const Predeterminado: Story = {};
