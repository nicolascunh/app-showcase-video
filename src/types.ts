import type { DeviceId } from './devices';

export type Motif = 'beam' | 'glow' | 'grid' | 'none';
export type PhoneSide = 'left' | 'right' | 'center';
export type CameraMove = 'push' | 'drift' | 'orbit' | 'none';
export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** Fonte local, carregada de public/. Garante o mesmo visual em qualquer máquina. */
export type FontFile = { family: string; file: string; weight?: number };

/** Configuração completa (já com os padrões aplicados). */
export type Mode = 'tv' | 'apresentacao';

export type ShowcaseConfig = {
  /**
   * 'tv'           loop contínuo sem ninguém operando (TV de evento/loja, pen drive).
   *                Aplica as regras de TV: loop que fecha, margem segura, texto ≥ 34px.
   * 'apresentacao' toca uma vez do começo ao fim (reunião, proposta, redes, site).
   *                Sem loop e sem as restrições de TV; aceita abertura/encerramento e trilha.
   */
  mode: Mode;
  brand: {
    accent: string;
    accentSoft: string;
    bg: string;
    bgTint: string;
    ink: string;
    inkMuted: string;
    device: string | undefined;
  };
  font: {
    display: string;
    body: string;
    titleWeight: number;
    titleTracking: number;
    /** Arquivos de fonte em public/ (ex: public/fonts/Inter.woff2). Opcional. */
    files: FontFile[];
  };
  size: { eyebrow: number; title: number; bullet: number };
  layout: {
    device: DeviceId;
    screenHeight: number;
    phoneSide: PhoneSide;
    phoneScale: number;
    safe: number;
    gap: number;
    showProgress: boolean;
    showDevice: boolean;
  };
  backdrop: { motif: Motif; intensity: number; grain: boolean };
  cinematic: {
    enabled: boolean;
    camera: CameraMove;
    cameraAmount: number;
    crossfade: number;
    tilt: number;
    glassSweep: boolean;
    vignette: number;
    letterbox: number | null;
  };
  logo: { file: string | undefined; height: number; position: LogoPosition };
  /** Trilha sonora opcional (MP3/WAV/M4A em public/). Em modo 'tv' o vídeo sai mudo se não houver. */
  audio: { file: string | undefined; volume: number };
  labels: {
    /** Texto do placeholder enquanto a tela real não foi exportada */
    placeholder: string;
  };
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

/** O que cada projeto escreve em `config.ts`: só o que difere do padrão. */
export type UserConfig = DeepPartial<ShowcaseConfig>;

export type Tap = {
  /** Posição do toque em % da tela do celular (0–100) */
  x: number;
  y: number;
  /** Em que segundo da cena o toque acontece */
  at: number;
};

export type Scene = {
  id: string;
  /** Print (PNG) dentro de public/screens — ex: 'home.png'. Sem `screen` nem `video`, entra um placeholder. */
  screen?: string;
  /**
   * Gravação de tela (MP4) dentro de public/screens — ex: 'fluxo.mp4'. Tem prioridade sobre `screen`.
   * Gere com `npm run screens -- <app> gravacao.mov`. Precisa ter pelo menos `seconds` de duração.
   */
  video?: string;
  /** Rótulo pequeno acima do título */
  eyebrow: string;
  /** Título grande */
  title: string;
  /** Uma linha de benefício. Uma só. */
  bullet: string;
  /** Duração em segundos. Com cinema ligado, não desça de 5s. */
  seconds: number;
  /** Como a tela entra (só vale com cinematic.enabled = false) */
  enter?: 'push' | 'fade' | 'up';
  /** Toques a mostrar durante a cena */
  taps?: Tap[];
};
