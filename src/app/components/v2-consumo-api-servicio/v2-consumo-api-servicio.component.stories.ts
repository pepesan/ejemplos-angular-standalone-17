import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { ResultadosApiService } from './resultados-api.service';
import { V2ConsumoApiServicioComponent } from './v2-consumo-api-servicio.component';

const servicio = (obtener: () => unknown) => ({ moduleMetadata: { providers: [{ provide: ResultadosApiService, useValue: { obtener } }] } });

const meta: Meta<V2ConsumoApiServicioComponent> = {
  title: 'Componentes/components/v2-consumo-api-servicio/V2ConsumoApiServicioComponent',
  component: V2ConsumoApiServicioComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2ConsumoApiServicioComponent>;

// El servicio se sustituye por uno falso: es la ventaja de separar el acceso a datos del componente.
export const ConResultados: Story = {
  render: () => servicio(() => of([{ nombre: 'Angular', dipu: 8, imagen: '' }, { nombre: 'RxJS', dipu: 3, imagen: '' }])),
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText(/Angular: 8 escaños/)).toBeVisible();
  },
};

export const Vacio: Story = { render: () => servicio(() => of([])) };

export const BackendApagado: Story = {
  render: () => servicio(() => throwError(() => new HttpErrorResponse({ status: 502 }))),
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText(/npm run backend/)).toBeVisible();
  },
};
