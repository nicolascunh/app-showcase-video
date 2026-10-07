import { defineConfig } from '../../src/define';
import { palettes } from '../../src/palettes';

/** Exemplo de MODO APRESENTAÇÃO: toca uma vez, sem loop e sem as restrições de TV. */
export const userConfig = defineConfig({
  mode: 'apresentacao',
  brand: { ...palettes.claro },
  layout: { phoneSide: 'right' },
  backdrop: { motif: 'grid' },
  // Trilha sonora (opcional): coloque o arquivo em public/ e descomente.
  // audio: { file: 'trilha.mp3', volume: 0.5 },
});
