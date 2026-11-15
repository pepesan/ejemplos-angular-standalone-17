import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FormularioTipadoComponent } from './formulario-tipado.component';

const meta: Meta<FormularioTipadoComponent> = {
  title: 'V2/Formularios/Formulario reactivo tipado',
  component: FormularioTipadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FormularioTipadoComponent>;

export const FormularioInicial: Story = {};

export const ValidaCamposObligatorios: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Inscribirme' }));
    await expect(canvas.getByText('Escribe tu nombre.')).toBeVisible();
  },
};
