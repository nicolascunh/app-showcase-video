# app-showcase-video

Gera **vídeo de apresentação de app** (TV de evento, loja, redes) a partir dos prints do app.
Um repositório, **uma pasta por app**, o mesmo comando para todos.

Feito com [Remotion](https://www.remotion.dev). Saída padrão: MP4 H.264 1920×1080 30 fps,
em **loop contínuo** (o último frame fecha no primeiro), pronto para rodar em TV por pen drive.

```
projects/
  meu-app/
    config.ts      ← aparência (cores, aparelho, fundo, câmera)
    scenes.ts      ← roteiro (textos, duração, toques)
    public/        ← prints, logo, fontes DESTE app
src/               ← motor (igual para todos os apps — não precisa mexer)
templates/base/    ← molde copiado por `npm run new`
```

## Começar em 5 comandos

Pré-requisito: **Node 18+**. (`ffmpeg` é opcional: se não houver, usa o que vem no Remotion.)

```bash
git clone <este-repo> && cd app-showcase-video
npm install

npm run new -- meu-app                                  # cria projects/meu-app
npm run screens -- meu-app ~/Desktop/prints/*.png       # importa os prints no tamanho certo
npm run studio -- meu-app                               # preview com timeline
npm run tv -- meu-app                                   # gera out/meu-app-tv.mp4
```

Teste sem nada seu: `npm run studio -- exemplo` (app fictício com telas) ou `-- prime`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run new -- <app>` | Cria `projects/<app>` a partir do template |
| `npm run list` | Lista os projetos, cenas e duração |
| `npm run screens -- <app> a.png b.jpg …` | Converte prints para o tamanho exato do aparelho (sem acento/espaço no nome) e salva em `public/screens/`. Nunca sobrescreve: cria `-2`, `-3` |
| `npm run doctor -- <app>` | Valida roteiro, prints, tamanho de texto, margem segura, toques fora da tela… |
| `npm run studio -- <app>` | Preview no navegador; recarrega ao salvar |
| `npm run still -- <app> [frame]` | PNG de um frame (padrão 90) em `out/` — **olhe antes de dizer que ficou bom** |
| `npm run render -- <app>` | `out/<app>.mp4` (roda o `doctor` antes) |
| `npm run tv -- <app>` | `out/<app>-tv.mp4`: + faixa de áudio muda AAC e perfil H.264 High 4.0 (algumas TVs recusam vídeo sem áudio) |
| `npm run loopcheck -- <app>` | Compara o último frame com o primeiro (PSNR) e salva os dois PNGs |

Se só existir um projeto, ou se `SHOWCASE_PROJECT=<app>` estiver exportado, o nome pode ser omitido.

## Do print ao vídeo

1. **Capture as telas** (veja [docs/CAPTURA-DE-TELAS.md](docs/CAPTURA-DE-TELAS.md)): simulador, aparelho ou Figma.
2. `npm run screens -- meu-app <arquivos>`: ajusta ao aparelho escolhido.
3. Em `projects/meu-app/scenes.ts`, uma cena por tela: `screen`, `eyebrow`, `title`, `bullet`, `seconds`, `taps`.
4. Em `projects/meu-app/config.ts`, cores do app e aparelho.
5. `npm run doctor -- meu-app` → `npm run studio -- meu-app` → `npm run tv -- meu-app`.

Sem print ainda? Deixe `screen` de fora: entra um placeholder com o título e o vídeo já roda,
útil para fechar o roteiro primeiro.

## Personalização (`config.ts`)

Escreva só o que quiser mudar; o resto vem de [`src/defaults.ts`](src/defaults.ts).
Nenhum componente tem cor ou medida escrita por dentro.

| Opção | Efeito |
|---|---|
| `brand` | Paleta. Prontas em `src/palettes.ts`: `ambar`, `claro`, `azul`, `verde` (`brand: { ...palettes.verde }`). `accent`/`accentSoft` em hex de 6 dígitos |
| `font.files` | Fontes locais em `public/` (`{ family, file, weight }`) — o vídeo sai igual em qualquer máquina. Sem isso, usa SF Pro/Segoe/Roboto do sistema |
| `size` | Escala de texto. **Não desça de 34 px** |
| `layout.device` | `iphone-17-pro-max`, `pixel-10-pro-xl`, `generico` (medidas em `src/devices.ts`) |
| `layout.phoneSide` | `left`, `right` ou `center` (center vira faixa de texto embaixo) |
| `layout.phoneScale` / `screenHeight` | Tamanho do aparelho |
| `layout.showDevice` | `false` = tela cheia, sem moldura |
| `backdrop.motif` | `glow`, `beam` (cinema), `grid` (técnico), `none` |
| `logo` | `{ file: 'logo.png', position, height }` — PNG em `public/` |
| `cinematic.camera` | `orbit`, `push`, `drift`, `none` (+ `cameraAmount`) |
| `cinematic.crossfade` / `tilt` / `glassSweep` / `vignette` / `letterbox` | Cruzamento, perspectiva, reflexo, bordas, barras |
| `cinematic.enabled` | `false` = cortes secos, sem movimento |
| `labels.placeholder` | Texto do placeholder (idioma) |

Outro aparelho? Adicione uma entrada em `src/devices.ts` — nenhum componente muda.

## Regras de TV (o `doctor` confere)

- **Um único arquivo contínuo** (muitas TVs param após o primeiro vídeo) e **loop que fecha sozinho**
- Margem segura de `layout.safe` px (overscan), texto ≥ 34 px, cenas ≥ 5 s com cinema ligado
- Todo toque tem indicador visual (ninguém vê o dedo de quem apresenta)
- Pen drive em **FAT32** → arquivo < 4 GB, copiado sozinho na raiz. **Teste na TV do evento antes do dia.**
- Não crie cartela de abertura/encerramento: só apareceria de um lado da volta do loop

## Outros formatos

`npm run render` gera 1920×1080. Para 4K: `SHOWCASE_PROJECT=<app> npx remotion render Showcase out/<app>-4k.mp4 --scale=2 --public-dir=projects/<app>/public`.
O layout atual é 16:9 (TV/telão); vertical para redes sociais exigiria outro layout.

## Trabalhando com o Claude Code

Abra o Claude Code nesta pasta. O `CLAUDE.md` e a skill `novo-video-de-app` já explicam o fluxo:

> "Cria um vídeo de apresentação para o app X com estes prints (pasta ~/Desktop/prints), cores #0A84FF, três cenas"

> "Deixa a cena 2 mais longa e move o toque pro botão"

> "Troca para a paleta clara e me mostra o frame 6s"

Ele edita, renderiza e olha os frames. O ritmo e o texto final continuam sendo decisão sua.

## Solução de problemas

| Sintoma | Causa / solução |
|---|---|
| `Defina o projeto…` ao rodar `npx remotion` direto | Use `npm run studio -- <app>`, ou exporte `SHOWCASE_PROJECT=<app>` |
| Fonte diferente do esperado | Fonte do sistema não existe nesta máquina → use `font.files` |
| Título quebra em 3 linhas | Encurte (≤ 48 caracteres) ou reduza `size.title` (mínimo prático 60) |
| TV não toca o arquivo | Use `npm run tv` (não `render`), FAT32, arquivo sozinho na raiz |
| `npm audit` reclama de `extract-zip` | Vem do Remotion (download do Chrome); não afeta o render local |
