import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormBootstrapComponent } from './form-bootstrap.component';

const meta: Meta<FormBootstrapComponent> = {
  title: 'Componentes/pages/form-bootstrap/FormBootstrapComponent',
  component: FormBootstrapComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FormBootstrapComponent>;

export const Predeterminado: Story = {};
