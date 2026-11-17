import type { Meta, StoryObj } from '@storybook/angular-vite';
import { V2AuthComponent } from './v2-auth.component';

const meta: Meta<V2AuthComponent> = {
  title: 'Componentes/components/v2-auth/V2AuthComponent',
  component: V2AuthComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2AuthComponent>;

export const Predeterminado: Story = {};
