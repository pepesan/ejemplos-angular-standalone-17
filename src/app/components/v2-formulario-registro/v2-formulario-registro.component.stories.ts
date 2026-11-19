import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { V2FormularioRegistroComponent } from './v2-formulario-registro.component';

const meta: Meta<V2FormularioRegistroComponent> = {
  title: 'V2/Formularios/Registro con validadores personalizados',
  component: V2FormularioRegistroComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2FormularioRegistroComponent>;

const SEGURA = 'Contrasena-Muy-Segura-2026!';

export const FormularioInicial: Story = {};

export const RequisitosPendientes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Contraseña'), 'abc');
    await expect(canvas.getByText(/Al menos 20 caracteres/).closest('li')).toHaveTextContent('Pendiente');
    await expect(canvas.getByText(/letra minúscula/).closest('li')).toHaveTextContent('Cumplido');
  },
};

export const NoCoinciden: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Contraseña'), SEGURA);
    await userEvent.type(canvas.getByLabelText('Repite la contraseña'), SEGURA + 'x');
    await userEvent.tab();
    await expect(canvas.getByText('Las contraseñas no coinciden.')).toBeVisible();
  },
};

export const RegistroCorrecto: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Correo electrónico'), 'ana@example.com');
    await userEvent.type(canvas.getByLabelText('Contraseña'), SEGURA);
    await userEvent.type(canvas.getByLabelText('Repite la contraseña'), SEGURA);
    await userEvent.click(canvas.getByRole('button', { name: 'Registrarme' }));
    await expect(canvas.getByText('Registro correcto para ana@example.com.')).toBeVisible();
    await expect(canvas.getByLabelText('Contraseña')).toHaveValue('');
  },
};
