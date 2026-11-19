import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { ConfirmarBorradoComponent } from './confirmar-borrado.component';

const meta: Meta<ConfirmarBorradoComponent> = {
  title: 'V2/Usuarios con navegación/ConfirmarBorrado',
  component: ConfirmarBorradoComponent,
  tags: ['autodocs'],
  args: { usuario: { id: 1, nombre: 'Ana López', email: 'ana@example.com', rol: 'profesor' } },
};

export default meta;
type Story = StoryObj<ConfirmarBorradoComponent>;

// El `<dialog>` se abre con `showModal()` cuando hay usuario: nombra a quién se va a borrar.
export const Abierto: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('dialog', { name: 'Eliminar usuario' })).toBeVisible();
    await expect(canvas.getByText('Ana López')).toBeVisible();
  },
};

export const Eliminando: Story = {
  args: { eliminando: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('button', { name: 'Eliminando…' })).toBeDisabled();
  },
};

// Si el borrado falla, el error se ve dentro del modal, que sigue abierto.
export const ConError: Story = {
  args: { error: 'No se puede borrar: el usuario tiene datos asociados.' },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('alert')).toHaveTextContent('No se puede borrar');
  },
};
