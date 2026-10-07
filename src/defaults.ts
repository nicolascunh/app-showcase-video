import type { ShowcaseConfig } from './types';

/**
 * Valores padrão. Um projeto novo só precisa sobrescrever o que quiser em
 * `projects/<nome>/config.ts` — tudo o que faltar vem daqui.
 */
export const defaults: ShowcaseConfig = {
  mode: 'tv',

  /** ── Cores ─────────────────────────────────────────────── */
  brand: {
    /** Destaque: rótulos, toque, fundo. Hex de 6 dígitos (o código concatena alfa). */
    accent: '#4C8DFF',
    /** Variação clara do destaque, usada nos fundos */
    accentSoft: '#A8C7FF',
    /** Fundo principal */
    bg: '#05070E',
    /** Segundo tom do fundo — igual ao `bg` para fundo chapado */
    bgTint: '#0C1426',
    ink: '#FFFFFF',
    inkMuted: 'rgba(255,255,255,0.62)',
    /** Cor do corpo do aparelho. undefined usa a cor própria do modelo. */
    device: undefined,
  },

  /** ── Tipografia ────────────────────────────────────────── */
  font: {
    display: '"SF Pro Display", -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    body: '"SF Pro Text", -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    titleWeight: 700,
    titleTracking: -1.5,
    files: [],
  },

  /** ── Tamanhos de texto (px sobre canvas 1920x1080). Mínimo 34 para TV. ── */
  size: { eyebrow: 34, title: 78, bullet: 40 },

  /** ── Layout ────────────────────────────────────────────── */
  layout: {
    device: 'iphone-17-pro-max',
    screenHeight: 910,
    phoneSide: 'left',
    phoneScale: 1,
    /** Margem morta das bordas. 96 = 5% de 1920. Não reduza para TV. */
    safe: 96,
    gap: 130,
    showProgress: false,
    showDevice: true,
  },

  /** ── Fundo ─────────────────────────────────────────────── */
  backdrop: { motif: 'glow', intensity: 0.6, grain: true },

  /** ── Cinema ────────────────────────────────────────────── */
  cinematic: {
    enabled: true,
    camera: 'orbit',
    cameraAmount: 1,
    crossfade: 1.1,
    tilt: 7,
    glassSweep: true,
    vignette: 0.55,
    letterbox: null,
  },

  /** ── Logo (opcional) ───────────────────────────────────── */
  logo: { file: undefined, height: 56, position: 'top-right' },

  audio: { file: undefined, volume: 0.6 },

  labels: { placeholder: 'tela pendente' },
};
