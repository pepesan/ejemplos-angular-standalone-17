import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ContadorResumenComponent } from './contador-resumen.component';

const meta: Meta<ContadorResumenComponent> = {
  title: 'Componentes/components/v2-estado-compartido/ContadorResumenComponent',
  component: ContadorResumenComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ContadorResumenComponent>;

export const Predeterminado: Story = {};
