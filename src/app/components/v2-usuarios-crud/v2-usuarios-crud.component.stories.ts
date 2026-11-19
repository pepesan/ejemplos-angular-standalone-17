import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { interceptorMock, type RutaMock } from '../../testing/http-mock';
import { V2UsuariosCrudComponent } from './v2-usuarios-crud.component';

const meta: Meta<V2UsuariosCrudComponent> = {
  title: 'V2/Servicios HTTP/CRUD de usuarios',
  component: V2UsuariosCrudComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2UsuariosCrudComponent>;

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
            // Las rutas extra van primero: `interceptorMock` usa la primera que coincide, así pueden sobrescribir las de por defecto.
            ...extra,
            { metodo: 'POST', url: '/auth/login', cuerpo: { tokenType: 'Bearer', accessToken: 'jwt-falso', expiresInSeconds: 900 } },
            { url: '/auth/profile', cuerpo: { id: 'x', name: 'Persona de ejemplo', role } },
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

// Backend apagado: el login falla sin respuesta (status 0) y la pantalla explica cómo arrancarlo.
export const BackendApagado: Story = {
  decorators: [backend('admin', [{ metodo: 'POST', url: '/auth/login', status: 0 }])],
  play: async ({ canvasElement }) => {
    const canvas = await entrar(canvasElement);
    await expect(await canvas.findByText('No hay conexión con el backend.')).toBeVisible();
    await expect(canvas.queryByText(/incorrectos/)).toBeNull();
  },
};
