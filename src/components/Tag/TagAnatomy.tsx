import { Tag } from './Tag';
import './TagAnatomy.css';

const Marker = ({ n }: { n: number }) => (
  <span className="tag-anatomy__marker" aria-hidden="true">
    {n}
  </span>
);

/** Diagrama de anatomía: 1 Etiqueta (tag completa), 2 contenedor (icono + label), 3 Texto. */
export function TagAnatomy() {
  return (
    <figure
      className="tag-anatomy"
      aria-label="Anatomía de la tag: 1 etiqueta, 2 contenedor del icono y la etiqueta, 3 texto"
    >
      <div className="tag-anatomy__grid">
        <span className="tag-anatomy__callout tag-anatomy__callout--top" aria-hidden="true">
          <Marker n={1} />
          <span className="tag-anatomy__line tag-anatomy__line--v" />
        </span>
        <span className="tag-anatomy__callout tag-anatomy__callout--left" aria-hidden="true">
          <Marker n={2} />
          <span className="tag-anatomy__line tag-anatomy__line--h" />
        </span>
        <Tag size="small" status="info" label="Label" text="Description" />
        <span className="tag-anatomy__callout tag-anatomy__callout--right" aria-hidden="true">
          <span className="tag-anatomy__line tag-anatomy__line--h" />
          <Marker n={3} />
        </span>
      </div>
    </figure>
  );
}
