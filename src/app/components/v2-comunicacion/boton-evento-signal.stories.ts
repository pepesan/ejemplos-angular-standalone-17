import type { Meta, StoryObj } from '@storybook/angular-vite';
import { BotonEventoSignalComponent } from './v2-comunicacion.component';

const meta: Meta<BotonEventoSignalComponent> = {
  title: 'Componentes/components/v2-comunicacion/BotonEventoSignalComponent',
  component: BotonEventoSignalComponent,
  tags: ['autodocs'],
  args: {
    texto: 'Pulsa aquí',
  },
};

export default meta;
type Story = StoryObj<BotonEventoSignalComponent>;

export const Predeterminado: Story = {};
