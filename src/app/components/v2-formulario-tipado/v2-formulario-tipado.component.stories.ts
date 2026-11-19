import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { V2FormularioTipadoComponent } from './v2-formulario-tipado.component';

const meta: Meta<V2FormularioTipadoComponent> = {
  title: 'V2/Formularios/Formulario reactivo tipado',
  component: V2FormularioTipadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2FormularioTipadoComponent>;

export const FormularioInicial: Story = {};

export const ValidaCamposObligatorios: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Inscribirme' }));
    await expect(canvas.getByText('Escribe tu nombre.')).toBeVisible();
  },
};

// Tras un envío correcto la confirmación se muestra y el formulario queda vacío, sin errores.
export const EnvioCorrectoLimpiaElFormulario: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Nombre'), 'Ana Pérez');
    await userEvent.type(canvas.getByLabelText('Correo electrónico'), 'ana@example.com');
    await userEvent.click(canvas.getByLabelText('Acepto la política de privacidad'));
    await userEvent.click(canvas.getByRole('button', { name: 'Inscribirme' }));
    await expect(canvas.getByText('Inscripción recibida para Ana Pérez.')).toBeVisible();
    await expect(canvas.getByLabelText('Nombre')).toHaveValue('');
    await expect(canvas.getByLabelText('Correo electrónico')).toHaveValue('');
    await expect(canvas.getByLabelText('Acepto la política de privacidad')).not.toBeChecked();
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
};
