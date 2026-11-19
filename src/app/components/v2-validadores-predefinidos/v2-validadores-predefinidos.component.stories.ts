import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { V2ValidadoresPredefinidosComponent } from './v2-validadores-predefinidos.component';

const meta: Meta<V2ValidadoresPredefinidosComponent> = {
  title: 'V2/Formularios/Validadores predefinidos',
  component: V2ValidadoresPredefinidosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2ValidadoresPredefinidosComponent>;

export const Catalogo: Story = {};

// El detalle del error cambia según el validador: aquí se ve el de minLength.
export const DetalleDeMinLength: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Usuario (3 a 12 caracteres)'), 'ab');
    await expect(canvas.getByText(/minlength: \{"requiredLength":3,"actualLength":2\}/)).toBeVisible();
    await expect(canvas.getByText('Mínimo 3 caracteres.')).toBeVisible();
  },
};

// Al marcar «Exigir teléfono» se pasa de nullValidator a compose([...]).
export const TelefonoExigido: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('Exigir teléfono'));
    await expect(canvas.getByText('Escribe tu teléfono.')).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Teléfono'), '600123456');
    await expect(canvas.queryByText('Escribe tu teléfono.')).toBeNull();
  },
};
