import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TodoDetalleComponent } from './todo-detalle.component';
import { Todo } from '../todo-class/todo';

const meta: Meta<TodoDetalleComponent> = {
  title: 'Tareas/Detalle de tarea',
  component: TodoDetalleComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TodoDetalleComponent>;

export const Tarea: Story = {
  args: {
    dato: new Todo(1, 'Preparar la merienda'),
  },
};
