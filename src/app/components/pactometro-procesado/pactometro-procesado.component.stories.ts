import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { interceptorMock } from '../../testing/http-mock';
import { PactometroProcesadoComponent } from './pactometro-procesado.component';

const meta: Meta<PactometroProcesadoComponent> = {
  title: 'Componentes/components/pactometro-procesado/PactometroProcesadoComponent',
  component: PactometroProcesadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PactometroProcesadoComponent>;

const conRuta = (status: number, cuerpo?: unknown) =>
  applicationConfig({ providers: [provideHttpClient(withInterceptors([interceptorMock([{ url: 'resultados.json', status, cuerpo }])]))] });

export const OrdenadosConPorcentaje: Story = {
  decorators: [conRuta(200, [
    { nombre: 'B', dipu: 25, imagen: '' },
    { nombre: 'A', dipu: 75, imagen: '' },
    { nombre: 'Sin escaños', dipu: 0, imagen: '' },
  ])],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('75 %')).toBeVisible();
    await expect(canvas.queryByText('Sin escaños')).toBeNull();
  },
};

export const DatosDeRespaldoSiFalla: Story = {
  decorators: [conRuta(500)],
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole('alert')).toHaveTextContent('datos de respaldo');
  },
};
