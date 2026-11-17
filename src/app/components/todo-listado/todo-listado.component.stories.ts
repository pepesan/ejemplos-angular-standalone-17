import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TodoListadoComponent } from './todo-listado.component';

const meta: Meta<TodoListadoComponent> = {
  title: 'Componentes/components/todo-listado/TodoListadoComponent',
  component: TodoListadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TodoListadoComponent>;

export const Predeterminado: Story = {};
