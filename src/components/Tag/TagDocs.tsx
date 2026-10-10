import type { ReactNode } from 'react';
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

const cell = { padding: '12px 16px', borderTop: '1px solid rgba(128,128,128,.25)', verticalAlign: 'middle' } as const;
const head = { ...cell, borderTop: 0, textAlign: 'left', font: '500 14px Figtree, sans-serif', opacity: 0.75 } as const;
const code = { fontSize: 12 } as const;

/**
 * Matriz de variantes con sus tokens (Figma · 03 Tokens de color). Con `dark` se fuerza el modo oscuro
 * solo dentro de la matriz, sin depender del selector Tema.
 */
export function TokenMatrix({ dark = false }: { dark?: boolean }) {
  return (
    <div
      {...(dark ? { 'data-theme': 'dark' } : {})}
      style={{
        overflowX: 'auto',
        borderRadius: 8,
        ...(dark ? { background: '#1e1c1a', color: '#e5e5e5' } : {}),
      }}
    >
      <table style={{ borderCollapse: 'collapse', width: '100%', margin: 0, background: 'transparent' }}>
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
                <div style={{ display: 'grid', gap: 4 }}>
                  <span>
                    Background <code style={code}>var({TOKENS[status].bg})</code>
                  </span>
                  <span>
                    Text <code style={code}>var({TOKENS[status].fg})</code>
                  </span>
                  <span>
                    Icon <code style={code}>var({TOKENS[status].fg})</code>
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Bloques Do / Don't (Figma · 07 Cómo se usa la tag). */
export function DoDont({ doItems, dontItems }: { doItems: ReactNode[]; dontItems: ReactNode[] }) {
  const box = (bg: string) =>
    ({
      flex: 1,
      padding: 24,
      borderRadius: 12,
      background: `var(${bg})`,
      color: 'var(--semantic-content-default-subtle)',
    }) as const;
  const list = { margin: '8px 0 0', paddingLeft: 24 } as const;
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', margin: '16px 0' }}>
      <div style={box('--semantic-background-signal-success-subtle-default')}>
        <strong style={{ font: '500 24px/30px Figtree, sans-serif' }}>Do</strong>
        <ul style={list}>
          {doItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div style={box('--semantic-background-signal-error-subtle-default')}>
        <strong style={{ font: '500 24px/30px Figtree, sans-serif' }}>Don’t</strong>
        <ul style={list}>
          {dontItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
