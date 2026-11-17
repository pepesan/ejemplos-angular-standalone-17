import type { Meta, StoryObj } from '@storybook/angular-vite';
import { CicloDeVidaComponent } from './ciclo-de-vida.component';

const meta: Meta<CicloDeVidaComponent> = {
  title: 'Componentes/components/ciclo-de-vida/CicloDeVidaComponent',
  component: CicloDeVidaComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CicloDeVidaComponent>;

export const Predeterminado: Story = {};
