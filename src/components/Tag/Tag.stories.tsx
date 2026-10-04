import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, type TagSize, type TagStatus } from './Tag';

const STATUSES: TagStatus[] = ['info', 'success', 'warning', 'error', 'neutral'];
const SIZES: TagSize[] = ['small', 'default'];

const meta = {
  title: 'Componentes/Tag',
  component: Tag,
  args: {
    size: 'default',
    status: 'info',
    label: 'Label',
    text: 'Description',
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

export const IconoNeutralPersonalizado: Story = {
  name: 'Neutral con icono sustituido',
  args: {
    status: 'neutral',
    label: 'Refrigerado',
    text: 'Cadena de frío',
    icon: <i className="ph ph-snowflake" />,
  },
};

export const TextoTruncado: Story = {
  name: 'Text truncado',
  args: {
    status: 'warning',
    label: 'Aduana',
    text: 'Retenido en aduana a la espera de documentación adicional del transportista',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
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
    <div style={{ display: 'grid', gap: 16, width: 420, font: '400 14px Figtree, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ font: '700 24px Figtree, sans-serif' }}>Pedido #1048</div>
          <div>Entrega prevista · 6 de octubre</div>
        </div>
        <Tag status="success" label="Estado del pedido" text="Confirmado" />
      </div>
      <hr style={{ width: '100%', border: 0, borderTop: '1px solid rgba(128,128,128,.3)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 500 }}>Lámpara de mesa Alba</span>
        <Tag size="small" status="warning" label="Stock" text="Últimas unidades" />
      </div>
    </div>
  ),
};
