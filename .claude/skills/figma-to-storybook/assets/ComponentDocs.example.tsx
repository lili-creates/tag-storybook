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

/** Fila «Background / Text / Icon»: nombre del token, muestra y valor resuelto en el modo activo. */
function TokenLine({ label, name, mode }: { label: string; name: string; mode: Mode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState('');
  useLayoutEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(name).trim());
  }, [name, mode]);
  return (
    <span ref={ref} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8, alignItems: 'baseline' }}>
      <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>{label}</span>
      <span style={{ display: 'grid', gap: 4 }}>
        <code style={code}>var({name})</code>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, opacity: 0.8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: `var(${name})`,
              boxShadow: 'inset 0 0 0 1px rgba(128,128,128,.5)',
            }}
          />
          {value}
        </span>
      </span>
    </span>
  );
}

/**
 * Matriz de variantes con sus tokens (Figma · 03 Tokens de color). Los tokens son los mismos en los dos
 * modos y solo cambian sus valores, así que hay UNA matriz con un interruptor Claro / Oscuro. Arranca en el
 * modo activo de Storybook y lo sigue si se cambia el selector Tema de la barra.
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
                    <TokenLine label="Background" name={TOKENS[status].bg} mode={mode} />
                    <TokenLine label="Text" name={TOKENS[status].fg} mode={mode} />
                    <TokenLine label="Icon" name={TOKENS[status].fg} mode={mode} />
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
    <span className="ds-tag ds-tag--small ds-tag--success" aria-hidden="true">
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
      className="ds-tag ds-tag--small ds-tag--warning"
      aria-hidden="true"
      style={{ whiteSpace: 'normal', alignItems: 'flex-start', width: '100%', maxWidth: 220 }}
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
 * estado. Cada ejemplo va emparejado con su explicación y los ejemplos de un mismo bloque se colocan uno al lado
 * del otro (se apilan solo en pantallas estrechas).
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
      <strong style={{ display: 'block', marginBottom: 16, font: '500 24px/30px Figtree, sans-serif', color: t.title }}>
        {title}
      </strong>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {items.map((item, i) => (
          <div key={i} style={{ minWidth: 0, display: 'grid', gap: 12, alignContent: 'start' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: 12,
                borderRadius: 8,
                background: 'rgba(128,128,128,.08)',
                overflowX: 'auto',
              }}
            >
              {item.example}
            </div>
            <span style={{ fontSize: 15, lineHeight: 1.55 }}>{item.text}</span>
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
