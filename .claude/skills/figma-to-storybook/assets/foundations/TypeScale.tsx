import { useTokenValue } from './useTokenValue';

export interface TypeStyle {
  /** Prefijo de los tokens, p. ej. `label-m` -> --label-m-font-size, --label-m-line-height… */
  token: string;
  /** Peso: nombre de la variable de peso, p. ej. `--font-weight-bold`. */
  weight: string;
  sample?: string;
}

function Row({ token, weight, sample = 'Texto de ejemplo' }: TypeStyle) {
  const size = useTokenValue(`--${token}-font-size`);
  const lh = useTokenValue(`--${token}-line-height`);
  const family = useTokenValue(`--${token}-font-family`);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'baseline', padding: '12px 0', borderTop: '1px solid rgba(128,128,128,.25)' }}>
      <span style={{ fontSize: 12 }}>
        <code>{token}</code>
        <br />
        <span style={{ opacity: 0.7 }}>{[size, lh && `/ ${lh}`].filter(Boolean).join(' ')}</span>
      </span>
      <span
        style={{
          fontFamily: `var(--${token}-font-family, ${family})`,
          fontSize: `var(--${token}-font-size)`,
          lineHeight: `var(--${token}-line-height)`,
          letterSpacing: `var(--${token}-letter-spacing, 0)`,
          fontWeight: `var(${weight})` as unknown as number,
        }}
      >
        {sample}
      </span>
    </div>
  );
}

/** Escala tipográfica a partir de tokens `--<estilo>-font-size|line-height|letter-spacing|font-family`. */
export function TypeScale({ styles }: { styles: TypeStyle[] }) {
  return (
    <div>
      {styles.map((s) => (
        <Row key={s.token} {...s} />
      ))}
    </div>
  );
}
