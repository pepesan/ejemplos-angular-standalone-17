import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TemarioDropdownComponent } from './temario-dropdown.component';
import { TEMARIO_UNITS } from '../temario-menu';

const meta: Meta<TemarioDropdownComponent> = {
  title: 'Componentes/navigation/TemarioDropdownComponent',
  component: TemarioDropdownComponent,
  tags: ['autodocs'],
  args: {
    units: TEMARIO_UNITS,
    activeUnit: TEMARIO_UNITS[0],
  },
};

export default meta;
type Story = StoryObj<TemarioDropdownComponent>;

export const UnidadInicial: Story = {};
export const UnidadDos: Story = { args: { activeUnit: TEMARIO_UNITS[1] } };
