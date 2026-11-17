import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SignalEffectComponent } from './signal-effect.component';

const meta: Meta<SignalEffectComponent> = {
  title: 'Componentes/components/signal-effect/SignalEffectComponent',
  component: SignalEffectComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SignalEffectComponent>;

export const Predeterminado: Story = {};
