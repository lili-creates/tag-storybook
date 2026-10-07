import { useTokenValue } from './useTokenValue';

function Row({ name }: { name: string }) {
  const value = useTokenValue(name);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 64px 1fr', gap: 16, alignItems: 'center', padding: '8px 0', borderTop: '1px solid rgba(128,128,128,.25)' }}>
      <code style={{ fontSize: 12 }}>{name}</code>
      <span style={{ fontSize: 12, opacity: 0.7 }}>{value}</span>
      <span aria-hidden="true" style={{ height: 16, width: `var(${name})`, background: '#eb006e', borderRadius: 2 }} />
    </div>
  );
}

/** Espaciado (barra con el ancho del token). Sirve también para radios con `kind="radius"`. */
export function SpaceScale({ tokens, kind = 'space' }: { tokens: string[]; kind?: 'space' | 'radius' }) {
  if (kind === 'radius') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {tokens.map((name) => (
          <div key={name} style={{ display: 'grid', gap: 8, justifyItems: 'center', fontSize: 12 }}>
            <span aria-hidden="true" style={{ width: 72, height: 72, background: 'rgba(128,128,128,.25)', border: '1px solid rgba(128,128,128,.6)', borderRadius: `var(${name})` }} />
            <code>{name}</code>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      {tokens.map((name) => (
        <Row key={name} name={name} />
      ))}
    </div>
  );
}
