# Errores ya encontrados (y su causa)

| Síntoma | Causa | Arreglo |
| --- | --- | --- |
| Tablas MDX salen como `\| a \| b \|` | MDX no activa GFM por defecto | `remark-gfm` en `main.ts` (`mdxCompileOptions.remarkPlugins`) |
| Modo oscuro: solo cambian las tags; texto invisible en docs | El decorador solo tiñe el `body`; la página de docs tiene su propio tema | `ThemedDocsContainer` (+ `manager.ts` para la UI) |
| Vercel: `UNRESOLVED_ENTRY index.html` | Detecta Vite y lanza `vite build` | `vercel.json` con `build-storybook` y `storybook-static` |
| `tsc`: no encuentra `./X.css` | Falta `vite/client` types | `src/vite-env.d.ts` |
| Colores del modo oscuro "perdidos" | Los valores del JSX de `get_design_context` son del modo claro | `get_variable_defs` de un nodo del frame de modo oscuro |
| Tokens con nombres como `default` | `get_variable_defs` devuelve alias locales | `--rename` con los nombres de la doc |
| Prop nueva del Figma no aparece | Las props booleanas no salen en el nombre de variante | Releer el tipo `Props` de `get_design_context` del component set |
| Respuesta de `get_design_context` "exceeds maximum tokens" | Frame de docs grande | `forceCode` + `figma_text.py` sobre el fichero guardado |
| Línea de 1px gris en el diagrama | `transform: translateX(-50%)` → medio píxel | rejilla + bordes (`border-top: 1px solid`) |
| Marcador descentrado tras quitar el `transform` | `left/margin` con valores fraccionarios | rejilla CSS (`grid-template-areas`), `justify-self: center` |
| Iconos no aparecen en capturas | CDN bloqueada en el sandbox | Es el entorno; verificar en navegador real |
| Títulos `###` enormes en monoespaciada | Backticks dentro del encabezado | `### Tamaño (size)` |
| Sesión se cierra al parar el servidor | `pkill -f` casó con el shell | `fuser -k <puerto>/tcp` |
| URL de story con tilde no se encuentra | ID con acentos, URL-encoded | `%C3%B3` o fija `id` explícito |
| Docs de la story duplicadas | `autodocs` + MDX propio | quitar `tags: ['autodocs']` |
| Marcadores del diagrama descolocados con otra fuente | Posiciones fijas en px calculadas con la fuente de diseño | `AnatomyDiagram` mide el DOM y re-mide al cargar fuentes |
| Matriz "modo oscuro" no se ve oscura con el tema claro | Tokens oscuros definidos solo en `:root[data-theme='dark']` | Definirlos también en `[data-theme='dark']` y envolver en `data-theme="dark"` |
| La doc del Figma cambia y el código sigue truncando | Se actualizaron textos pero no el comportamiento | Releer reglas de texto/accesibilidad y aplicar al componente (quitar ellipsis, story, tooltip) |
| Dos frames "Anatomía" / "Uso y contenido" en el Figma | Frames heredados tras reorganizar | Ordenar por `y` y por número de sección; preguntar si hay duda |
| Defaults de `label`/`text` distintos tras sincronizar | Cambian en el tipo `Props` de `get_design_context` | Alinear componente y `args` de stories |
| Tabla de controles se sale en móvil (scroll horizontal de página) | `docblock-argstable` de Storybook no es responsive | `display:block; overflow-x:auto` en `docs.css` (<760px) |
| Texto de la primera columna invisible en una zona forzada a oscuro | Storybook fija el color de `td/th` | `color: inherit` en esas celdas |
| Dos tablas (claro y oscuro) con los mismos tokens | Duplica contenido y no deja ver qué cambia | Una matriz con interruptor + valor resuelto (`TokenMatrix`) |
| Matriz «clara» sale oscura con el tema global oscuro | Los tokens claros solo estaban en `:root` y el subárbol hereda los oscuros | Definir los claros también en `[data-theme='light']` |
| Interruptor ilegible al cambiar de modo | Su color dependía del modo de la matriz | Pintarlo según el tema de la página |
| Espacios que desaparecen en los bloques de código de la doc (`<Tagstatus=…`) | Clase global `.tag` del componente colisiona con `.token.tag` del resaltador (inline-flex + nowrap) | Prefijar las clases del componente (`ds-tag`) |
| Tarjeta huérfana en la rejilla del resumen | `auto-fit` con mínimo pequeño da 3 columnas para 4 tarjetas | `minmax(300px, 1fr)` → 2×2 |
| Números dentro de los círculos del diagrama no se ven centrados | El centrado por caja (flex) alinea la caja del texto, no la tinta del glifo; cada dígito tiene hueco lateral distinto y cada fuente métricas distintas; además los estilos de la página pisaban la fuente | Fijar tipografía inline y compensar con la tinta real medida con canvas (`measureText`), re-midiendo al cargar fuentes. Verificar midiendo píxeles, no a ojo |
| Vercel Web Analytics «no funciona bien» en Storybook | `<Analytics />` en un decorador vive en el iframe de previsualización (URL `/iframe.html?id=…`) y no en la página principal, que además navega con `?path=` sin recargar | Cargarlo en `manager.ts`: `inject({ disableAutoTrack: true, beforeSend })` + `pageview({ path })` en `DOCS_RENDERED`/`STORY_RENDERED`, con `beforeSend` que reescribe `?path=/docs/x` a `/docs/x`. Requiere Web Analytics activado en el proyecto de Vercel |
| Hex junto a una variable de color semántica en la doc | Se calculó el valor resuelto para «ayudar» | Quitarlo: solo nombre del token + muestra de color; el valor viene de un primitivo y no debe copiarse a mano |
