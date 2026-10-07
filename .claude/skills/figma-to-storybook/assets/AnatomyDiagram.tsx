import type { ReactNode } from 'react';
import './AnatomyDiagram.css';

const Marker = ({ n }: { n: number }) => (
  <span className="anatomy__marker" aria-hidden="true">
    {n}
  </span>
);

export interface AnatomyDiagramProps {
  /** El componente a anotar. Debe ser UN elemento raíz (para el contorno de la pieza completa). */
  children: ReactNode;
  /** Números de marcador (los de la tabla de anotaciones). Omite los que no uses. */
  top?: number;
  left?: number;
  right?: number;
  /** Texto accesible que describe qué señala cada número. */
  label: string;
}

/**
 * Diagrama de anatomía como el del Figma: pieza centrada, contornos discontinuos y marcadores numerados
 * con línea de llamada (arriba / izquierda / derecha). Los contornos de las sub-partes se activan en el
 * CSS con selectores de ".anatomy [clase-de-la-parte]" — ver AnatomyDiagram.css.
 */
export function AnatomyDiagram({ children, top, left, right, label }: AnatomyDiagramProps) {
  return (
    <figure className="anatomy" aria-label={label}>
      <div className="anatomy__grid">
        {top !== undefined && (
          <span className="anatomy__callout anatomy__callout--top" aria-hidden="true">
            <Marker n={top} />
            <span className="anatomy__line anatomy__line--v" />
          </span>
        )}
        {left !== undefined && (
          <span className="anatomy__callout anatomy__callout--left" aria-hidden="true">
            <Marker n={left} />
            <span className="anatomy__line anatomy__line--h" />
          </span>
        )}
        <div className="anatomy__subject">{children}</div>
        {right !== undefined && (
          <span className="anatomy__callout anatomy__callout--right" aria-hidden="true">
            <span className="anatomy__line anatomy__line--h" />
            <Marker n={right} />
          </span>
        )}
      </div>
    </figure>
  );
}
