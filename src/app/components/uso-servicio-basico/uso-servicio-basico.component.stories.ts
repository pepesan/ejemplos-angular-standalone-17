import type { Meta, StoryObj } from '@storybook/angular-vite';
import { UsoServicioBasicoComponent } from './uso-servicio-basico.component';

const meta: Meta<UsoServicioBasicoComponent> = {
  title: 'Componentes/components/uso-servicio-basico/UsoServicioBasicoComponent',
  component: UsoServicioBasicoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UsoServicioBasicoComponent>;

export const Predeterminado: Story = {};
