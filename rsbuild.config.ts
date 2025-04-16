
import { defineConfig } from '@rsbuild/core';
import { join } from 'path';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginTypedCSSModules } from '@rsbuild/plugin-typed-css-modules';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';
import { defineProxy } from './config/proxy';
import { defineAlias } from './config/alias';
import { pluginLess } from '@rsbuild/plugin-less';

import tailwindcss from 'tailwindcss';
import tsconfigJson from './tsconfig.web.json';

export default defineConfig({
  source: {
    entry: {
      index: join(__dirname, './src/index.tsx')
    },
    alias: defineAlias(__dirname, tsconfigJson.compilerOptions.paths),
  },
  server: {
    port: 8000,
    proxy: defineProxy()
  },
  plugins: [
    pluginSass(),
    pluginLess(),
    pluginCssMinimizer(),
    pluginTypedCSSModules(),
    pluginReact(),
  ],
  output: {
    cleanDistPath: true,
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [
          tailwindcss({
            content: [
              join(__dirname, `/src/**/*.{html,js,ts,jsx,tsx}`)
            ],
          }),
        ],
      },
    },
  },
})
