# Configuración de Storybook (v10, React + Vite)

Plantillas listas en `assets/storybook-config/`. Cópialas a `.storybook/` (y `vercel.json` a la raíz).

## Dependencias
```bash
npm i react react-dom
npm i -D storybook @storybook/react-vite @storybook/addon-docs vite typescript @types/react @types/react-dom remark-gfm
```
`package.json`: `"type": "module"`, scripts `storybook` (`storybook dev -p 6006`) y `build-storybook`. Añade `src/vite-env.d.ts` con `/// <reference types="vite/client" />` (si no, `import './X.css'` falla en `tsc`). `.gitignore`: `node_modules`, `storybook-static`.

## main.ts
- `stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)']`
- `@storybook/addon-docs` con `mdxPluginOptions.mdxCompileOptions.remarkPlugins: [remarkGfm]` → **sin esto las tablas MDX se ven como texto con `|`**.
- No uses `tags: ['autodocs']` si escribes tú el MDX (se duplicaría la página). Enlaza el MDX con `<Meta of={Stories} name="Documentación" />`.

## Tema claro/oscuro (3 capas, las tres hacen falta)
1. **Tokens**: `:root` (claro) y `:root[data-theme='dark']` (diferencias). Ver `tokens_to_css.py`.
2. **Preview** (`preview.tsx`): `globalTypes.theme` en la toolbar + decorador que llama a `applyTheme()` → pone `data-theme`, fondo y color del `body`.
3. **Docs y UI**:
   - `ThemedDocsContainer.tsx` (`parameters.docs.container`): escucha `GLOBALS_UPDATED`/`SET_GLOBALS` y pasa `themes.dark|light` al `DocsContainer`. Sin esto la página de docs se queda blanca con el texto del tema oscuro invisible.
   - `manager.ts`: sincroniza la **interfaz** (sidebar, toolbar) con `api.setOptions({ theme })`.

Probar: `?globals=theme:dark` en la URL y cambiar en caliente desde la toolbar.

## Legibilidad de las docs (`docs.css`)
Storybook trae tipografía apretada para MDX (14px, tablas de 13px, títulos sin jerarquía). `assets/storybook-config/docs.css` (importado en `preview.tsx`) define un sistema de lectura con escala de 8px, todo acotado a `.sbdocs-content`:
- Columna de 880px, cuerpo 16px/1.65, listas con 8px entre ítems.
- `h1` 44px y resumen en grande; **cada sección (`h2`) empieza con una regla y 80px de aire**; `h3` con 56px por encima (32px si va pegado al `h2`); el párrafo tras un `h2` es el subtítulo de la sección (18px, atenuado).
- Tablas de Markdown con borde redondeado, cabecera sombreada, 16px de padding, primera columna en negrita y sin salto, filas de grupo (primera celda con texto y el resto vacío) como cabeceras.
- Transparencias (`rgba`) en bordes y fondos para que sirva en claro y oscuro; `scroll` interno de tablas en <760px (incluida la de controles).
Ajusta los valores aquí, no en cada MDX.

## Docs
- `parameters.docs.toc`: índice lateral ("En esta página") con `h2, h3`.
- `storySort`: Foundations → Componentes; dentro, `Documentación` → `Playground` → resto.
- Fuente del DS: en `preview-head.html` (`<link>` a Google Fonts) si el DS usa una web font; iconos desde CDN si aplica.
- IDs de story con tildes (`documentación`) funcionan (URL-encoded); si molestan, fija `id` en `Meta`/story.

## Deploy
Vercel detecta `vite` y ejecuta `vite build`, que busca un `index.html` inexistente → `UNRESOLVED_ENTRY`. Incluye `vercel.json`:
```json
{ "framework": null, "installCommand": "npm install", "buildCommand": "npm run build-storybook", "outputDirectory": "storybook-static" }
```
Si el proyecto de Vercel tiene Build Command/Output Directory fijados en ajustes, mandan sobre el fichero.
