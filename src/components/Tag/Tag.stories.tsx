import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, type TagSize, type TagStatus } from './Tag';

const STATUSES: TagStatus[] = ['info', 'success', 'warning', 'error', 'neutral'];
const SIZES: TagSize[] = ['small', 'default'];

const meta = {
  title: 'Componentes/Tag',
  component: Tag,
  args: {
    size: 'small',
    status: 'info',
    label: 'label',
    text: 'text',
    showLabelGroup: true,
    showIcon: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    status: { control: 'select', options: STATUSES },
    icon: { control: false },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Estados: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      {STATUSES.map((status) => (
        <Tag key={status} {...args} status={status} />
      ))}
    </div>
  ),
};

export const Tamaños: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      {SIZES.map((size) => (
        <Tag key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Small: Story = { args: { size: 'small' } };

export const SinIcono: Story = { args: { showIcon: false } };

export const SoloTexto: Story = {
  name: 'Sin label (solo Text)',
  args: { showLabelGroup: false, text: 'En tránsito' },
};

export const IconoNeutralPersonalizado: Story = {
  name: 'Neutral con icono sustituido',
  args: {
    status: 'neutral',
    label: 'Refrigerado',
    text: 'Cadena de frío',
    icon: <i className="ph ph-snowflake" />,
  },
};

export const Combinaciones: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Tag {...args} label="Estado del pedido" text="Confirmado" status="success" />
      <Tag {...args} label="Estado del pedido" text="Confirmado" status="success" showIcon={false} />
      <Tag {...args} text="Confirmado" status="success" showLabelGroup={false} />
    </div>
  ),
};

export const MatrizDeVariantes: Story = {
  name: 'Matriz de variantes',
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: 16, alignItems: 'center', justifyItems: 'start' }}>
      <strong style={{ font: '500 14px Figtree, sans-serif' }}>status</strong>
      {SIZES.map((s) => (
        <strong key={s} style={{ font: '500 14px Figtree, sans-serif' }}>size={s}</strong>
      ))}
      {STATUSES.map((status) => (
        <div key={status} style={{ display: 'contents' }}>
          <span style={{ font: '500 14px Figtree, sans-serif' }}>{status}</span>
          {SIZES.map((size) => (
            <Tag key={size} {...args} size={size} status={status} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const EjemplosDeUso: Story = {
  name: 'Ejemplos de uso',
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
