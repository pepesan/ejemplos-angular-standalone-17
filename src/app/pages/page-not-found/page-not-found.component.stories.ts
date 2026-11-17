import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PageNotFoundComponent } from './page-not-found.component';

const meta: Meta<PageNotFoundComponent> = {
  title: 'Componentes/pages/page-not-found/PageNotFoundComponent',
  component: PageNotFoundComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PageNotFoundComponent>;

export const Predeterminado: Story = {};
