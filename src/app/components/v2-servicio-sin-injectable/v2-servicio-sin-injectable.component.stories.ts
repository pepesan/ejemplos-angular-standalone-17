import type { Meta, StoryObj } from '@storybook/angular-vite';
import { V2ServicioSinInjectableComponent } from './v2-servicio-sin-injectable.component';

const meta: Meta<V2ServicioSinInjectableComponent> = {
  title: 'Componentes/components/v2-servicio-sin-injectable/V2ServicioSinInjectableComponent',
  component: V2ServicioSinInjectableComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2ServicioSinInjectableComponent>;

export const Predeterminado: Story = {};
