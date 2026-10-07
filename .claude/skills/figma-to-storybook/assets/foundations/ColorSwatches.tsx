import { useTokenValue } from './useTokenValue';

export interface ColorToken {
  /** Nombre de la variable CSS, p. ej. `--semantic-background-signal-info-subtle-default`. */
  name: string;
  /** Descripción de uso (opcional). */
  usage?: string;
}

function Swatch({ name, usage }: ColorToken) {
  const value = useTokenValue(name);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 12, alignItems: 'center' }}>
      <span
        aria-hidden="true"
        style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          background: `var(${name})`,
          // borde para que los tokens casi blancos/negros se vean sobre cualquier fondo
          boxShadow: 'inset 0 0 0 1px rgba(128,128,128,.35)',
        }}
      />
      <span style={{ display: 'grid', gap: 2, fontSize: 13, lineHeight: 1.4 }}>
        <code style={{ fontSize: 12 }}>{name}</code>
        <span style={{ opacity: 0.7 }}>{value || '—'}</span>
        {usage && <span>{usage}</span>}
      </span>
    </div>
  );
}

/** Rejilla de swatches. Muestra el valor del modo activo (cambia con el selector Tema). */
export function ColorSwatches({ tokens }: { tokens: ColorToken[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {tokens.map((t) => (
        <Swatch key={t.name} {...t} />
      ))}
    </div>
  );
}
