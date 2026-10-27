import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';

document.documentElement.lang = 'es';

const brand = { brandTitle: 'NOMBRE · Design System' };

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
    if (event.key === 'ds-theme' && event.newValue) apply(event.newValue.split('|')[0]);
  });
  api.on(GLOBALS_UPDATED, sync);
  api.on(SET_GLOBALS, sync);
  // Primer pintado con el tema de la URL (`globals=theme:dark`), sin esperar a que Storybook envíe los globales
  apply(/(^|;)theme:dark(;|$)/.test(new URLSearchParams(location.search).get('globals') ?? '') ? 'dark' : 'light');
});
