import { defineScenes } from '../../src/define';

/**
 * ROTEIRO do vídeo deste app. Cada objeto é uma cena.
 *
 * 1. Coloque os prints em public/screens/ (veja docs/CAPTURA-DE-TELAS.md,
 *    ou rode `npm run screens -- <projeto> arquivo1.png arquivo2.png ...`)
 * 2. Aponte `screen` para o nome do arquivo
 *
 * Sem print ainda? Deixe `screen` de fora: entra um placeholder e o vídeo roda.
 *
 * Regras de TV: uma frase por campo, cena com 5s ou mais, e o loop fecha sozinho
 * (não crie cartela de abertura/encerramento).
 */
export const scenes = defineScenes([
  {
    id: 'inicio',
    // screen: 'inicio.png',
    eyebrow: 'Conheça o app',
    title: 'Tudo o que você precisa em um só lugar',
    bullet: 'Uma frase curta que explique o benefício desta tela.',
    seconds: 6,
    // Onde o toque aparece, em % da tela do celular. `at` = segundo da cena.
    taps: [{ x: 50, y: 80, at: 3.5 }],
  },
  {
    id: 'recurso-principal',
    // screen: 'recurso-principal.png',
    eyebrow: 'Recurso principal',
    title: 'Faça em segundos o que levava minutos',
    bullet: 'Mostre o que o usuário ganha, não o que o botão faz.',
    seconds: 6,
    taps: [{ x: 50, y: 88, at: 3.8 }],
  },
  {
    id: 'resultado',
    // screen: 'resultado.png',
    eyebrow: 'Pronto',
    title: 'Simples assim',
    bullet: 'Feche mostrando o resultado final.',
    seconds: 6,
  },
]);
