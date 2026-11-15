import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { V2AccesibilidadComponent } from './v2-accesibilidad.component';

const meta: Meta<V2AccesibilidadComponent> = {
  title: 'V2/Accesibilidad/Formulario', component: V2AccesibilidadComponent, tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<V2AccesibilidadComponent>;

export const FormularioInicial: Story = {};
export const ErrorDeValidacion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Guardar' }));
    await expect(canvas.getByRole('alert')).toBeVisible();
  },
};
