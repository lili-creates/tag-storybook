# Extraer del Figma sin perder información

## Herramientas y para qué
| Herramienta | Úsala para | Notas |
| --- | --- | --- |
| `get_metadata` | Mapa de páginas y nodos (ids, nombres, tamaños) | Sin `nodeId` lista las páginas. Barata: empieza siempre por aquí |
| `get_design_context` | Estructura, estilos, **props** del componente y **texto** de las docs | Devuelve React+Tailwind de *referencia*. Convierte a tu stack |
| `get_variable_defs` | Tokens (variables) que usa un nodo | Un modo cada vez: pide un nodo del modo claro y otro del oscuro |
| `get_screenshot` | Referencia visual para comparar | URL de corta vida; descarga con curl o usa `enableBase64Response` si hay bloqueo |

## Localizar el componente
- El `node-id` de la URL puede ser un icono o una variante. Lista la página y busca el **component set** (varios `symbol` `prop=valor`).
- Los nombres de variante dan las props: `size=small, status=info` → `size: 'small'|'default'`, `status: ...`.
- Las props **booleanas y de contenido** (`showIcon`, `label`, `text`, `icon`) **no** salen en el nombre: salen del tipo `TagProps` que genera `get_design_context` del component set. **Reléelo en cada sincronización**: así se detectó `showLabelGroup`.
- Las descripciones del componente (`Component descriptions`) a veces contienen reglas y typos intencionados (p. ej. `netural`): respétalas o avísalas, no las "corrijas" en silencio.

## Texto de la documentación
1. `get_design_context` del frame de docs, `forceCode: true`, `excludeScreenshot: true`.
2. Si responde con *"exceeds maximum allowed tokens… saved to <fichero>"*: **no abras el fichero**. Ejecuta
   `python3 -I scripts/figma_text.py <fichero> [--grep REGEX]`.
3. Pide los frames de docs **por separado** (uno por sección) para no pasar del límite y detectar mejor qué cambió.
4. Conserva la **estructura** (secciones, numeración "01 / ESTRUCTURA"), el **orden** y el **idioma**. Las listas con "•" → listas MD; los pares nombre/valor → tablas.

## Tokens
- Claro: `get_variable_defs` de un nodo del modo claro. Oscuro: de un nodo del frame "modo oscuro".
- Un nodo solo devuelve **las variables que usa**: junta varias llamadas (un nodo por estado/variante) para completar el set.
- Nombres ambiguos → renombra con `--rename` en `scripts/tokens_to_css.py` usando los nombres que cita la documentación ("Variables / info", tablas de tokens, etc.).
- Estilos compuestos (`Label/m/Bold: Font(...)`) no son tokens: se reconstruyen con las variables sueltas (`--label-m-font-size`, …).
- Valores con alfa (`#e5e5e599`) → `rgba()`. Valores sin unidad (`14`) → `px`; el peso de fuente va sin unidad.

## Iconos e imágenes
- URLs `figma.com/api/mcp/asset/...`: caducan a los 7 días y el proxy del sandbox puede responder 403. No las pongas en el código.
- Si los iconos son de una librería (nombres de componente Figma = nombres de icono: `CheckCircle`, `XCircle`, `Package`), usa la librería (CDN `@phosphor-icons/web`, o paquete npm de React) y mapea nombre→icono en una tabla en el componente.
- Si son propios, pide al usuario los SVG o expórtalos (`download_assets`) y guárdalos en el repo.

## Qué no es del Figma
Anota explícitamente en el informe lo que decidas tú: nombres de props en inglés, estructura de carpetas, stories de ejemplo, equivalencias de iconos.
