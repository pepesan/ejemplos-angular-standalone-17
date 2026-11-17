import type { Meta, StoryObj } from '@storybook/angular-vite';
import { UseSignalInputComponent } from './use-signal-input.component';

const meta: Meta<UseSignalInputComponent> = {
  title: 'Componentes/components/use-signal-input/UseSignalInputComponent',
  component: UseSignalInputComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UseSignalInputComponent>;

export const ValorPorDefecto: Story = {};
export const ValorPersonalizado: Story = { args: { value: 5 } };
