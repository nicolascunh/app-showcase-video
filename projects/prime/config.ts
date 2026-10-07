import { defineConfig } from '../../src/define';
import { palettes } from '../../src/palettes';

/** Aparência do vídeo do app Prime. */
export const userConfig = defineConfig({
  brand: { ...palettes.ambar },
  layout: { device: 'iphone-17-pro-max', phoneSide: 'left' },
  backdrop: { motif: 'glow' },
});
