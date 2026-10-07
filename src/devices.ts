/**
 * ─────────────────────────────────────────────────────────────
 *  APARELHOS
 * ─────────────────────────────────────────────────────────────
 *
 *  Cada aparelho é descrito em proporções, não em pixels fixos.
 *  Assim a moldura escala junto com `layout.phoneScale` sem deformar.
 *
 *  Medidas aproximadas, derivadas da linguagem visual de cada linha.
 *  Se você tiver a especificação exata do fabricante, ajuste os
 *  números aqui — nada mais no projeto precisa mudar.
 */

export type Cutout = 'dynamic-island' | 'punch-hole' | 'none';

export type Device = {
  label: string;
  /** Altura da tela dividida pela largura */
  aspect: number;
  /** Espessura da moldura, em % da largura da tela */
  bezelPct: number;
  /** Raio do canto externo, em % da largura externa */
  radiusPct: number;
  cutout: Cutout;
  /** Largura do recorte, em % da largura da tela */
  cutoutW: number;
  /** Altura do recorte, em % da largura da tela */
  cutoutH: number;
  /** Distância do topo da tela até o recorte, em % da altura da tela */
  cutoutTop: number;
  /** Cor padrão do corpo. `brand.device` no config sobrescreve se você quiser. */
  body: string;
  /** Tamanho recomendado para exportar o PNG no Figma */
  exportSize: { w: number; h: number };
};

export const devices = {
  'iphone-17-pro-max': {
    label: 'iPhone 17 Pro Max',
    aspect: 956 / 440, // 19.5:9
    bezelPct: 3.2,
    radiusPct: 13.5, // cantos bem arredondados, marca da linha
    cutout: 'dynamic-island',
    cutoutW: 28,
    cutoutH: 8.4,
    cutoutTop: 1.2,
    body: '#3C3C41', // titânio escuro
    exportSize: { w: 880, h: 1912 },
  },

  'pixel-10-pro-xl': {
    label: 'Pixel 10 Pro XL',
    aspect: 2992 / 1344, // 20:9, um pouco mais alongado que o iPhone
    bezelPct: 3.0,
    radiusPct: 10.5, // canto menos redondo — é o que separa da silhueta iPhone
    cutout: 'punch-hole',
    cutoutW: 7,
    cutoutH: 7,
    cutoutTop: 1.5,
    body: '#2A2A2E',
    exportSize: { w: 896, h: 1994 },
  },

  generico: {
    label: 'Genérico 19.5:9',
    aspect: 19.5 / 9,
    bezelPct: 3.2,
    radiusPct: 12,
    cutout: 'none',
    cutoutW: 0,
    cutoutH: 0,
    cutoutTop: 0,
    body: '#1B1B20',
    exportSize: { w: 840, h: 1820 },
  },
} satisfies Record<string, Device>;

export type DeviceId = keyof typeof devices;
