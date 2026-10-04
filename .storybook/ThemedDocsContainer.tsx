import { useEffect, useState, type ComponentProps } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';

type Props = ComponentProps<typeof DocsContainer>;
type Theme = 'light' | 'dark';

/** Aplica el tema al documento (tokens del Tag + fondo/color de la página). */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.body.style.background = theme === 'dark' ? '#1e1c1a' : '#ffffff';
  document.body.style.color = theme === 'dark' ? '#e5e5e5' : '#1e1c1a';
}

/** DocsContainer que sigue el selector "Tema" de la barra (global `theme`). */
export function ThemedDocsContainer(props: Props) {
  const initial = (props.context as any)?.store?.userGlobals?.get?.()?.theme;
  const [theme, setTheme] = useState<Theme>(initial === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const channel = addons.getChannel();
    const onChange = (payload: any) => {
      const value = payload?.userGlobals?.theme ?? payload?.globals?.theme;
      if (value) setTheme(value === 'dark' ? 'dark' : 'light');
    };
    channel.on(GLOBALS_UPDATED, onChange);
    channel.on(SET_GLOBALS, onChange);
    return () => {
      channel.off(GLOBALS_UPDATED, onChange);
      channel.off(SET_GLOBALS, onChange);
    };
  }, []);

  useEffect(() => applyTheme(theme), [theme]);

  return (
    <DocsContainer {...props} theme={theme === 'dark' ? themes.dark : themes.light}>
      {props.children}
    </DocsContainer>
  );
}
