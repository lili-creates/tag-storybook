import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, type TagSize, type TagStatus } from './Tag';

const STATUSES: TagStatus[] = ['info', 'success', 'warning', 'error', 'neutral'];
const SIZES: TagSize[] = ['small', 'default'];

/** Solo se ven dentro de la página de documentación (no salen en el menú lateral). */
const docsOnly = ['!dev'];

const meta = {
  title: 'Componentes/Tag',
  component: Tag,
  args: {
    size: 'default',
    status: 'info',
    label: 'label',
    text: 'text',
    showLabelGroup: true,
    showIcon: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    status: { control: 'select', options: STATUSES },
    // Dependencias del Figma: el icono solo se sustituye en neutral; Show icon vive dentro del label group
    icon: { control: false, if: { arg: 'status', eq: 'neutral' } },
    showIcon: { if: { arg: 'showLabelGroup' } },
    label: { if: { arg: 'showLabelGroup' } },
    // Vía de escape de código, no es una propiedad de diseño del Figma: fuera de la tabla de controles
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const IconoNeutralPersonalizado: Story = {
  name: 'Neutral con icono sustituido',
  args: {
    status: 'neutral',
    label: 'Refrigerado',
    text: 'Cadena de frío',
    icon: <i className="ph ph-snowflake" />,
  },
  tags: docsOnly,
};

export const Combinaciones: Story = {
  tags: docsOnly,
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Tag {...args} label="Estado del pedido" text="Confirmado" status="success" />
      <Tag {...args} label="Estado del pedido" text="Confirmado" status="success" showIcon={false} />
      <Tag {...args} text="Confirmado" status="success" showLabelGroup={false} />
    </div>
  ),
};

export const EjemplosDeUso: Story = {
  name: 'Ejemplos de uso',
  tags: docsOnly,
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, font: '400 14px Figtree, sans-serif' }}>
      <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
        <span style={{ font: '500 14px Figtree, sans-serif', opacity: 0.7 }}>DETALLE DEL PEDIDO</span>
        <span style={{ font: '700 40px/48px Figtree, sans-serif' }}>Pedido #1048</span>
        <Tag size="default" status="success" label="Estado del pedido" text="Confirmado" />
      </div>
      <span aria-hidden="true" style={{ alignSelf: 'stretch', borderLeft: '1px solid rgba(128,128,128,.3)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
        <span style={{ fontWeight: 500 }}>Lámpara de mesa Alba</span>
        <Tag size="small" status="warning" label="Stock" text="Últimas unidades" />
      </div>
    </div>
  ),
};
