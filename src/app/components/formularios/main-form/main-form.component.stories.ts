import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MainFormComponent } from './main-form.component';

const meta: Meta<MainFormComponent> = {
  title: 'Componentes/components/formularios/main-form/MainFormComponent',
  component: MainFormComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<MainFormComponent>;

export const Predeterminado: Story = {};
