import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { interceptorMock, type RutaMock } from '../../testing/http-mock';
import { SesionUsuariosService } from './sesion-usuarios.service';
import { V2UsuariosListadoComponent } from './v2-usuarios-listado.component';

const meta: Meta<V2UsuariosListadoComponent> = {
  title: 'V2/Usuarios con navegación/Listado',
  component: V2UsuariosListadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2UsuariosListadoComponent>;

const items = [
  { id: 1, nombre: 'Ana López', email: 'ana@example.com', rol: 'profesor' },
  { id: 2, nombre: 'Luis Pérez', email: 'luis@example.com', rol: 'alumno' },
];

/** Sesión ya iniciada con el rol dado (la guarda de la ruta no interviene en una story) y API simulada. */
const entorno = (role: 'admin' | 'alumno', rutas: RutaMock[] = []) =>
  applicationConfig({
    providers: [
      provideRouter([]),
      provideAppInitializer(() => inject(SesionUsuariosService).perfil.set({ id: 'x', name: 'Persona de ejemplo', role })),
      provideHttpClient(withInterceptors([interceptorMock([...rutas, { url: '/api/usuarios', cuerpo: { items, total: 12, page: 1, size: 5 } }])])),
    ],
  });

export const AdminConDatos: Story = {
  decorators: [entorno('admin')],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Ana López')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Editar Ana López' })).toBeVisible();
    await expect(canvas.getByText('Página 1 de 3')).toBeVisible();
  },
};

export const AlumnoSoloLectura: Story = {
  decorators: [entorno('alumno')],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Ana López')).toBeVisible();
    await expect(canvas.getByText(/solo permite consultar/)).toBeVisible();
    await expect(canvas.queryByRole('link', { name: /Editar/ })).toBeNull();
  },
};

// `?denegado=1` lo añade `adminGuard`; en una story se pasa como input.
export const AccesoDenegado: Story = {
  decorators: [entorno('alumno')],
  args: { denegado: '1' },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText(/requiere el rol/)).toBeVisible();
  },
};

export const FiltroActivoSinResultados: Story = {
  decorators: [entorno('admin', [{ url: '/api/usuarios', cuerpo: { items: [], total: 0, page: 1, size: 5 } }])],
  args: { q: 'zzz' },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Ningún usuario coincide con «zzz».')).toBeVisible();
  },
};

export const ListaVacia: Story = {
  decorators: [entorno('admin', [{ url: '/api/usuarios', cuerpo: { items: [], total: 0, page: 1, size: 5 } }])],
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('No hay usuarios todavía.')).toBeVisible();
  },
};

export const ErrorDelServidor: Story = {
  decorators: [entorno('admin', [{ url: '/api/usuarios', status: 500 }])],
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('alert')).toHaveTextContent('El servidor ha fallado');
  },
};

export const BackendApagado: Story = {
  decorators: [entorno('admin', [{ url: '/api/usuarios', status: 502 }])],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('No hay conexión con el backend.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Reintentar' })).toBeVisible();
  },
};
