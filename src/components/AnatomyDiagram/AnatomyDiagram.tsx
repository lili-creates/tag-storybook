import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './AnatomyDiagram.css';

const MARKER = 33;

/** Tipografía fija del número: así no depende de los estilos de la página que lo aloja. */
const MARKER_FONT: CSSProperties = {
  fontFamily: "'Figtree', 'Nunito Sans', system-ui, sans-serif",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: 0,
};

/**
 * Número centrado ÓPTICAMENTE dentro del círculo. El centrado por caja (flex) alinea la caja del texto, no la
 * tinta del glifo: cada dígito tiene un hueco lateral distinto (el «1») y cada fuente un ascender/descender
 * distinto. Se mide la tinta real con canvas y se compensa con un desplazamiento (se re-mide al cargar fuentes).
 */
function MarkerNumber({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      const cs = getComputedStyle(el);
      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return;
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = ctx.measureText(String(n));
      if (!m.fontBoundingBoxAscent) return; // navegador sin métricas de fuente: se deja el centrado por caja
      // horizontal: centro de la tinta frente al centro de la caja de avance
      const x = m.width / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
      // vertical: centro de la tinta frente al centro del área de contenido de la línea
      const y =
        (m.fontBoundingBoxDescent - m.fontBoundingBoxAscent) / 2 -
        (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2;
      setShift({ x: Math.round(x * 4) / 4, y: Math.round(y * 4) / 4 });
    };
    apply();
    document.fonts?.ready.then(apply);
  }, [n]);

  return (
    <span ref={ref} style={{ display: 'block', transform: `translate(${shift.x}px, ${shift.y}px)` }}>
      {n}
    </span>
  );
}

export type CalloutSide = 'top' | 'bottom' | 'left' | 'right';

export interface Callout {
  /** Número del marcador (el mismo que en la tabla de anotaciones). */
  n: number;
  /** Selector CSS (dentro del componente) de la parte señalada. `''` = el propio componente. */
  target: string;
  /** Desde qué lado de la parte sale la línea. */
  side: CalloutSide;
  /** Largo de la línea en px (por defecto 40). */
  length?: number;
  /** Desplazamiento a lo largo del borde, desde el centro de la parte (px). Sirve para separar marcadores. */
  offset?: number;
}

export interface AnatomyDiagramProps {
  /** El componente a anotar: UN elemento raíz. */
  children: ReactNode;
  callouts: Callout[];
  /** Selectores de las partes a contornear con línea discontinua (`''` = el componente entero). */
  outlines?: string[];
  /** Texto accesible que resume qué señala cada número. */
  label: string;
}

interface Box { left: number; top: number; width: number; height: number }

function find(subject: HTMLElement, selector: string): HTMLElement | null {
  if (!selector) return subject;
  return subject.querySelector<HTMLElement>(selector);
}

/**
 * Diagrama de anatomía (como el del Figma): componente centrado, contornos discontinuos y marcadores
 * numerados con línea de llamada. Las posiciones se MIDEN sobre el DOM real, así que se adaptan a cualquier
 * ancho de fuente, y se redondean a píxeles enteros para que las líneas de 1px no se difuminen.
 */
export function AnatomyDiagram({ children, callouts, outlines = [''], label }: AnatomyDiagramProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<{
    boxes: Box[];
    lines: (Box & { key: string })[];
    markers: { key: string; n: number; left: number; top: number }[];
  }>({ boxes: [], lines: [], markers: [] });

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const subject = subjectRef.current?.firstElementChild as HTMLElement | null;
    if (!stage || !subject) return;
    const origin = stage.getBoundingClientRect();
    const rect = (el: HTMLElement): Box => {
      const r = el.getBoundingClientRect();
      return {
        left: Math.round(r.left - origin.left),
        top: Math.round(r.top - origin.top),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    };

    const boxes = outlines.flatMap((s) => {
      const el = find(subject, s);
      return el ? [rect(el)] : [];
    });

    const lines: (Box & { key: string })[] = [];
    const markers: { key: string; n: number; left: number; top: number }[] = [];
    for (const c of callouts) {
      const el = find(subject, c.target);
      if (!el) continue;
      const r = rect(el);
      const len = c.length ?? 40;
      const off = c.offset ?? 0;
      const cx = Math.round(r.left + r.width / 2 + off);
      const cy = Math.round(r.top + r.height / 2 + off);
      const half = Math.floor(MARKER / 2);
      const key = `${c.n}-${c.side}`;
      if (c.side === 'top') {
        lines.push({ key, left: cx, top: r.top - len, width: 1, height: len });
        markers.push({ key, n: c.n, left: cx - half, top: r.top - len - MARKER });
      } else if (c.side === 'bottom') {
        lines.push({ key, left: cx, top: r.top + r.height, width: 1, height: len });
        markers.push({ key, n: c.n, left: cx - half, top: r.top + r.height + len });
      } else if (c.side === 'left') {
        lines.push({ key, left: r.left - len, top: cy, width: len, height: 1 });
        markers.push({ key, n: c.n, left: r.left - len - MARKER, top: cy - half });
      } else {
        lines.push({ key, left: r.left + r.width, top: cy, width: len, height: 1 });
        markers.push({ key, n: c.n, left: r.left + r.width + len, top: cy - half });
      }
    }
    setGeometry({ boxes, lines, markers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(callouts), JSON.stringify(outlines)]);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    if (subjectRef.current) observer.observe(subjectRef.current);
    // las web fonts cambian el ancho del texto cuando terminan de cargar
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <figure className="anatomy" aria-label={label}>
      <div className="anatomy__stage" ref={stageRef}>
        <div className="anatomy__subject" ref={subjectRef}>
          {children}
        </div>
        <div className="anatomy__overlay" aria-hidden="true">
          {geometry.boxes.map((b, i) => (
            <span key={`o${i}`} className="anatomy__outline" style={b} />
          ))}
          {geometry.lines.map(({ key, ...l }) => (
            <span key={`l${key}`} className="anatomy__line" style={l} />
          ))}
          {geometry.markers.map((m) => (
            <span key={`m${m.key}`} className="anatomy__marker" style={{ left: m.left, top: m.top, ...MARKER_FONT }}>
              <MarkerNumber n={m.n} />
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
