import type { ReactNode } from 'react';
import './Tag.css';

export type TagSize = 'small' | 'default';
export type TagStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface TagProps {
  /** Tamaño: `small` para tablas y listas densas, `default` para tarjetas y vistas de detalle. */
  size?: TagSize;
  /** Significado operativo de la tag. */
  status?: TagStatus;
  /** Nombre breve del objeto (texto en negrita). */
  label: string;
  /** Estado o detalle conciso (texto regular). Es lo único que se trunca. */
  text: string;
  /** Muestra u oculta el icono. */
  showIcon?: boolean;
  /** Sustituye el icono. Solo se aplica a `neutral`; los estados de señal conservan su icono semántico. */
  icon?: ReactNode;
  className?: string;
}

/** Iconos Phosphor servidos desde la CDN (ver .storybook/preview-head.html). */
const STATUS_ICON: Record<TagStatus, string> = {
  info: 'ph-info',
  success: 'ph-check-circle',
  warning: 'ph-warning',
  error: 'ph-x-circle',
  neutral: 'ph-package',
};

export function Tag({
  size = 'default',
  status = 'info',
  label,
  text,
  showIcon = true,
  icon,
  className,
}: TagProps) {
  const customIcon = status === 'neutral' ? icon : undefined;
  const classes = ['tag', `tag--${size}`, `tag--${status}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <span className="tag__group">
        {showIcon && (
          <span className="tag__icon" aria-hidden="true">
            {customIcon ?? <i className={`ph ${STATUS_ICON[status]}`} />}
          </span>
        )}
        <span className="tag__label">{label}</span>
      </span>
      <span className="tag__text">{text}</span>
    </span>
  );
}
