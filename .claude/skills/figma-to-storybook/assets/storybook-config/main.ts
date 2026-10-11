import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        // Necesario para que las tablas de Markdown se rendericen en los .mdx
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
  ],
  framework: '@storybook/react-vite',
  // Solo si usas Vercel Analytics: el manager únicamente ve variables STORYBOOK_*
  env: (config) => ({
    ...config,
    STORYBOOK_VERCEL_OBSERVABILITY_CLIENT_CONFIG: process.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG ?? '',
  }),
};

export default config;
