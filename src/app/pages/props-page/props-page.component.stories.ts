import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PropsPageComponent } from './props-page.component';

const meta: Meta<PropsPageComponent> = {
  title: 'Componentes/pages/props-page/PropsPageComponent',
  component: PropsPageComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PropsPageComponent>;

export const Predeterminado: Story = {};
