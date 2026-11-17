import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SiteHeaderComponent } from './site-header.component';
import { TEMARIO_UNITS } from '../temario-menu';

const meta: Meta<SiteHeaderComponent> = {
  title: 'Componentes/navigation/SiteHeaderComponent',
  component: SiteHeaderComponent,
  tags: ['autodocs'],
  args: {
    units: TEMARIO_UNITS,
    activeUnit: TEMARIO_UNITS[1],
    menuOpen: false,
  },
};

export default meta;
type Story = StoryObj<SiteHeaderComponent>;

export const Predeterminado: Story = {};
export const MenuMovilAbierto: Story = { args: { menuOpen: true } };
