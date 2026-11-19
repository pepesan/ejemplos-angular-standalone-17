import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { AvisoSinBackendComponent } from './aviso-sin-backend.component';

const meta: Meta<AvisoSinBackendComponent> = {
  title: 'V2/Usuarios con navegación/AvisoSinBackend',
  component: AvisoSinBackendComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AvisoSinBackendComponent>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No hay conexión con el backend.')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Reintentar' })).toBeNull();
  },
};

export const ConReintentar: Story = {
  args: { reintentable: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Reintentar' })).toBeVisible();
  },
};
