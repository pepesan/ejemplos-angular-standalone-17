import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MyLazyComponent } from './my-lazy.component';

const meta: Meta<MyLazyComponent> = {
  title: 'Componentes/modules/lazy-module/components/my-lazy/MyLazyComponent',
  component: MyLazyComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<MyLazyComponent>;

export const Predeterminado: Story = {};
