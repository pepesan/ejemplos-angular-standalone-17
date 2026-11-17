import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TemarioMobileMenuComponent } from './temario-mobile-menu.component';
import { TEMARIO_UNITS } from '../temario-menu';

const meta: Meta<TemarioMobileMenuComponent> = {
  title: 'Componentes/navigation/TemarioMobileMenuComponent',
  component: TemarioMobileMenuComponent,
  tags: ['autodocs'],
  args: {
    units: TEMARIO_UNITS,
  },
};

export default meta;
type Story = StoryObj<TemarioMobileMenuComponent>;

export const Predeterminado: Story = {};
