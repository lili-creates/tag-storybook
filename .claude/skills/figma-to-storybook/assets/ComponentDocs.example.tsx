import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { Tag, type TagStatus } from './Tag';

/** Componentes auxiliares solo para la documentación (Tag.mdx). */

const STATUSES: TagStatus[] = ['info', 'success', 'warning', 'error', 'neutral'];

const TOKENS: Record<TagStatus, { bg: string; fg: string }> = {
  info: {
    bg: '--semantic-background-signal-info-subtle-default',
    fg: '--semantic-content-signal-info-on-subtle',
  },
  success: {
    bg: '--semantic-background-signal-success-subtle-default',
    fg: '--semantic-content-signal-success-on-subtle',
  },
  warning: {
    bg: '--semantic-background-signal-warning-subtle-default',
    fg: '--semantic-content-signal-warning-on-subtle',
  },
  error: {
    bg: '--semantic-background-signal-error-subtle-default',
    fg: '--semantic-content-signal-error-on-subtle',
  },
  neutral: {
    bg: '--semantic-background-neutral-subtle-default',
    fg: '--semantic-content-default-subtle',
  },
};

const cell = { color: 'inherit', padding: '12px 16px', borderTop: '1px solid rgba(128,128,128,.25)', verticalAlign: 'middle' } as const;
const head = { ...cell, borderTop: 0, textAlign: 'left', font: '600 13px Figtree, sans-serif', opacity: 0.75 } as const;
const code = { fontSize: 12 } as const;

type Mode = 'light' | 'dark';

const currentTheme = (): Mode =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/**
 * Fila «Background / Text / Icon»: nombre del token semántico y una muestra de su color en el modo activo.
 * NO se muestra el valor (hex): el token semántico apunta a un primitivo y se usa siempre por su nombre;
 * enseñar el hex invitaría a copiarlo a mano.
 */
function TokenLine({ label, name }: { label: string; name: string }) {
  return (
    <span style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span
          aria-hidden="true"
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            flex: 'none',
            background: `var(${name})`,
            boxShadow: 'inset 0 0 0 1px rgba(128,128,128,.5)',
          }}
        />
        <code style={code}>var({name})</code>
      </span>
    </span>
  );
}

/**
 * Matriz de variantes con sus tokens (Figma · 03 Tokens de color). Los tokens son los mismos en los dos
 * modos y solo cambian sus valores, así que hay UNA matriz con un interruptor Claro / Oscuro. Arranca en el
 * modo activo de Storybook y lo sigue si se cambia el selector Tema de la barra. Se muestran los nombres de los
 * tokens semánticos y una muestra de color, no los valores.
 */
export function TokenMatrix() {
  const [mode, setMode] = useState<Mode>(currentTheme);
  // tema de la PÁGINA (selector Tema de Storybook): el interruptor se pinta según él, no según la matriz
  const [page, setPage] = useState<Mode>(currentTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMode(currentTheme());
      setPage(currentTheme());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const option = (value: Mode, text: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={mode === value}
      onClick={() => setMode(value)}
      style={{
        padding: '6px 16px',
        border: 0,
        borderRadius: 6,
        cursor: 'pointer',
        font: '600 13px Figtree, sans-serif',
        background: mode === value ? (page === 'dark' ? '#e5e5e5' : '#1e1c1a') : 'transparent',
        color: mode === value ? (page === 'dark' ? '#1e1c1a' : '#ffffff') : 'inherit',
        opacity: mode === value ? 1 : 0.75,
      }}
    >
      {text}
    </button>
  );

  return (
    <div style={{ margin: '24px 0 40px' }}>
      <div
        role="radiogroup"
        aria-label="Modo de color de la matriz"
        style={{
          display: 'inline-flex',
          gap: 4,
          padding: 4,
          marginBottom: 16,
          borderRadius: 8,
          background: 'rgba(128,128,128,.18)',
        }}
      >
        {option('light', 'Modo claro')}
        {option('dark', 'Modo oscuro')}
      </div>
      <div
        data-theme={mode}
        style={{
          overflowX: 'auto',
          borderRadius: 8,
          border: '1px solid rgba(128,128,128,.3)',
          background: mode === 'dark' ? '#1e1c1a' : '#ffffff',
          color: mode === 'dark' ? '#e5e5e5' : '#1e1c1a',
        }}
      >
        <table style={{ borderCollapse: 'collapse', width: '100%', margin: 0, background: 'transparent', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '19%' }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th style={head}>status</th>
              <th style={head}>size=small</th>
              <th style={head}>size=default</th>
              <th style={head}>Variables</th>
            </tr>
          </thead>
          <tbody>
            {STATUSES.map((status) => (
              <tr key={status} style={{ background: 'transparent' }}>
                <td style={{ ...cell, fontWeight: 600 }}>{status}</td>
                <td style={cell}>
                  <Tag size="small" status={status} label="label" text="text" />
                </td>
                <td style={cell}>
                  <Tag size="default" status={status} label="label" text="text" />
                </td>
                <td style={cell}>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <TokenLine label="Background" name={TOKENS[status].bg} />
                    <TokenLine label="Text" name={TOKENS[status].fg} />
                    <TokenLine label="Icon" name={TOKENS[status].fg} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type TokenKind = 'space' | 'text';

interface TokenRow {
  label: string;
  small: string;
  default: string;
  /** `space` dibuja además una barra con el valor; `text` solo muestra el valor resuelto. */
  kind?: TokenKind;
}

interface TokenGroup {
  title: string;
  /** Estilo de Figma al que corresponde el grupo (p. ej. Label/s/Bold · Label/m/Bold). */
  styles?: { small: string; default: string };
  rows: TokenRow[];
}

const SPACING: TokenGroup = {
  title: 'Espaciado y radio',
  rows: [
    { label: 'Padding vertical', small: '--space-xs', default: '--space-md', kind: 'space' },
    { label: 'Padding horizontal', small: '--space-md', default: '--space-lg', kind: 'space' },
    { label: 'Gap icono–Label', small: '--space-xs', default: '--space-xs', kind: 'space' },
    { label: 'Gap grupo–Text', small: '--space-md', default: '--space-md', kind: 'space' },
    { label: 'Radio', small: '--radius-semantic-xs', default: '--radius-semantic-xs', kind: 'space' },
  ],
};

const typeGroup = (title: string, prefix: 'label' | 'body', weight: string, styles: TokenGroup['styles']): TokenGroup => ({
  title,
  styles,
  rows: [
    { label: 'Familia', small: `--${prefix}-s-font-family`, default: `--${prefix}-m-font-family`, kind: 'text' },
    { label: 'Tamaño', small: `--${prefix}-s-font-size`, default: `--${prefix}-m-font-size`, kind: 'text' },
    { label: 'Interlineado', small: `--${prefix}-s-line-height`, default: `--${prefix}-m-line-height`, kind: 'text' },
    { label: 'Tracking', small: `--${prefix}-s-letter-spacing`, default: `--${prefix}-m-letter-spacing`, kind: 'text' },
    { label: 'Peso', small: weight, default: weight, kind: 'text' },
  ],
});

const LABEL = typeGroup('Label', 'label', '--font-weight-bold', { small: 'Label/s/Bold', default: 'Label/m/Bold' });
const TEXT = typeGroup('Text', 'body', '--font-weight-regular', { small: 'Body/s/Regular', default: 'Body/m/Regular' });

/** Un token: nombre + valor resuelto en el modo activo (y barra proporcional para espaciados). */
function TokenValue({ name, kind }: { name: string; kind?: TokenKind }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState('');
  useLayoutEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(name).trim());
  }, [name]);
  const shown = value.replace(/^'?"?([^,'"]+).*$/, name.includes('font-family') ? '$1' : '$&');
  const px = parseFloat(value);
  return (
    <span ref={ref} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 12px', minWidth: 0 }}>
      <code style={{ ...code, wordBreak: 'break-word' }}>var({name})</code>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: 0.85 }}>
        {kind === 'space' && Number.isFinite(px) && (
          <span
            aria-hidden="true"
            style={{ width: Math.max(px, 2) * 2, height: 8, borderRadius: 2, background: 'rgba(128,128,128,.55)', flex: 'none' }}
          />
        )}
        <span>{shown || '—'}</span>
      </span>
    </span>
  );
}

function TokenCard({ group }: { group: TokenGroup }) {
  const cols = 'minmax(120px, 0.8fr) minmax(0, 1.1fr) minmax(0, 1.1fr)';
  const cell = { padding: '10px 0', borderTop: '1px solid rgba(128,128,128,.22)' } as const;
  return (
    <section
      style={{ border: '1px solid rgba(128,128,128,.3)', borderRadius: 12, padding: '20px 24px', overflowX: 'auto' }}
    >
      <div style={{ minWidth: 520 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 16px', marginBottom: 12 }}>
          <strong style={{ font: '700 12px/1.2 Figtree, sans-serif', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {group.title}
          </strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, columnGap: 24, alignItems: 'start' }}>
          <span />
          <strong style={{ font: '600 13px Figtree, sans-serif', opacity: 0.75, paddingBottom: 8 }}>
            small{group.styles && <span style={{ fontWeight: 400 }}> · {group.styles.small}</span>}
          </strong>
          <strong style={{ font: '600 13px Figtree, sans-serif', opacity: 0.75, paddingBottom: 8 }}>
            default{group.styles && <span style={{ fontWeight: 400 }}> · {group.styles.default}</span>}
          </strong>
          {group.rows.map((r) => (
            <div key={r.label} style={{ display: 'contents' }}>
              <span style={{ ...cell, fontWeight: 600, fontSize: 14 }}>{r.label}</span>
              <div style={cell}>
                <TokenValue name={r.small} kind={r.kind} />
              </div>
              <div style={cell}>
                <TokenValue name={r.default} kind={r.kind} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Medidas que no tienen token (Figma · 04 Otros tokens). */
function UntokenizedCard() {
  const rows: [string, string, string][] = [
    ['Icono', '16 × 16 px, sin token de tamaño.', '16 × 16 px, sin token de tamaño.'],
    ['Altura resultante', '24 px (padding + línea).', '36 px (padding + línea).'],
    ['Ancho y alto', 'ajustados al contenido (HUG).', 'ajustados al contenido (HUG).'],
  ];
  const cell = { padding: '12px 0', borderTop: '1px solid rgba(128,128,128,.22)', fontSize: 14 } as const;
  return (
    <section style={{ border: '1px solid rgba(128,128,128,.3)', borderRadius: 12, padding: '20px 24px', overflowX: 'auto' }}>
      <div style={{ minWidth: 520 }}>
        <strong style={{ display: 'block', marginBottom: 12, font: '700 12px/1.2 Figtree, sans-serif', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          Medidas no tokenizadas
        </strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 0.8fr) minmax(0, 1.1fr) minmax(0, 1.1fr)', columnGap: 24 }}>
          <span />
          <strong style={{ font: '600 13px Figtree, sans-serif', opacity: 0.75, paddingBottom: 8 }}>small</strong>
          <strong style={{ font: '600 13px Figtree, sans-serif', opacity: 0.75, paddingBottom: 8 }}>default</strong>
          {rows.map(([label, small, def]) => (
            <div key={label} style={{ display: 'contents' }}>
              <span style={{ ...cell, fontWeight: 600 }}>{label}</span>
              <span style={cell}>{small}</span>
              <span style={cell}>{def}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Otros tokens (Figma · 04): una tarjeta por tema con `small` y `default` en columnas paralelas. Junto a cada
 * token se muestra el valor que resuelve en tokens.css.
 */
export function OtherTokens() {
  return (
    <div style={{ display: 'grid', gap: 24, margin: '24px 0 40px' }}>
      <TokenCard group={SPACING} />
      <TokenCard group={LABEL} />
      <TokenCard group={TEXT} />
      <UntokenizedCard />
    </div>
  );
}

/** Enlace interno a un título de la página (scroll suave; sin animación si el usuario pide reducir movimiento). */
function SectionLink({ id, children }: { id: string; children: ReactNode }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (!target) return; // si el id no existe, se deja el comportamiento normal del enlace
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };
  return (
    <a href={`#${id}`} onClick={onClick} style={{ fontSize: 13, fontWeight: 600, textUnderlineOffset: 3 }}>
      {children}
    </a>
  );
}

/** Resumen «en un vistazo»: cuatro respuestas rápidas con enlaces a las secciones de las que salen. */
export function AtAGlance({
  items,
}: {
  items: { title: string; text: ReactNode; refs?: { label: string; id: string }[] }[];
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        margin: '24px 0 8px',
      }}
    >
      {items.map((item) => (
        <div
          key={item.title}
          style={{
            display: 'grid',
            gap: 8,
            alignContent: 'start',
            padding: 20,
            borderRadius: 12,
            border: '1px solid rgba(128,128,128,.3)',
            background: 'rgba(128,128,128,.06)',
          }}
        >
          <strong style={{ font: '700 12px/1.2 Figtree, sans-serif', letterSpacing: '.06em', textTransform: 'uppercase', opacity: 0.75 }}>
            {item.title}
          </strong>
          <span style={{ fontSize: 15, lineHeight: 1.55 }}>{item.text}</span>
          {item.refs && (
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
              {item.refs.map((r) => (
                <SectionLink key={r.id} id={r.id}>
                  {r.label} →
                </SectionLink>
              ))}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Contraejemplo: una tag con cierre. La tag no admite acciones (Figma · 07 Cómo se usa la tag). */
export function TagWithCloseExample() {
  return (
    <span className="ds-tag ds-tag--default ds-tag--success" aria-hidden="true">
      <span className="ds-tag__group">
        <span className="ds-tag__label">Estado del pedido</span>
      </span>
      <span className="ds-tag__text">Confirmado</span>
      <span style={{ marginLeft: 4, fontWeight: 700 }}>✕</span>
    </span>
  );
}

/** Contraejemplo: texto largo forzado a fill, con salto de línea (la tag es siempre hug y de una línea). */
export function TagWrappedExample() {
  return (
    <span
      className="ds-tag ds-tag--default ds-tag--warning"
      aria-hidden="true"
      style={{ whiteSpace: 'normal', alignItems: 'flex-start', width: '100%', maxWidth: 260 }}
    >
      <span className="ds-tag__group">
        <span className="ds-tag__label">Aduana</span>
      </span>
      <span className="ds-tag__text">Retenido a la espera de documentación adicional del transportista</span>
    </span>
  );
}

export interface DoDontItem {
  /** Ejemplo visual. */
  example: ReactNode;
  /** Qué se hace bien / qué está mal. */
  text: ReactNode;
}

/**
 * Bloques Do / Don't (Figma · 07 Cómo se usa la tag). Sobrios: fondo neutro, borde fino y título del color del
 * estado. Cada fila empareja la explicación con su ejemplo (uno junto al otro) y las filas de un bloque van una
 * debajo de otra. En pantallas estrechas, el ejemplo pasa bajo su explicación.
 */
export function DoDont({ doItems, dontItems }: { doItems: DoDontItem[]; dontItems: DoDontItem[] }) {
  const tone = (token: string) => ({
    border: `1px solid color-mix(in srgb, var(${token}) 55%, transparent)`,
    title: `var(${token})`,
  });
  const ok = tone('--semantic-content-signal-success-on-subtle');
  const ko = tone('--semantic-content-signal-error-on-subtle');

  const block = (title: string, t: { border: string; title: string }, items: DoDontItem[]) => (
    <section
      style={{
        padding: 24,
        borderRadius: 12,
        border: t.border,
        background: 'rgba(128,128,128,.05)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 8, font: '500 24px/30px Figtree, sans-serif', color: t.title }}>
        {title}
      </strong>
      <div style={{ display: 'grid' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px 24px',
              alignItems: 'center',
              padding: '16px 0',
              borderTop: i === 0 ? 0 : '1px solid rgba(128,128,128,.25)',
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1.55 }}>{item.text}</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: 16,
                borderRadius: 8,
                background: 'rgba(128,128,128,.08)',
                overflowX: 'auto',
              }}
            >
              {item.example}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div style={{ display: 'grid', gap: 24, margin: '24px 0 40px' }}>
      {block('Do', ok, doItems)}
      {block('Don’t', ko, dontItems)}
    </div>
  );
}
