
import { join } from 'path';

export const defineAlias = (basePath: string, paths: Record<string, string[]>) => {
  const alias: Record<string, string> = {};

  const aliasMaps: [string, string][] = Object.keys(paths).filter((key) => paths[key].length > 0).map((key) => {
    return [key.replace(/\/\*$/, ''), join(basePath, paths[key][0].replace('/*', ''))] as const;
  });

  aliasMaps.forEach(([aliasKey, aliasPath]) => {
    alias[aliasKey] = aliasPath;
  })
  return alias;
}
