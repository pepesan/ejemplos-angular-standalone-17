import type { Meta, StoryObj } from '@storybook/angular-vite';
import { UsoServiceComponent } from './uso-service.component';

const meta: Meta<UsoServiceComponent> = {
  title: 'Componentes/components/uso-service/UsoServiceComponent',
  component: UsoServiceComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UsoServiceComponent>;

export const Predeterminado: Story = {};
