import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ResumenRendimientoComponent } from './resumen-rendimiento.component';

const meta: Meta<ResumenRendimientoComponent> = {
  title: 'Componentes/components/v2-estado/ResumenRendimientoComponent',
  component: ResumenRendimientoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ResumenRendimientoComponent>;

export const Predeterminado: Story = {};
