import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormBasicoComponent } from './form-basico.component';

const meta: Meta<FormBasicoComponent> = {
  title: 'Componentes/components/reactivos/form-basico/FormBasicoComponent',
  component: FormBasicoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FormBasicoComponent>;

export const Predeterminado: Story = {};
