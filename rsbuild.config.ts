
import { defineConfig } from '@rsbuild/core';
import { join } from 'path';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginTypedCSSModules } from '@rsbuild/plugin-typed-css-modules';

import tailwindcss from 'tailwindcss';
import proxy from './config/proxy';
import tsconfigJson from './tsconfig.web.json';

const defineAlias = (basePath: string, paths: Record<string, string[]>) => {
  const alias: Record<string, string> = {};

  const aliasMaps: [string, string][] = Object.keys(paths).filter((key) => paths[key].length > 0).map((key) => {
    return [key.replace(/\/\*$/, ''), join(basePath, paths[key][0].replace('/*', ''))] as const;
  });

  aliasMaps.forEach(([aliasKey, aliasPath]) => {
    alias[aliasKey] = aliasPath;
  })
  return alias;
}

export default defineConfig(({ env, command, envMode }) => {

  const IS_PROD = (env === 'production');

  return {
    source: {
      entry: {
        index: join(__dirname, './src/index.tsx')
      },
      alias: defineAlias(__dirname, tsconfigJson.compilerOptions.paths),

    },
    server: {
      port: 8000,

      proxy: proxy
    },

    plugins: [
      pluginSass(),
      pluginTypedCSSModules(),
      pluginReact()
    ],
    output: {
      distPath: {
        root: './dist',
      },
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
  }
})
