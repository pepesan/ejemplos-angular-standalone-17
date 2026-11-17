import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PactometroComponent } from './pactometro.component';

const meta: Meta<PactometroComponent> = {
  title: 'Componentes/components/pactometro/PactometroComponent',
  component: PactometroComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PactometroComponent>;

export const Predeterminado: Story = {};
