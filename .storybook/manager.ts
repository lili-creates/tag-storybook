import { inject, pageview, type BeforeSendEvent } from '@vercel/analytics';
import { addons } from 'storybook/manager-api';
import { DOCS_RENDERED, GLOBALS_UPDATED, SET_GLOBALS, STORY_RENDERED } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';

// Sincroniza la interfaz de Storybook (barra lateral, toolbar) con el selector "Tema".
addons.register('tag/theme-sync', (api) => {
  const sync = () => {
    const theme = api.getGlobals()?.theme;
    api.setOptions({ theme: theme === 'dark' ? themes.dark : themes.light });
  };
  api.on(GLOBALS_UPDATED, sync);
  api.on(SET_GLOBALS, sync);
});

/**
 * Vercel Web Analytics.
 *
 * Se carga aquí (la página principal que abre la gente) y NO en el iframe de previsualización: el iframe solo ve
 * `/iframe.html?id=…`, y la navegación real de Storybook vive en `/?path=/docs/…`. Storybook cambia de página sin
 * recargar y con parámetros de consulta, así que se desactiva el seguimiento automático y se envía una visita
 * por cada cambio de página con una ruta limpia (`/docs/componentes-tag--documentación`).
 */
const cleanUrl = (raw: string) => {
  try {
    const url = new URL(raw);
    const path = url.searchParams.get('path'); // «/docs/…» o «/story/…»
    return new URL(path ?? url.pathname, url.origin).toString(); // codifica los acentos (%C3%B3)
  } catch {
    return raw;
  }
};

inject({
  disableAutoTrack: true,
  beforeSend: (event: BeforeSendEvent) => (event.type === 'pageview' ? { ...event, url: cleanUrl(event.url) } : event),
});

/**
 * Diagnóstico: dice en la consola del navegador si el script de Vercel ha llegado. Sin él, un fallo es silencioso.
 * - «no se pudo cargar»: 404 (Analytics se activó DESPUÉS de este despliegue → redesplegar y promover a producción)
 *   o bloqueado por una extensión (bloqueador de anuncios, escudos de Brave/Safari…).
 * No hace peticiones extra: escucha el <script> que ya inyecta `inject()`. En local no se muestra nada.
 */
const isLocal = /^(localhost|127\.|\[::1\])/.test(location.hostname);
if (!isLocal) {
  const tag = document.querySelector<HTMLScriptElement>('script[src*="/_vercel/insights/"]');
  tag?.addEventListener('load', () => console.info('[analytics] Vercel Web Analytics: script cargado ✔'));
  tag?.addEventListener('error', () =>
    console.warn(
      '[analytics] Vercel Web Analytics: no se pudo cargar /_vercel/insights/script.js. ' +
        'Si es un 404, activa Analytics en el proyecto, redespliega y promueve a producción; ' +
        'si está bloqueado, desactiva el bloqueador de anuncios en este sitio.',
    ),
  );
}

addons.register('tag/analytics', (api) => {
  let last = '';
  const track = () => {
    const path = api.getUrlState().path; // p. ej. «/docs/componentes-tag--documentación»
    if (!path || path === last) return; // una sola visita por página (docs y story disparan eventos distintos)
    last = path;
    pageview({ path });
  };
  api.on(DOCS_RENDERED, track);
  api.on(STORY_RENDERED, track);
});
