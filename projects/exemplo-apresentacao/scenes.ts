import { defineScenes } from '../../src/define';

/**
 * Exemplo com GRAVAÇÃO DE TELA (`video`) e print (`screen`), em modo apresentação.
 * A gravação foi importada com: npm run screens -- exemplo-apresentacao gravacao.mov
 */
export const scenes = defineScenes([
  {
    id: 'fluxo',
    video: 'gravacao-fluxo.mp4',
    eyebrow: 'Como funciona',
    title: 'Do início à confirmação em três telas',
    bullet: 'A gravação do app roda dentro do aparelho.',
    seconds: 7.5,
  },
  {
    id: 'resultado',
    screen: 'resultado.png',
    eyebrow: 'Resultado',
    title: 'Pedido confirmado, sem burocracia',
    bullet: 'Print e vídeo podem se misturar no mesmo roteiro.',
    seconds: 5,
  },
]);
