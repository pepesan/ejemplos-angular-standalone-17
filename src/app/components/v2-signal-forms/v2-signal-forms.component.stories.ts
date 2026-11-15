import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { V2SignalFormsComponent } from './v2-signal-forms.component';

const meta: Meta<V2SignalFormsComponent> = {
  title: 'V2/Formularios/Signal Forms', component: V2SignalFormsComponent, tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<V2SignalFormsComponent>;
export const FormularioInicial: Story = {};
export const ValidacionAccesible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Guardar contacto' }));
    await expect(canvas.getByText('Escribe tu nombre.')).toBeVisible();
    await expect(canvas.getByText('Escribe tu correo.')).toBeVisible();
  },
};
