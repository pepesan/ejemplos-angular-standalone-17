import type { Meta, StoryObj } from '@storybook/angular-vite';
import { EnunciadoComponent } from './enunciado.component';

const meta: Meta<EnunciadoComponent> = {
  title: 'Componentes/ejercicios/enunciado/EnunciadoComponent',
  component: EnunciadoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<EnunciadoComponent>;

export const EnunciadoYSolucion: Story = {
  args: { titulo: 'Ejercicio de servicios' },
  render: (args) => ({
    props: args,
    template: `
      <app-enunciado [titulo]="titulo">
        <p>Crea un servicio con una cadena y un método que devuelva un número.</p>
        <div solucion><h3>Cadena: MiCadena</h3><h3>Número: 2</h3></div>
      </app-enunciado>
    `,
  }),
};
