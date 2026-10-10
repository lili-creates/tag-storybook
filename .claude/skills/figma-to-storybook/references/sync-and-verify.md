# Sincronizar cambios del Figma y verificar

## Actualizar (el usuario dice "cambié X en el Figma")
1. **Relee solo lo afectado**: componente (`get_design_context` del component set → ¿props nuevas?), el frame de docs que toca, o `get_variable_defs` si son tokens. No rehagas todo.
2. **Compara con lo que hay**: diff mental/textual entre Figma y `*.tsx` / `*.mdx` / `tokens.css`. Lista los cambios antes de editar.
3. **Si el cambio aún no está documentado en el Figma** (p. ej. prop nueva sin texto): impleméntala, documéntala con redacción coherente y **dilo**. Cuando el usuario actualice la doc, vuelve a leer y sustituye tu redacción por la suya.
4. **Aplica**: componente → stories → MDX → tokens. Cambia textos literales cuando el Figma los cambia (incluidos typos: avísalos).
5. **Elimina lo que el Figma eliminó** (secciones, listas) en vez de dejarlo huérfano.
6. Verifica y reporta qué cambió (lista corta) y qué decisiones propias hubo.

## Cuando el Figma reestructura la documentación
1. `get_metadata` de la sección y **lista los frames hijos ordenados por `y`**: ese es el orden real de lectura. Pueden aparecer **frames duplicados o heredados** (dos «Anatomía», dos «Uso y contenido»): el orden y el número de sección ("01 /", "02 /"…) deciden cuál vale; si dudas, pregunta.
2. Lee cada frame por separado y compara **título + número de sección** con el MDX: secciones nuevas, renombradas ("Medidas" → "Otros tokens"), partidas ("Tamaños y estados" → Propiedades / Tokens de color / Otros tokens / Reglas del texto) o eliminadas (modo oscuro como sección propia).
3. Un cambio de **comportamiento** manda sobre todo: p. ej. «la tag no trunca ni lleva tooltip» obliga a quitar `text-overflow`, la story de truncado y los avisos de tooltip. Cambia el componente, no solo los textos.
4. Revisa los **defaults** del tipo `Props` (`label = "label"`, `size = "small"`): si cambian, alinea el componente y los `args` de las stories.
5. Reescribe el MDX en el nuevo orden; mantén tablas con vista previa, Canvas y controles.
6. Anota en el informe las **discrepancias del Figma** (numeración repetida en la tabla de anatomía, frases que cambian de sentido, espacios dobles en nombres) y qué decisión tomaste.

## Verificación (no te saltes ninguna)
```bash
npx tsc --noEmit
npm run build-storybook
npx http-server storybook-static -p 6010 -s &      # servidor estático
node scripts/shoot.cjs http://localhost:6010 <story-id> out.png dark docs "h2:has-text('02')"
fuser -k 6010/tcp                                   # parar el servidor
```
- **Claro y oscuro**: texto legible, tokens correctos, interfaz de Storybook también.
- **Contra el Figma**: compara colores/medidas con `get_screenshot` (padding, alturas: 24px small / 36px default en el ejemplo).
- **Docs**: tablas renderizadas, TOC con las secciones, previews dentro de las celdas, diagramas alineados.
- Capturas a `deviceScaleFactor: 2` cuando haya líneas finas: a 1× una línea de 1px rosa se ve gris al reducirse en la visualización.
- IDs de story: `index.json` de `storybook-static` los lista (`componentes-tag--documentación`).

## Límites del sandbox
- Las CDN externas (Google Fonts, jsDelivr, unpkg) pueden estar bloqueadas: los **iconos de CDN y la fuente no se ven en las capturas**. No es un bug del código; dilo en el informe y pide revisarlo en el navegador del usuario.
- `curl` a `figma.com/api/mcp/asset/...` → 403. Usa `get_screenshot` con `enableBase64Response` si necesitas la imagen.
- **No uses `pkill -f <patrón>`** para parar el servidor: el patrón puede casar con el propio shell y cerrar la sesión (exit 144). Usa `fuser -k <puerto>/tcp`.
- Git: commit con las líneas de atribución que indique la sesión, push a la rama asignada. No abras PR salvo petición.
