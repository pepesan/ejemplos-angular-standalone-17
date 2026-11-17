import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormulariosComponent } from './formularios.component';

const meta: Meta<FormulariosComponent> = {
  title: 'Componentes/ejercicios/formularios/FormulariosComponent',
  component: FormulariosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FormulariosComponent>;

export const Predeterminado: Story = {};
