import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SignalInputHijoComponent } from './signal-input-hijo.component';

const meta: Meta<SignalInputHijoComponent> = {
  title: 'Componentes/components/signal-input-hijo/SignalInputHijoComponent',
  component: SignalInputHijoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SignalInputHijoComponent>;

export const ValorPorDefecto: Story = {};
export const ValorPersonalizado: Story = { args: { value: 5 } };
