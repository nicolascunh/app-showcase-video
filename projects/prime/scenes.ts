import { defineScenes } from '../../src/define';

/** Roteiro do vídeo do app Prime (cinema). Telas: public/screens/ — descomente `screen` ao exportar. */
export const scenes = defineScenes([
  {
    id: 'em-cartaz',
    // screen: 'em-cartaz.png',
    eyebrow: 'Cinema no Prime',
    title: 'Todos os filmes em cartaz',
    bullet: 'Uma única lista, todas as redes parceiras.',
    seconds: 6,
    enter: 'up',
    taps: [{ x: 28, y: 42, at: 3.4 }],
  },
  {
    id: 'filme-detalhe',
    // screen: 'filme-detalhe.png',
    eyebrow: 'Detalhe do filme',
    title: 'Trailer, sinopse e onde assistir',
    bullet: 'O benefício aparece junto com o cinema.',
    seconds: 6.5,
    enter: 'push',
    taps: [{ x: 50, y: 78, at: 4 }],
  },
  {
    id: 'oferta',
    // screen: 'oferta.png',
    eyebrow: 'Benefício aplicado',
    title: 'Até 50% de desconto no ingresso',
    bullet: 'Desconto direto na compra, sem cupom.',
    seconds: 6,
    enter: 'push',
    taps: [{ x: 50, y: 88, at: 3.6 }],
  },
  {
    id: 'confirmacao',
    // screen: 'confirmacao.png',
    eyebrow: 'Pronto',
    title: 'Ingresso na mão em 3 toques',
    bullet: 'QR Code direto no app, sem fila.',
    seconds: 6,
    enter: 'fade',
  },
]);
