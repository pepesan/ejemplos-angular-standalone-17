import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { interceptorMock, type RutaMock } from '../../testing/http-mock';
import { V2UsuariosLoginComponent } from './v2-usuarios-login.component';

const meta: Meta<V2UsuariosLoginComponent> = {
  title: 'V2/Usuarios con navegación/Login',
  component: V2UsuariosLoginComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2UsuariosLoginComponent>;

const entorno = (rutas: RutaMock[] = []) =>
  applicationConfig({ providers: [provideRouter([]), provideHttpClient(withInterceptors([interceptorMock(rutas)]))] });

export const Inicial: Story = {
  decorators: [entorno()],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Inicia sesión' })).toBeVisible();
  },
};

// Con el usuario vacío, `submit()` no envía el login y muestra el aviso del campo.
export const Invalido: Story = {
  decorators: [entorno()],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.clear(canvas.getByLabelText('Usuario'));
    await userEvent.click(canvas.getByRole('button', { name: 'Iniciar sesión' }));
    await expect(await canvas.findByText('Escribe el usuario.')).toBeVisible();
  },
};

export const CredencialesIncorrectas: Story = {
  decorators: [entorno([{ metodo: 'POST', url: '/auth/login', status: 401 }])],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Iniciar sesión' }));
    await expect(await canvas.findByText('Usuario o contraseña incorrectos.')).toBeVisible();
  },
};

// Backend apagado: el login falla sin respuesta y la pantalla explica cómo arrancarlo (sin acusar al usuario).
export const BackendApagado: Story = {
  decorators: [entorno([{ metodo: 'POST', url: '/auth/login', status: 0 }])],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Iniciar sesión' }));
    await expect(await canvas.findByText('No hay conexión con el backend.')).toBeVisible();
    await expect(canvas.queryByText(/incorrectos/)).toBeNull();
  },
};
