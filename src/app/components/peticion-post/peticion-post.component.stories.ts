import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PeticionPostComponent } from './peticion-post.component';

const meta: Meta<PeticionPostComponent> = {
  title: 'Componentes/components/peticion-post/PeticionPostComponent',
  component: PeticionPostComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PeticionPostComponent>;

export const Predeterminado: Story = {};
