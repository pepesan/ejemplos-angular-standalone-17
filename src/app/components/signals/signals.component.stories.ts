import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SignalsComponent } from './signals.component';

const meta: Meta<SignalsComponent> = {
  title: 'Componentes/components/signals/SignalsComponent',
  component: SignalsComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SignalsComponent>;

export const Predeterminado: Story = {};
