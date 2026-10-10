import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import './docs.css';
import { ThemedDocsContainer, applyTheme } from './ThemedDocsContainer';
import { Analytics } from '@vercel/analytics/react';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  applyTheme(theme);
  return (
    <>
      <Story />
      <Analytics />
    </>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Modo de color (colección Colors de Figma)',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Oscuro' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: { container: ThemedDocsContainer, toc: { headingSelector: 'h2, h3', title: 'En esta página' } },
    options: { storySort: { order: ['Componentes', ['Tag', ['Documentación', 'Playground', 'Estados', 'Tamaños']]] } },
  },
};

export default preview;
