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
