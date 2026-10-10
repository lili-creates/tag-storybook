---
name: figma-to-storybook
description: Pasa componentes, foundations (colores, tipografía, espaciado, radios) y documentación de un design system de Figma a Storybook (React + Vite) con tokens claro/oscuro, stories, docs en MDX y verificación visual. Úsala cuando el usuario comparta una URL de Figma y pida montar, ampliar o actualizar un Storybook, sincronizar un cambio del Figma (nueva propiedad, anatomía, tokens) o documentar un componente o foundation.
---

# Figma → Storybook

Flujo para llevar un design system de Figma a Storybook **fiel al diseño, con docs reales y sin sorpresas en modo oscuro**. Sirve para tres casos: **montar** un Storybook desde cero, **añadir** un componente/foundation, **sincronizar** cambios del Figma.

Principio rector: **el Figma es la fuente de verdad**. Todo lo que no esté en el Figma (textos de docs inventados, nombres de props, comportamientos supuestos) se marca como tal en el informe final.

## Qué contiene esta skill

| Recurso | Para qué |
| --- | --- |
| `references/figma-extraction.md` | Cómo leer el Figma sin perder información ni saturar el contexto |
| `references/storybook-setup.md` | Configuración de Storybook 10 (tablas, tema, TOC, orden, deploy) |
| `references/component-and-docs.md` | Convenciones de componente, stories y MDX; patrón de anatomía |
| `references/foundations.md` | Páginas de colores, tipografía, espaciado y radios |
| `references/sync-and-verify.md` | Actualizar tras cambios del Figma y verificar (build + capturas) |
| `references/gotchas.md` | Errores reales ya encontrados y su causa |
| `assets/storybook-config/` | `main.ts`, `preview.tsx`, `manager.ts`, `ThemedDocsContainer.tsx`, `preview-head.html`, `docs.css` (sistema de espaciado/lectura), `vercel.json` listos para copiar |
| `assets/foundations/` | `ColorSwatches`, `TypeScale`, `SpaceScale`, `useTokenValue`, plantilla MDX |
| `assets/AnatomyDiagram.*` | Diagrama de anatomía con marcadores numerados (mide el DOM real) + `ComponentAnatomy.example.tsx` |
| `assets/ComponentDocs.example.tsx` | Auxiliares de docs: matriz de tokens claro/oscuro, bloques Do/Don't |
| `scripts/figma_text.py` | Saca el texto de respuestas grandes de `get_design_context` guardadas en disco |
| `scripts/tokens_to_css.py` | Variables de Figma (claro/oscuro) → `tokens.css` |
| `scripts/shoot.cjs` | Capturas con Playwright en claro/oscuro, docs o story |

Los scripts y assets están en `.claude/skills/figma-to-storybook/` (o donde esté instalada la skill); las rutas de las referencias son relativas a esa carpeta.

## Flujo

### 0. Antes de empezar
- Lee el repo: ¿ya hay Storybook (`.storybook/`)? ¿qué framework y estilos usa? **Adáptate a lo que haya**; solo usa los assets si empiezas de cero.
- Si hay tools de Figma, carga la skill/guía `figma-design-to-code` antes de `get_design_context` (si no está disponible, sigue; el resultado es solo una *referencia* que hay que convertir al stack del proyecto, nunca copiar Tailwind).
- Extrae `fileKey` y `nodeId` de la URL (`node-id=8-525` → `8:525`). **Ojo**: el nodo de la URL suele ser una *pieza* (un icono, una variante), no el componente. Mira la página entera.

### 1. Descubrir (`get_metadata`)
1. Sin `nodeId` → lista de páginas. Luego `get_metadata` de la página/sección.
2. Clasifica lo que encuentres: **component set** (nodos `symbol` con nombre `prop=valor, prop=valor`), **frames de documentación** (anatomía, propiedades, uso, accesibilidad, modo oscuro, referencias), **foundations** (variables/estilos).
3. Pregunta al usuario solo si hay una decisión que cambia el resultado (p. ej. varios componentes y no sabes cuál).

### 2. Extraer (ver `references/figma-extraction.md`)
- **Componente**: `get_design_context` del component set → props, variantes, estructura, estilos. De ahí salen las **props reales** (`showIcon`, `showLabelGroup`…).
- **Tokens**: `get_variable_defs` por nodo, **uno por cada modo** (claro y oscuro: pide un nodo del frame de modo oscuro). Los valores de fallback que aparecen dentro del JSX son del modo claro.
- **Documentación**: `get_design_context` de cada frame de docs con `forceCode: true` y `excludeScreenshot: true`. Si la respuesta es enorme se guarda en un fichero: **no la cargues**, usa `scripts/figma_text.py`.
- **Imágenes/iconos**: las URLs de assets de Figma caducan (7 días) y pueden estar bloqueadas por el proxy. Si los iconos son de una librería conocida (Phosphor, Lucide…), **úsala desde su CDN o paquete** y no descargues los SVG.

### 3. Tokens (ver `references/foundations.md`)
- `scripts/tokens_to_css.py` genera `tokens.css` con `:root` (claro) y `:root[data-theme='dark']` (solo lo que difiere).
- **Los nombres de `get_variable_defs` son locales y ambiguos** (`default`, `on-subtle`). Renómbralos con los nombres completos que cite la documentación del Figma (p. ej. `--semantic-background-signal-info-subtle-default`).
- Verifica cada color/medida contra una captura de Figma antes de darlo por bueno.

### 4. Configurar Storybook (solo si falta) → `references/storybook-setup.md`
Copia `assets/storybook-config/`. Lo imprescindible: **`remark-gfm`** (si no, las tablas MDX salen como `|---|`), **tema claro/oscuro en docs y en la interfaz** (no solo en las stories), TOC, `storySort`, `vercel.json`.

### 5. Componente + stories + docs → `references/component-and-docs.md`
Carpeta por componente: `X.tsx`, `X.css`, `X.stories.tsx`, `X.mdx`.
- **Props = propiedades del Figma** (booleanas, variantes, slots). Mismos valores, defaults del Figma.
- **Docs MDX con la estructura y el idioma del Figma**, sección a sección. Tablas con **vista previa real** del componente en cada fila. Diagrama de anatomía con `AnatomyDiagram`.
- Stories: Playground (controles), una por variante/propiedad relevante, matriz de variantes, ejemplos de uso del Figma, casos límite (truncado, sin icono…).
- Accesibilidad tal como la documenta el Figma (`aria-hidden` en iconos decorativos, sin `role=button`, etc.).

### 6. Foundations → `references/foundations.md`
Una página MDX por foundation (Colores, Tipografía, Espaciado, Radios…) con las plantillas de `assets/foundations/`, que **leen los tokens del CSS** y se actualizan solas al cambiar de tema.

### 7. Verificar → `references/sync-and-verify.md`
Siempre, antes de decir "listo": `tsc --noEmit`, `build-storybook`, y **capturas en claro y oscuro** (`scripts/shoot.cjs`) comparadas con el Figma. Un build verde no prueba que se vea bien.

### 8. Informar
Resume en pocas líneas: qué se ha creado/cambiado, **qué viene del Figma y qué es decisión tuya**, discrepancias detectadas (props sin documentar en el Figma, nombres distintos entre Figma y código, typos), y qué no has podido verificar (CDN bloqueadas, fuentes). Commit y push a la rama indicada; no abras PR salvo que lo pidan.

## Reglas
- **No inventes contenido de diseño**: textos de docs, valores de tokens y nombres vienen del Figma. Si falta algo, impleméntalo con criterio, márcalo y dilo.
- **Actualizar ≠ rehacer**: al sincronizar, compara con lo existente y toca solo lo que cambió (`references/sync-and-verify.md`). Cuando el Figma reestructura la doc (secciones nuevas/renumeradas), se reescribe el MDX entero siguiendo el nuevo orden, conservando las mejoras de UX.
- **Modo oscuro es parte del trabajo**, no un extra: tokens, docs, interfaz y diagramas.
- **Idioma**: docs en el idioma del Figma; código y nombres de props en inglés (anota ambos si el Figma usa otros nombres).
- Reutiliza antes de crear: tokens y componentes que ya existan en el proyecto.
