import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ControlFlowComponent } from './control-flow.component';

const meta: Meta<ControlFlowComponent> = {
  title: 'Componentes/components/control-flow/ControlFlowComponent',
  component: ControlFlowComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ControlFlowComponent>;

export const Predeterminado: Story = {};
