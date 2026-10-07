/**
 * Ponte entre o motor e o projeto escolhido.
 *
 * `@project` aponta para `projects/<nome>/` (ver remotion.config.ts). O motor
 * nunca importa um projeto específico — trocar de app é trocar a variável
 * SHOWCASE_PROJECT, o que o CLI (`npm run studio -- <nome>`) já faz.
 */
import { userConfig } from '@project/config';
import { resolve, CANVAS as canvas } from './resolve';

const resolved = resolve(userConfig);

export const CANVAS = canvas;
export const config = resolved.config;
export const device = resolved.device;
export const phone = resolved.phone;
export const textArea = resolved.textArea;
