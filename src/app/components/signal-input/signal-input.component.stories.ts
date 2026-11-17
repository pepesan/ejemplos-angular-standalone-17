import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SignalInputComponent } from './signal-input.component';

const meta: Meta<SignalInputComponent> = {
  title: 'Componentes/components/signal-input/SignalInputComponent',
  component: SignalInputComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SignalInputComponent>;

export const Predeterminado: Story = {};
