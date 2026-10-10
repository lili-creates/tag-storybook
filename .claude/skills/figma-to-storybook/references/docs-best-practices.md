# Buenas prácticas de documentación (qué aplicar y por qué)

Resumen de lo que hacen los design systems de referencia y la guía de Storybook, y cómo se aplica en estas páginas. Fuentes al final.

## 1. Estructura de página
- **Plantilla de Storybook**: Título → Subtítulo → Descripción → Primary → Controls → Stories. En un MDX propio se replica con `Meta` + `Canvas` + `Controls`. **Añade siempre un JSDoc al componente** (alimenta la descripción, las tablas de props y herramientas externas).
- **Misma estructura en todos los componentes** (GOV.UK, Carbon con sus pestañas Usage/Style/Code/Accessibility, Spectrum con Options/Behaviors/Content/Accessibility). Si el Figma ya define las secciones, respétalas; añade solo lo que falta (resumen, código).
- **Resumen «en un vistazo» arriba** (4 tarjetas: úsala para · no la uses para · al configurarla · accesibilidad). Es un resumen DERIVADO del Figma: cita en cada tarjeta de qué sección sale y no inventes reglas nuevas.

## 2. Contenido
- **Cuándo usar / cuándo NO** con la alternativa nombrada (GOV.UK: «solo estado, nunca enlaces ni botones»; Atlassian y Polaris separan tag de lozenge/badge según sea estado o categoría interactiva; Carbon: las tags de solo lectura quedan fuera del orden de tabulación).
- **Do / Don't con ejemplos visibles**, no solo texto. Los contraejemplos se renderizan de verdad (p. ej. una tag con ✕) y se marcan `aria-hidden` para que no cuenten como UI real.
- **Uso en código**: bloque `tsx` copiable con las combinaciones más habituales (Storybook añade copiar). Imports reales del repo.
- **Accesibilidad como sección propia** y **verificada**: `@storybook/addon-a11y` (axe) da el panel en cada story y `scripts/axe_check.cjs` comprueba claro y oscuro desde la línea de comandos. Axe detecta una parte de los problemas WCAG (~57 %): es primera pasada, no sustituye revisión manual.
- Estados del componente: documenta cuáles tiene y cuáles **no** (una tag informativa no tiene hover/focus/disabled: dilo).
- Estado/ciclo de vida (Alpha/Beta/Stable en Washington Post, Morningstar) y versión/changelog (Rivet): úsalo solo si el equipo lo define; **no lo inventes**. Si falta, propónselo al usuario.

## 3. Legibilidad (ver `docs.css`)
- Textos cortos y escaneables; una idea por párrafo; listas para reglas; tablas con vista previa; ejemplos interactivos antes que descripciones.
- Jerarquía visual clara entre secciones (h2 con regla y aire) y subsecciones (h3); TOC lateral.
- Evita reglas decorativas sin función (p. ej. sobre la primera sección).

## 4. Higiene técnica que afecta a la documentación
- **Prefija las clases CSS del componente** (`ds-tag`, no `tag`): el resaltador de código de Storybook usa clases genéricas (`.token.tag`) y un `.tag {display:inline-flex; white-space:nowrap}` colapsaba los espacios del código. Vale para cualquier nombre genérico (`.button`, `.label`, `.icon`).
- No dependas de CDN en producción para iconos/fuentes sin plan B; en el sandbox están bloqueadas.

## Fuentes consultadas
- Storybook · Autodocs y Doc Blocks: https://storybook.js.org/docs/writing-docs/autodocs · https://storybook.js.org/docs/writing-docs/doc-blocks
- Storybook · Accessibility testing (axe): https://storybook.js.org/docs/writing-tests/accessibility-testing
- GOV.UK Design System · Tag: https://design-system.service.gov.uk/components/tag/
- Carbon · Tag (usage, style, accessibility): https://carbondesignsystem.com/components/tag/usage · https://carbondesignsystem.com/components/tag/accessibility/
- Atlassian · Lozenge / Tag: https://atlassian.design/components/lozenge/lozenge
- Shopify Polaris · Badge: https://polaris-react.shopify.com/components/feedback-indicators/badge
- Adobe Spectrum · Badge: https://spectrum.adobe.com/page/badge
- Washington Post · Component status: https://build.washingtonpost.com/support/component-status
- UXPin · 7 best practices for design system documentation: https://uxpin.com/studio/blog/7-best-practices-for-design-system-documentation/
- Figma · Design systems 103, documentation that drives adoption: https://www.figma.com/blog/design-systems-103-documentation-that-drives-adoption/
