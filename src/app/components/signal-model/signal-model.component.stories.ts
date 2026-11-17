import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SignalModelComponent } from './signal-model.component';

const meta: Meta<SignalModelComponent> = {
  title: 'Componentes/components/signal-model/SignalModelComponent',
  component: SignalModelComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SignalModelComponent>;

export const Predeterminado: Story = {};
