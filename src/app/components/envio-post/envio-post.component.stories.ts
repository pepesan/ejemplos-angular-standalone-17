import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { interceptorMock } from '../../testing/http-mock';
import { EnvioPostComponent } from './envio-post.component';

const meta: Meta<EnvioPostComponent> = {
  title: 'Componentes/components/envio-post/EnvioPostComponent',
  component: EnvioPostComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EnvioPostComponent>;

const cuerpo = { title: 'Hola', body: 'Mi primer POST desde Angular', userId: 1 };

export const Predeterminado: Story = {};

export const RespuestaCorrecta: Story = {
  decorators: [
    applicationConfig({
      providers: [provideHttpClient(withInterceptors([interceptorMock([{ metodo: 'POST', url: '/posts', status: 201, cuerpo: { ...cuerpo, id: 101 } }])]))],
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar POST' }));
    await expect(await canvas.findByText(/"id": 101/)).toBeVisible();
  },
};

export const ErrorAlEnviar: Story = {
  decorators: [
    applicationConfig({
      providers: [provideHttpClient(withInterceptors([interceptorMock([{ metodo: 'POST', url: '/posts', status: 500 }])]))],
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar POST' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('No se pudo enviar el POST.');
  },
};
