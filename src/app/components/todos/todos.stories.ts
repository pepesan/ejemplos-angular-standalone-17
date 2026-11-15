import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TodosComponent } from './todos.component';

const meta: Meta<TodosComponent> = {
  title: 'Tareas/Lista de tareas',
  component: TodosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TodosComponent>;

export const ListaInicial: Story = {};
