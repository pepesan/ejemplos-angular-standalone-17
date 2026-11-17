import type { Meta, StoryObj } from '@storybook/angular-vite';
import { DemoComponent } from './demo.component';

const meta: Meta<DemoComponent> = {
  title: 'Componentes/modules/lazy-module/components/demo/DemoComponent',
  component: DemoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<DemoComponent>;

export const Predeterminado: Story = {};
