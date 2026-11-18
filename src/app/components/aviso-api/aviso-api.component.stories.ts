import type { Meta, StoryObj } from '@storybook/angular-vite';
import { AvisoApiComponent } from './aviso-api.component';

const meta: Meta<AvisoApiComponent> = {
  title: 'Componentes/components/aviso-api/AvisoApiComponent',
  component: AvisoApiComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AvisoApiComponent>;

export const Moderno: Story = {
  args: { tipo: 'moderno', titulo: 'Estable desde Angular 19.' },
  render: (args) => ({ props: args, template: `<app-aviso-api [tipo]="tipo" [titulo]="titulo"><code>input()</code> sustituye a <code>@Input()</code>.</app-aviso-api>` }),
};

export const Legado: Story = {
  args: { tipo: 'legado', titulo: 'Enfoque clásico.', alternativa: '/signals-input', textoAlternativa: 'ver input()' },
  render: (args) => ({ props: args, template: `<app-aviso-api [tipo]="tipo" [titulo]="titulo" [alternativa]="alternativa" [textoAlternativa]="textoAlternativa">Usa <code>&#64;Input()</code>.</app-aviso-api>` }),
};
