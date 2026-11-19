import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { interceptorMock, type RutaMock } from '../../testing/http-mock';
import { V2UsuariosCrudSignalComponent } from './v2-usuarios-crud-signal.component';

const meta: Meta<V2UsuariosCrudSignalComponent> = {
  title: 'V2/Servicios HTTP/CRUD de usuarios con Signal Forms',
  component: V2UsuariosCrudSignalComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2UsuariosCrudSignalComponent>;

const items = [
  { id: 1, nombre: 'Ana López', email: 'ana@example.com', rol: 'profesor' },
  { id: 2, nombre: 'Luis Pérez', email: 'luis@example.com', rol: 'alumno' },
];

const backend = (role: 'admin' | 'student', extra: RutaMock[] = []) =>
  applicationConfig({
    providers: [
      provideHttpClient(
        withInterceptors([
          interceptorMock([
            { metodo: 'POST', url: '/auth/login', cuerpo: { tokenType: 'Bearer', accessToken: 'jwt-falso', expiresInSeconds: 900 } },
            { url: '/auth/profile', cuerpo: { id: 'x', name: 'Persona de ejemplo', role } },
            ...extra,
            { url: '/api/usuarios', cuerpo: { items, total: 12, page: 1, size: 5 } },
          ]),
        ]),
      ),
    ],
  });

const entrar = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Iniciar sesión' }));
  return canvas;
};

export const SinSesion: Story = {
  decorators: [backend('admin')],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Inicia sesión' })).toBeVisible();
  },
};

// Con el usuario vacío, `submit()` no envía el login y muestra el aviso del campo.
export const LoginInvalido: Story = {
  decorators: [backend('admin')],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText('Usuario'));
    await userEvent.click(canvas.getByRole('button', { name: 'Iniciar sesión' }));
    await expect(await canvas.findByText('Escribe el usuario.')).toBeVisible();
  },
};

export const AdministradorConListado: Story = {
  decorators: [backend('admin')],
  play: async ({ canvasElement }) => {
    const canvas = await entrar(canvasElement);
    await expect(await canvas.findByText('Ana López')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Nuevo usuario' })).toBeVisible();
    await expect(canvas.getByText('Página 1 de 3')).toBeVisible();
  },
};

export const AlumnoSoloLectura: Story = {
  decorators: [backend('student')],
  play: async ({ canvasElement }) => {
    const canvas = await entrar(canvasElement);
    await expect(await canvas.findByText(/solo permite consultar/)).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Nuevo usuario' })).toBeNull();
  },
};

export const ModalDeNuevoUsuario: Story = {
  decorators: [backend('admin')],
  play: async ({ canvasElement }) => {
    const canvas = await entrar(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Nuevo usuario' }));
    await expect(await canvas.findByRole('dialog', { name: 'Nuevo usuario' })).toBeVisible();
  },
};

// Los avisos del esquema aparecen junto a cada campo al intentar enviar un formulario inválido.
export const AltaInvalida: Story = {
  decorators: [backend('admin')],
  play: async ({ canvasElement }) => {
    const canvas = await entrar(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Nuevo usuario' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Crear usuario' }));
    await expect(await canvas.findByText('El nombre es obligatorio.')).toBeVisible();
    await expect(canvas.getByText('El email es obligatorio.')).toBeVisible();
  },
};

// El 409 del servidor llega por la acción de `submit()` y se pinta junto al campo, como un error más.
export const EmailYaEnUso: Story = {
  decorators: [
    backend('admin', [
      {
        metodo: 'POST',
        url: '/api/usuarios',
        status: 409,
        cuerpo: { message: 'Ya existe un usuario con ese email.', errores: { email: 'Ese email ya está en uso.' } },
      },
    ]),
  ],
  play: async ({ canvasElement }) => {
    const canvas = await entrar(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Nuevo usuario' }));
    await userEvent.type(await canvas.findByLabelText('Nombre'), 'Eva');
    await userEvent.type(canvas.getByLabelText('Email'), 'ana@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Crear usuario' }));
    await expect(await canvas.findByText('Ese email ya está en uso.')).toBeVisible();
  },
};

export const ListaVacia: Story = {
  decorators: [backend('admin', [{ url: '/api/usuarios', cuerpo: { items: [], total: 0, page: 1, size: 5 } }])],
  play: async ({ canvasElement }) => {
    const canvas = await entrar(canvasElement);
    await expect(await canvas.findByText('No hay usuarios todavía.')).toBeVisible();
  },
};

export const ErrorDelServidor: Story = {
  decorators: [backend('admin', [{ url: '/api/usuarios', status: 500 }])],
  play: async ({ canvasElement }) => {
    const canvas = await entrar(canvasElement);
    await expect(await canvas.findByRole('alert')).toHaveTextContent('El servidor ha fallado');
  },
};
