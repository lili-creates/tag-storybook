# Componente, stories y documentación

## Estructura
```
src/components/<Nombre>/
  <Nombre>.tsx          # componente (props = propiedades del Figma)
  <Nombre>.css          # estilos con variables de tokens.css (nada de colores/medidas sueltas)
  <Nombre>.stories.tsx  # CSF3 con args/argTypes
  <Nombre>.mdx          # documentación (estructura del Figma)
  <Nombre>Anatomy.tsx   # opcional: AnatomyDiagram con las partes del componente
src/styles/tokens.css   # generado desde Figma
```

## Componente
- **Props = propiedades del Figma**: variantes (`size`, `status`), booleanas (`showIcon`), contenido (`label`, `text`), slots (`icon`). Defaults y valores idénticos al Figma. Si el Figma las llama distinto en español, el código usa inglés y la tabla de docs muestra ambos: «Mostrar icono» (`showIcon`).
- Reglas del Figma que **limitan** una prop se implementan (p. ej. «`icon` solo aplica a neutral», «`showIcon` no aplica si el grupo está oculto»).
- Estilos: clases BEM + variables. Variantes por clase modificadora (`.tag--small`, `.tag--info`) que definen variables locales (`--tag-bg`, `--tag-fg`); una sola regla las consume.
- Medidas del Figma → tokens (`--space-md`), no px. Las "no tokenizadas" (iconos 16px) se dejan como valor y se documentan.
- Accesibilidad según la doc del Figma (icono decorativo `aria-hidden`, sin `tabindex`/`role=button` si es informativo…). Si la doc pide algo que el componente no puede resolver solo (tooltip accesible), documéntalo en el MDX en vez de inventarlo.
- Contenido que se trunca: `min-width: 0; overflow: hidden; text-overflow: ellipsis` en el elemento correcto, y story que lo demuestre.

## Stories
Playground (todas las props con controles) · una story por prop/variante relevante · **Matriz de variantes** (todas las combinaciones, como en el Figma) · **ejemplos de uso** reales del Figma (detalle de pedido, lista…) · casos límite. Nombres de story en el idioma de la doc. `argTypes` con `control` explícito (`inline-radio`, `select`) y `icon: { control: false }` para slots.

## MDX: espejo de la doc del Figma
- Secciones en el **mismo orden y numeración** (01 · Anatomía, 02 · Propiedades…), mismos títulos y textos. Copia literal; si cambia el Figma, cambia aquí.
- **Tablas con vista previa**: `| Valor | Vista | Uso |` con `<Tag … />` dentro de la celda (MDX 3 admite JSX inline). Es lo que hace la doc entendible de un vistazo.
- `<Canvas of={Stories.X} />` para casos que merecen verse y probarse; `<Controls of={Stories.Playground} />` arriba.
- Evita `### \`prop\`` con backticks en títulos (se renderizan enormes y monoespaciados): usa `### Tamaño (size)`.
- Listas con "•" del Figma → listas MD. Enlaces de referencias → links MD.
- No dejes secciones "mías" mezcladas con las del Figma. Si añades algo (p. ej. tabla de variables), ponlo en una subsección clara y menciónalo en el informe.

## Anatomía (patrón del Figma: preview numerado + tabla)
1. `AnatomyDiagram` (assets) envuelve el componente y **mide el DOM real**: le pasas `outlines` (selectores de las partes a contornear) y `callouts` `{ n, target, side, length, offset }`. Los 5 marcadores del Tag (container arriba, label group abajo, icon a la izquierda, label arriba desplazado, text a la derecha) son el ejemplo (`ComponentAnatomy.example.tsx`).
2. Copia la geometría del Figma: lado desde el que sale cada línea y su largo (`Line` en px del Figma); usa `offset` para separar marcadores que chocarían.
3. Tabla `# | Tipo | Elemento | Notas` con el texto literal del Figma (`▢` frame, `◇` instancia/icono, **T** texto). **Numera según el diagrama** si la tabla del Figma repite números (y avísalo).
4. **Números de los marcadores**: centrados ópticamente (tinta del glifo, no caja del texto) y con tipografía fija inline; `AnatomyDiagram` ya lo hace. Compruébalo midiendo píxeles de un recorte a alta resolución (`deviceScaleFactor` 6) y comparando el centro de la tinta con el del círculo.
5. Posiciones redondeadas a enteros y líneas de 1px como `div` con fondo: nítidas. Re-mide con `ResizeObserver` y `document.fonts.ready` (el ancho del texto cambia al cargar la fuente).
6. Los colores del diagrama vienen del Figma (marcadores `--data-chart-error-subtle`, texto negro); si no hay valor oscuro, usa el mismo en ambos modos y dilo.

## Auxiliares de docs (`ComponentDocs.example.tsx`)
- `TokenMatrix`: **una sola** matriz estado × tamaño × variables con interruptor Claro/Oscuro (los tokens son los mismos y solo cambian los valores). Arranca en el tema de Storybook y lo sigue; junto a cada variable muestra solo una **muestra de color** y su nombre, **nunca el hex**: los tokens semánticos apuntan a un primitivo y se usan por nombre; enseñar el valor invita a copiarlo a mano. Si se conocen los nombres de los primitivos, muéstralos en su lugar (`→ primitivo`). Para que un subárbol pueda forzar un modo, `tokens.css` define **ambos** modos en `:root, [data-theme='light']` y `[data-theme='dark']` (no solo en `:root`). El interruptor se pinta según el tema de la PÁGINA, no el de la matriz.
- `OtherTokens`: tokens de espaciado/radio/tipografía en **tarjetas por tema** con `small` y `default` en columnas paralelas y el **valor resuelto** junto a cada token (`TokenValue`), en vez de una tabla larga con filas de grupo. Token y valor en la misma línea; barra proporcional para espaciados; el estilo de Figma (Label/s/Bold · Label/m/Bold) en la cabecera de la columna.
- `DoDont`: dos cajas verde/roja con los tokens de success/error.

## Estructura que no genera dudas
- **Una sección del Figma = un `h2`** («01 · Anatomía»); su primera línea es el subtítulo. Dentro, `h3` por tema. Pon el **Playground** como primera sección (`## Playground`) para que los controles no floten sin título.
- **Compacta lo pequeño**: propiedades de una sola fila (label, text, icon, width, height) van en UNA tabla `Propiedad | Valor | Uso` bajo un `h3` («Contenido», «Medidas»), no en un `h3` cada una.
- **Tablas**: primera columna = nombre corto; una columna de **vista previa**; última = descripción. Filas de grupo (texto + celdas vacías) para tablas largas de tokens.
- **No repitas con un `Canvas` lo que la tabla de encima ya muestra con vista previa.** Reserva el `Canvas` para lo que la tabla no puede enseñar (un icono sustituido, combinaciones, un ejemplo de uso real). Las stories siguen disponibles en la barra lateral.
- No mezcles tamaños de texto a mano en el MDX: los estilos salen de `docs.css`.

## Calidad
`tsc --noEmit` limpio · sin colores literales en el CSS del componente · props tipadas con JSDoc (alimentan la tabla de controles) · `README` corto con cómo arrancar.
