import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MyCustomValidationComponent } from './my-custom-validation.component';

const meta: Meta<MyCustomValidationComponent> = {
  title: 'Componentes/components/reactivos/my-custom-validation/MyCustomValidationComponent',
  component: MyCustomValidationComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<MyCustomValidationComponent>;

export const Predeterminado: Story = {};
