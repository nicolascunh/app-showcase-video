import type { ShowcaseConfig } from './types';

/**
 * Paletas prontas. Use no `config.ts` do projeto:
 *
 *   import { palettes } from '../../src/palettes';
 *   export const userConfig = defineConfig({ brand: palettes.ambar });
 */
export const palettes = {
  /** Escuro âmbar — cinema, entretenimento */
  ambar: {
    accent: '#F5A524',
    accentSoft: '#FFD089',
    bg: '#0A0A0D',
    bgTint: '#17110E',
    ink: '#FFFFFF',
    inkMuted: 'rgba(255,255,255,0.62)',
    device: '#1B1B20',
  },
  /** Claro sóbrio — sala clara e TV muito brilhante */
  claro: {
    accent: '#B4610A',
    accentSoft: '#F2C88A',
    bg: '#F6F4F0',
    bgTint: '#ECE7DF',
    ink: '#131313',
    inkMuted: 'rgba(19,19,19,0.60)',
    device: '#D9D5CD',
  },
  /** Azul noturno — institucional, sem calor (é o padrão) */
  azul: {
    accent: '#4C8DFF',
    accentSoft: '#A8C7FF',
    bg: '#05070E',
    bgTint: '#0C1426',
    ink: '#FFFFFF',
    inkMuted: 'rgba(255,255,255,0.60)',
    device: '#151A28',
  },
  /** Verde — quando o assunto é economia, saúde, sustentabilidade */
  verde: {
    accent: '#3FCF5F',
    accentSoft: '#A6EDB6',
    bg: '#06100A',
    bgTint: '#0B1D12',
    ink: '#FFFFFF',
    inkMuted: 'rgba(255,255,255,0.62)',
    device: '#132018',
  },
} satisfies Record<string, ShowcaseConfig['brand']>;
