import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AboutComponent } from './about.component';

const meta: Meta<AboutComponent> = {
  title: 'Componentes/pages/about/AboutComponent',
  component: AboutComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AboutComponent>;

export const Predeterminado: Story = {};
