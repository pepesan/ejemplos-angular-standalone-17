import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ErrorApi, Usuario, UsuarioNuevo } from '../../services/usuarios-api.service';
import { UsuarioFormComponent } from './usuario-form.component';

const guardado: Usuario = { id: 3, nombre: 'Eva', email: 'eva@example.com', rol: 'alumno' };
const vacio: UsuarioNuevo = { nombre: '', email: '', rol: 'alumno' };

const meta: Meta<UsuarioFormComponent> = {
  title: 'V2/Usuarios con navegación/UsuarioForm',
  component: UsuarioFormComponent,
  tags: ['autodocs'],
  args: { valorInicial: vacio, enviar: async () => guardado, textoEnviar: 'Crear usuario' },
};

export default meta;
type Story = StoryObj<UsuarioFormComponent>;

const rellenar = async (canvas: ReturnType<typeof within>, email = 'eva@example.com') => {
  await userEvent.type(canvas.getByLabelText('Nombre'), 'Eva');
  await userEvent.type(canvas.getByLabelText('Email'), email);
};

export const Nuevo: Story = {};

// Edición: el valor inicial (incluido un rol que no es el primero) aparece precargado.
export const Edicion: Story = {
  args: { valorInicial: { nombre: 'Ana López', email: 'ana@example.com', rol: 'profesor' }, textoEnviar: 'Guardar cambios' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Nombre')).toHaveValue('Ana López');
    await expect(canvas.getByLabelText('Rol')).toHaveValue('profesor');
  },
};

export const Invalido: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Crear usuario' }));
    await expect(await canvas.findByText('El nombre es obligatorio.')).toBeVisible();
    await expect(canvas.getByText('El email es obligatorio.')).toBeVisible();
  },
};

// El 409 del servidor llega por la acción de `submit()` y se pinta junto al campo, como un error más.
export const EmailYaEnUso: Story = {
  args: { enviar: async () => { throw new ErrorApi('Ya existe', 409, { email: 'Ese email ya está en uso.' }); } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await rellenar(canvas, 'ana@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Crear usuario' }));
    await expect(await canvas.findByText('Ese email ya está en uso.')).toBeVisible();
  },
};

export const BackendApagado: Story = {
  args: { enviar: async () => { throw new ErrorApi('Sin conexión', 502); } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await rellenar(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Crear usuario' }));
    await expect(await canvas.findByText('No hay conexión con el backend.')).toBeVisible();
  },
};
