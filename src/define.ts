import type { Scene, UserConfig } from './types';

/** Só tipagem: dá autocomplete e erro de digitação no config do projeto. */
export const defineConfig = (config: UserConfig): UserConfig => config;
export const defineScenes = (scenes: Scene[]): Scene[] => scenes;
