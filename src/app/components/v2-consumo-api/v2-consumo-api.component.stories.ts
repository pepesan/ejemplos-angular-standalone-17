import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular-vite';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { expect, within } from 'storybook/test';
import { V2ConsumoApiComponent } from './v2-consumo-api.component';

const meta: Meta<V2ConsumoApiComponent> = {
  title: 'Componentes/components/v2-consumo-api/V2ConsumoApiComponent',
  component: V2ConsumoApiComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<V2ConsumoApiComponent>;

export const Predeterminado: Story = {};

// Backend apagado: el proxy de `ng serve` responde 502 y el ejemplo explica cómo arrancarlo.
export const BackendApagado: Story = {
  decorators: [
    applicationConfig({
      providers: [provideHttpClient(withInterceptors([(req) => throwError(() => new HttpErrorResponse({ status: 502, url: req.url }))]))],
    }),
  ],
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText(/npm run backend/)).toBeVisible();
  },
};
