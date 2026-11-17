import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AcordeonComponent } from './acordeon.component';

const meta: Meta<AcordeonComponent> = {
  title: 'Componentes/pages/acordeon/AcordeonComponent',
  component: AcordeonComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AcordeonComponent>;

export const Predeterminado: Story = {};
