import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.body.style.background = theme === 'dark' ? '#1e1c1a' : '#ffffff';
  document.body.style.color = theme === 'dark' ? '#e5e5e5' : '#1e1c1a';
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
  },
};

export default preview;
