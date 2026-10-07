# Foundations (colores, tipografía, espaciado, radios, sombras…)

## Fuente de verdad
`src/styles/tokens.css`, generado con `scripts/tokens_to_css.py` desde `get_variable_defs`. **Las páginas de foundations no duplican valores**: leen el CSS en tiempo de ejecución (`useTokenValue`) y se actualizan solas con el tema.

## Generar tokens
```bash
python3 -I scripts/tokens_to_css.py \
  --light light-a.json light-b.json \
  --dark  dark-a.json \
  --rename default=semantic-background-signal-info-subtle-default \
  --rename on-subtle=semantic-content-signal-info-on-subtle > src/styles/tokens.css
```
- Guarda en ficheros JSON cada respuesta de `get_variable_defs` (una por nodo y modo).
- Un mismo nombre local puede significar cosas distintas según el nodo (`default` = fondo de info en un nodo y de success en otro): **renombra por nodo** (ejecuta el script por estado y concatena, o junta a mano) usando los nombres de la doc.
- Revisa el resultado: el script no puede adivinar nombres semánticos.

## Páginas
Copia `assets/foundations/*` a `src/foundations/` y crea un MDX por foundation a partir de `Foundations.example.mdx`:
| Página | Componente | Entrada |
| --- | --- | --- |
| Colores | `ColorSwatches` | lista de `--tokens` con su uso (agrupa por familia: signal/info, neutral…) |
| Tipografía | `TypeScale` | prefijos de estilo (`label-m`, `body-s`) + variable de peso |
| Espaciado | `SpaceScale` | `--space-*` |
| Radios | `SpaceScale kind="radius"` | `--radius-*` |

Título MDX: `<Meta title="Foundations/Colores" />` (el `storySort` los pone primero).

## Buenas prácticas
- Agrupa los colores como el Figma (por familia/semántica), no alfabéticamente.
- Pon una frase de **uso** por token si el Figma la tiene ("Fondo de la tag info"). Si no, no la inventes.
- Los pares fondo/texto: muestra el contraste (si el Figma documenta 4,5:1) o un ejemplo con el componente real.
- Tipografía: carga la fuente en `preview-head.html`; si no carga, la muestra engaña.
- Foundations nuevas (sombras, z-index, motion): mismo patrón; crea un componente de muestra pequeño en `assets` equivalente.
