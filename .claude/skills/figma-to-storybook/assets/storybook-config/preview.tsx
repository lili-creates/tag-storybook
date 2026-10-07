import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import { ThemedDocsContainer, applyTheme } from './ThemedDocsContainer';

const withTheme: Decorator = (Story, context) => {
  applyTheme(context.globals.theme === 'dark' ? 'dark' : 'light');
  return <Story />;
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
    options: {
      // Foundations primero, luego componentes; dentro de cada uno, Documentación antes que las stories.
      storySort: { order: ['Foundations', 'Componentes', ['*', ['Documentación', 'Playground', '*']]] },
    },
  },
};

export default preview;
