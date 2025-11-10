

import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {

    jsxFactory: 'createElement',
    jsxFragment: 'createFragment',
    jsxInject: `import { createElement, createFragment } from './jsx-runtime';`, 
  },

  optimizeDeps: {
    include: ['src/**/*.tsx', 'src/**/*.ts'],
  }
});