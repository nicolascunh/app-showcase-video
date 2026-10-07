import { defineConfig } from '../../src/define';
// import { palettes } from '../../src/palettes';

/**
 * APARÊNCIA do vídeo deste app.
 *
 * Só escreva o que quiser mudar — o resto vem de src/defaults.ts.
 * Referência completa de cada opção: README.md, seção "Personalização".
 */
export const userConfig = defineConfig({
  // 'tv' = loop em TV/telão (padrão) · 'apresentacao' = toca uma vez (reunião, site, redes)
  mode: 'tv',

  brand: {
    // Troque pelas cores do app (hex de 6 dígitos), ou use uma paleta pronta:
    //   ...palettes.ambar  |  palettes.claro  |  palettes.azul  |  palettes.verde
    accent: '#4C8DFF',
    accentSoft: '#A8C7FF',
    bg: '#05070E',
    bgTint: '#0C1426',
  },

  layout: {
    // 'iphone-17-pro-max' | 'pixel-10-pro-xl' | 'generico'
    device: 'iphone-17-pro-max',
    phoneSide: 'left',
  },

  // Trilha sonora (só faz sentido em 'apresentacao'): coloque o arquivo em public/ e descomente.
  // audio: { file: 'trilha.mp3', volume: 0.5 },

  // Logo do app: coloque o PNG em public/ e descomente.
  // logo: { file: 'logo.png', position: 'top-right' },
});
