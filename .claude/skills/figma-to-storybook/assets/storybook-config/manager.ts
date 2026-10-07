import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
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
