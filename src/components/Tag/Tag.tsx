import type { ReactNode } from 'react';
import './Tag.css';

export type TagSize = 'small' | 'default';
export type TagStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface TagProps {
  /** Tamaño: `small` para tablas y listas densas, `default` (por defecto) para tarjetas y vistas de detalle. */
  size?: TagSize;
  /** Significado operativo de la tag. */
  status?: TagStatus;
  /** Nombre breve del objeto (texto en negrita, dentro del label group). Una palabra o una frase breve. */
  label?: string;
  /** Texto de apoyo que expresa el estado o el contexto. Siempre visible. Corto: la tag no trunca. */
  text?: string;
  /** Show label group: muestra u oculta el grupo icono + label. Si es `false`, la tag muestra solo el Text. */
  showLabelGroup?: boolean;
  /** Show icon: muestra u oculta el icono dentro del label group. No aplica si `showLabelGroup` es `false`. */
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

/**
 * Una señal compacta para comunicar estado y contexto. Informa sin pedir una acción:
 * no es un botón ni un filtro, no entra en el orden de tabulación y no trunca su contenido (siempre hug, una línea).
 */
export function Tag({
  size = 'default',
  status = 'info',
  label = 'label',
  text = 'text',
  showLabelGroup = true,
  showIcon = true,
  icon,
  className,
}: TagProps) {
  const customIcon = status === 'neutral' ? icon : undefined;
  const classes = ['ds-tag', `ds-tag--${size}`, `ds-tag--${status}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {showLabelGroup && (
        <span className="ds-tag__group">
          {showIcon && (
            <span className="ds-tag__icon" aria-hidden="true">
              {customIcon ?? <i className={`ph ${STATUS_ICON[status]}`} />}
            </span>
          )}
          <span className="ds-tag__label">{label}</span>
        </span>
      )}
      <span className="ds-tag__text">{text}</span>
    </span>
  );
}
