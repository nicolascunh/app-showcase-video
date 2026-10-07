# Contexto do repositório

Gerador de **vídeo de apresentação de app**, replicável: um motor (`src/`) e uma pasta por app (`projects/<app>/`).
Destino padrão: **TV por pen drive, em loop, sem ninguém operando**. Para criar um vídeo novo, siga a skill
`novo-video-de-app` (`.claude/skills/novo-video-de-app/SKILL.md`).

## Regras que não se negociam (TV)

- **MP4 H.264 1920×1080 30fps**, com faixa de áudio AAC mesmo que muda → entregar com `npm run tv`
- **Um único arquivo contínuo** (muitas TVs param depois do primeiro vídeo)
- **Margem segura** `layout.safe` px (overscan) · **texto ≥ 34px** (vista de 3 m) · cena ≥ 5s com cinema ligado
- Toda interação tem **indicador de toque** · arquivo final < 4GB (FAT32)

## Estrutura

| Caminho | Papel |
|---|---|
| `projects/<app>/config.ts` | **Aparência** do app. Só sobrescreve o que difere de `src/defaults.ts` |
| `projects/<app>/scenes.ts` | **Roteiro**: ordem, duração, textos, toques |
| `projects/<app>/public/` | Prints (`screens/`), logo, fontes do app. Nome sem acento/espaço |
| `src/defaults.ts` | Valores padrão de toda a aparência |
| `src/resolve.ts` | Mescla defaults + projeto e calcula a geometria (pura; a CLI usa a mesma) |
| `src/config.ts`, `src/scenes.ts` | Pontes para o projeto escolhido (alias `@project`, ver `remotion.config.ts`) |
| `src/devices.ts` | Catálogo de aparelhos (aproximações da linguagem visual; ajuste aqui se houver spec oficial) |
| `src/palettes.ts` | Paletas prontas |
| `src/components/`, `Video.tsx` | Peças burras — leem tudo do config |
| `bin/showcase.ts` | CLI (`new`, `screens`, `doctor`, `studio`, `still`, `render`, `tv`, `loopcheck`, `list`) |
| `templates/base/` | Molde de projeto novo |

## Regra de ouro

**Nenhum componente tem cor, fonte ou medida escrita por dentro.** Valor novo → adicione a `src/types.ts` +
`src/defaults.ts` e leia de `config`. Vale para valores "óbvios" ou usados uma vez só.

- Mudança de roteiro → só `projects/<app>/scenes.ts`
- Mudança de aparência de **um app** → só `projects/<app>/config.ts`
- Mudança que vale para **todos** → `src/` (e rode o `doctor`/still em pelo menos dois projetos, um claro e um escuro)
- Nunca edite `projects/` de um app para resolver algo de outro

## O loop (não quebre)

A peça fecha sozinha: movimento de câmera é seno/cosseno com ciclo inteiro sobre a duração total, e a primeira
cena reaparece cruzando com a última (`frozen`).

- Nada de cartela de abertura/encerramento, nem fade de/para preto nas pontas
- Animação contínua nova precisa de número inteiro de ciclos sobre `total` (`frame % periodo` que não divide `total` pisca na volta)
- Mudou duração de cena? Rode `npm run loopcheck -- <app>` (PSNR ≥ 30 dB e olhe os PNGs)

Um vertical de celular em canvas 16:9 deixa vazios laterais: por isso o aparelho fica de lado e o texto ocupa o resto.

## Comandos

```bash
npm install
npm run new -- <app>            # cria projects/<app>
npm run screens -- <app> *.png  # importa prints no tamanho do aparelho
npm run doctor -- <app>         # valida
npm run studio -- <app>         # preview
npm run still -- <app> 90       # PNG de um frame → LEIA a imagem antes de dizer que está pronto
npm run render -- <app>         # out/<app>.mp4
npm run tv -- <app>             # out/<app>-tv.mp4 (entregável)
npm run loopcheck -- <app>
npm run typecheck
```

## Ao trabalhar aqui

- Depois de qualquer mudança visual, gere um `still` e **olhe a imagem**; não declare pronto sem ver.
- Não adicione biblioteca de animação externa: `spring` e `interpolate` do Remotion bastam.
- Não apague `out/` nem arquivos de projeto; para tirar do caminho, renomeie com `.bak`.
- `out/` e `node_modules/` não vão para o git.
