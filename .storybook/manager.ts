import { inject, pageview, type BeforeSendEvent } from '@vercel/analytics';
import { addons } from 'storybook/manager-api';
import { DOCS_RENDERED, GLOBALS_UPDATED, SET_GLOBALS, STORY_RENDERED } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';

// El contenido está en español: lectores de pantalla y traductores del navegador necesitan saberlo.
document.documentElement.lang = 'es';

const brand = { brandTitle: 'Tag · Design System' };

// Sincroniza la interfaz de Storybook (barra lateral, toolbar) con el selector "Tema".
addons.register('tag/theme-sync', (api) => {
  // Mientras el iframe de docs recarga se ve el fondo del propio <iframe>: que sea el del tema y no blanco
  const iframeBg = document.head.appendChild(document.createElement('style'));
  const apply = (theme?: string) => {
    iframeBg.textContent = `#storybook-preview-iframe { background: ${theme === 'dark' ? '#222325' : '#ffffff'}; }`;
    api.setOptions({ theme: { ...(theme === 'dark' ? themes.dark : themes.light), ...brand } });
  };
  // Con los globales aún vacíos (arranque) no se toca nada: aplicar «claro» por defecto parpadeaba con URL en oscuro
  const sync = () => {
    const theme = api.getGlobals()?.theme;
    if (theme) apply(theme);
  };
  // Al elegir el tema en la barra, el iframe lo aplica y lo guarda en localStorage a los ~0,2 s, pero Storybook solo
  // actualiza su estado cuando el iframe termina de recargar (~1 s en docs): la barra lateral se quedaba en el modo
  // anterior. El evento `storage` (mismo origen) avisa al manager sin esperar.
  window.addEventListener('storage', (event) => {
    if (event.key === 'tag-theme' && event.newValue) apply(event.newValue.split('|')[0]);
  });
  api.on(GLOBALS_UPDATED, sync);
  api.on(SET_GLOBALS, sync);
  // Primer pintado con el tema de la URL (`globals=theme:dark`), sin esperar a que Storybook envíe los globales
  apply(/(^|;)theme:dark(;|$)/.test(new URLSearchParams(location.search).get('globals') ?? '') ? 'dark' : 'light');
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

// Vercel inyecta al compilar la ruta propia (con hash) del script; sin ella se usa /_vercel/insights/, que los bloqueadores filtran.
inject(
  {
    disableAutoTrack: true,
    beforeSend: (event: BeforeSendEvent) => (event.type === 'pageview' ? { ...event, url: cleanUrl(event.url) } : event),
  },
  process.env.STORYBOOK_VERCEL_OBSERVABILITY_CLIENT_CONFIG,
);

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
