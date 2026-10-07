import path from 'node:path';
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');

/**
 * Qual app? SHOWCASE_PROJECT=<pasta em projects/ ou templates/>.
 * O CLI (`npm run studio -- <nome>`) já preenche; direto no `npx remotion`
 * você precisa exportar a variável.
 */
const slug = process.env.SHOWCASE_PROJECT;
if (!slug) {
  throw new Error(
    'Defina o projeto: use `npm run studio -- <nome>` ou `npm run render -- <nome>` ' +
      '(ou exporte SHOWCASE_PROJECT=<nome>). Para criar um: `npm run new -- <nome>`.',
  );
}
const projectDir = process.env.SHOWCASE_PROJECT_DIR ?? path.resolve('projects', slug);

Config.overrideWebpackConfig((current) => ({
  ...current,
  resolve: {
    ...current.resolve,
    alias: { ...(current.resolve?.alias as Record<string, string>), '@project': projectDir },
  },
}));
