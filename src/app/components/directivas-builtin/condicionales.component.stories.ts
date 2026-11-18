import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { CondicionalesComponent } from './condicionales.component';

const meta: Meta<CondicionalesComponent> = {
  title: 'Componentes/components/directivas-builtin/CondicionalesComponent',
  component: CondicionalesComponent,
  decorators: [applicationConfig({ providers: [provideRouter([])] })],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CondicionalesComponent>;

export const Predeterminado: Story = {};
