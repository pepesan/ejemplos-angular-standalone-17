import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { V2FormularioAltaSignalComponent } from './v2-formulario-alta-signal.component';

const meta: Meta<V2FormularioAltaSignalComponent> = {
  title: 'V2/Formularios/Formulario de alta con Signal Forms',
  component: V2FormularioAltaSignalComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2FormularioAltaSignalComponent>;

export const FormularioInicial: Story = {};

// El botón empieza deshabilitado y los errores solo aparecen cuando el campo se ha tocado.
export const ErroresAlTocarLosCampos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Enviar' })).toBeDisabled();
    await userEvent.click(canvas.getByLabelText('Username *'));
    await userEvent.tab();
    await expect(canvas.getByText('Username obligatorio.')).toBeVisible();
  },
};

export const ContrasenasNoCoinciden: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Password *'), 'abcd');
    await userEvent.type(canvas.getByLabelText('Repeat Password *'), 'abce');
    await userEvent.tab();
    await expect(canvas.getByText('Las contraseñas no coinciden.')).toBeVisible();
  },
};

export const AltaCorrectaReiniciaElFormulario: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Username *'), 'anita');
    await userEvent.type(canvas.getByLabelText('Password *'), 'abcd');
    await userEvent.type(canvas.getByLabelText('Repeat Password *'), 'abcd');
    await userEvent.type(canvas.getByLabelText('Email *'), 'ana@example.com');
    await userEvent.click(canvas.getByLabelText('Acepto las condiciones *'));
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar' }));
    await expect(canvas.getByText('Alta recibida para anita.')).toBeVisible();
    await expect(canvas.getByLabelText('Username *')).toHaveValue('');
    await expect(canvas.getByLabelText('Acepto las condiciones *')).not.toBeChecked();
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
};
