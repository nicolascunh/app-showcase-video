import { devices } from './devices';
import { defaults } from './defaults';
import type { ShowcaseConfig, UserConfig } from './types';

export const CANVAS = { w: 1920, h: 1080 };

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Mescla o config do projeto por cima dos padrões, objeto a objeto. */
const merge = <T>(base: T, over: unknown): T => {
  if (!isPlainObject(base) || !isPlainObject(over)) return (over === undefined ? base : over) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined) continue;
    out[k] = merge((base as Record<string, unknown>)[k], v);
  }
  return out as T;
};

/**
 * Pura (sem imports de projeto): o motor e a CLI usam a mesma função,
 * então o `doctor` valida exatamente o que o vídeo vai usar.
 */
export const resolve = (user: UserConfig) => {
  const config = merge<ShowcaseConfig>(defaults, user);
  const device = devices[config.layout.device];
  if (!device) {
    throw new Error(
      `layout.device "${config.layout.device}" não existe. Opções: ${Object.keys(devices).join(', ')}`,
    );
  }

  const { phoneScale: s, phoneSide, safe, gap, screenHeight } = config.layout;

  const screenH = Math.round(screenHeight * s);
  const screenW = Math.round(screenH / device.aspect);
  const bezel = Math.round((screenW * device.bezelPct) / 100);
  const outerW = screenW + bezel * 2;
  const outerH = screenH + bezel * 2;
  const radius = Math.round((outerW * device.radiusPct) / 100);

  let x: number;
  if (phoneSide === 'left') x = safe + 72;
  else if (phoneSide === 'right') x = CANVAS.w - safe - 72 - outerW;
  else x = Math.round((CANVAS.w - outerW) / 2);

  const phone = {
    screenW,
    screenH,
    bezel,
    radius,
    outerW,
    outerH,
    x,
    y: Math.round((CANVAS.h - outerH) / 2),
    gap,
    cutout: {
      kind: device.cutout,
      w: Math.round((screenW * device.cutoutW) / 100),
      h: Math.round((screenW * device.cutoutH) / 100),
      top: Math.round((screenH * device.cutoutTop) / 100),
    },
    body: config.brand.device ?? device.body,
  };

  /** Área do texto. Coluna lateral, ou faixa inferior quando o aparelho está centralizado. */
  const textArea =
    phoneSide === 'center'
      ? { mode: 'lower' as const, x: safe, width: CANVAS.w - safe * 2, align: 'center' as const }
      : phoneSide === 'right'
        ? { mode: 'column' as const, x: safe, width: phone.x - gap - safe, align: 'left' as const }
        : (() => {
            const tx = phone.x + phone.outerW + gap;
            return { mode: 'column' as const, x: tx, width: CANVAS.w - safe - tx, align: 'left' as const };
          })();

  return { config, device, phone, textArea };
};
