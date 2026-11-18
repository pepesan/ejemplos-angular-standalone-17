import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { interceptorMock } from '../../testing/http-mock';
import { PactometroAvisosComponent } from './pactometro-avisos.component';

const meta: Meta<PactometroAvisosComponent> = {
  title: 'Componentes/components/pactometro-avisos/PactometroAvisosComponent',
  component: PactometroAvisosComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PactometroAvisosComponent>;

const conRuta = (status: number, cuerpo?: unknown) =>
  applicationConfig({ providers: [provideHttpClient(withInterceptors([interceptorMock([{ url: 'resultados.json', status, cuerpo }])]))] });

export const SinFallos: Story = {
  decorators: [conRuta(200, [{ nombre: 'PP', dipu: 137, imagen: '' }])],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('PP: 137')).toBeVisible();
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
};

export const ReintentosYDatosDeRespaldo: Story = {
  decorators: [conRuta(500)],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 3 peticiones con 500 ms de pausa entre ellas: tarda algo más de un segundo.
    await expect(await canvas.findByText(/datos de respaldo/, {}, { timeout: 8000 })).toBeVisible();
    await expect(canvas.getByText(/Reintento 1 de 2/)).toBeVisible();
    await expect(canvas.getByText(/Reintento 2 de 2/)).toBeVisible();
  },
};
