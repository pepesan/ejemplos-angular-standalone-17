import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormGroupBasicoComponent } from './form-group-basico.component';

const meta: Meta<FormGroupBasicoComponent> = {
  title: 'Componentes/components/reactivos/form-group-basico/FormGroupBasicoComponent',
  component: FormGroupBasicoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FormGroupBasicoComponent>;

export const Predeterminado: Story = {};
