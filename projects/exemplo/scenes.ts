import { defineScenes } from '../../src/define';

/** Projeto de exemplo (app fictício) — serve de referência e de teste do motor. */
export const scenes = defineScenes([
  {
    id: 'inicio',
    screen: 'inicio-tela-1.png',
    eyebrow: 'Conheça o app',
    title: 'Tudo o que você precisa em um só lugar',
    bullet: 'Pedidos, pagamentos e suporte na mesma tela.',
    seconds: 6,
    taps: [{ x: 50, y: 24, at: 3.5 }],
  },
  {
    id: 'recurso-principal',
    screen: 'recurso-principal.png',
    eyebrow: 'Contratação',
    title: 'Escolha o plano e confirme em segundos',
    bullet: 'Três planos, um toque para continuar.',
    seconds: 6,
    taps: [{ x: 50, y: 88, at: 3.8 }],
  },
  {
    id: 'resultado',
    screen: 'resultado.png',
    eyebrow: 'Pronto',
    title: 'Pedido confirmado, sem burocracia',
    bullet: 'Você recebe o aviso na hora, direto no celular.',
    seconds: 6,
  },
]);
