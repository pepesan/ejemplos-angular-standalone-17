import type { Meta, StoryObj } from '@storybook/angular-vite';
import { HomeComponent } from './home.component';

const meta: Meta<HomeComponent> = {
  title: 'Componentes/pages/home/HomeComponent',
  component: HomeComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<HomeComponent>;

export const Predeterminado: Story = {};
