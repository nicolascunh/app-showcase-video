# app-showcase-video

Gera **vídeo de apresentação de app** a partir de **prints e gravações de tela**, para:

- **TV de evento ou loja** (loop contínuo, pen drive) → modo `tv`
- **Apresentação de projeto** (reunião, proposta a cliente, site, redes, loja de apps) → modo `apresentacao`

Um repositório, **uma pasta por app**, o mesmo comando para todos. Feito com [Remotion](https://www.remotion.dev).
Saída: MP4 H.264 1920×1080 30 fps.

```
projects/
  meu-app/
    config.ts      ← aparência (cores, aparelho, fundo, câmera, modo, trilha)
    scenes.ts      ← roteiro (textos, duração, prints/vídeos, toques)
    public/        ← prints, gravações, logo, fontes, trilha DESTE app
src/               ← motor (igual para todos os apps — não precisa mexer)
templates/base/    ← molde copiado por `npm run new`
```

## Começar em 5 comandos

Pré-requisito: **Node 18+**. `ffmpeg` é opcional (sem ele, usa o que vem no Remotion).
Na primeira renderização o Remotion baixa um Chrome próprio (precisa de internet, uma vez só).

```bash
git clone <este-repo> && cd app-showcase-video
npm install

npm run new -- meu-app                                   # cria projects/meu-app
npm run screens -- meu-app ~/Desktop/prints/*.png        # importa prints (e .mov/.mp4) no tamanho certo
npm run still -- meu-app 90                              # PNG de um frame, para conferir
npm run render -- meu-app                                # gera out/meu-app.mp4  (TV: npm run tv)
```

Quer ver funcionando antes de criar o seu? Gere os exemplos:
`npm run render -- exemplo` (TV, só prints) ou `npm run render -- exemplo-apresentacao` (apresentação, com gravação de tela).

## Prints **e** vídeos

Cada cena mostra **um print** (`screen: 'home.png'`) **ou uma gravação de tela** (`video: 'fluxo.mp4'`) dentro do aparelho.
Os dois podem se misturar no mesmo roteiro.

- Aceita na importação: PNG/JPG e vídeos `.mov`, `.mp4`, `.m4v`, `.webm`, `.mkv` (ex.: gravação do simulador iOS ou do Android).
- `npm run screens` converte tudo para o tamanho exato do aparelho; vídeos viram MP4 30 fps sem áudio.
- A gravação precisa ter **pelo menos `seconds` de duração** (o `doctor` avisa). Se for maior, o excedente é cortado.
- Os toques (`taps`) também funcionam sobre vídeo, se quiser reforçar um clique.

## Dois modos (`mode` no `config.ts`)

| | `tv` (padrão) | `apresentacao` |
|---|---|---|
| Uso | TV/telão rodando sozinho | Alguém assiste uma vez (reunião, site, redes) |
| Fim do vídeo | Volta ao início sem emenda (loop) | Termina na última cena, sem fade |
| Abertura/encerramento | **Não pode** (quebra o loop) | Pode |
| Texto mínimo / margem segura | ≥ 34 px / `layout.safe` 96 px (o `doctor` cobra) | Livre |
| Cena mínima | 5 s com cinema ligado | Livre |
| Áudio | Mudo (faixa silenciosa no `npm run tv`) | Opcional: `audio: { file: 'trilha.mp3' }` |
| Entrega | `npm run tv` → `out/<app>-tv.mp4` | `npm run render` → `out/<app>.mp4` |

## Comandos

| Comando | O que faz |
|---|---|
| `npm run new -- <app>` | Cria `projects/<app>` a partir do template |
| `npm run list` | Lista os projetos, modo, cenas e duração |
| `npm run screens -- <app> a.png b.mov …` | Importa prints e gravações no tamanho do aparelho (sem acento/espaço no nome). Nunca sobrescreve: cria `-2`, `-3` |
| `npm run doctor -- <app>` | Valida roteiro, mídias, durações, regras do modo, trilha… |
| `npm run studio -- <app>` | Preview no navegador com timeline (**fica rodando**; para IA, prefira `still`) |
| `npm run still -- <app> [frame]` | PNG de um frame (padrão 90) em `out/` — **olhe antes de dizer que ficou bom** |
| `npm run render -- <app>` | `out/<app>.mp4` (roda o `doctor` antes) |
| `npm run tv -- <app>` | `out/<app>-tv.mp4`: perfil de TV/pen drive (H.264 High 4.0, áudio AAC). **Bloqueia** se faltar tela ou sobrar texto de exemplo |
| `npm run loopcheck -- <app>` | (modo `tv`) compara último e primeiro frame (PSNR ≥ 30 dB = volta contínua) |

Se só existir um projeto, ou se `SHOWCASE_PROJECT=<app>` estiver exportado, o nome pode ser omitido.

## Do print ao vídeo

1. **Capture as telas** ([docs/CAPTURA-DE-TELAS.md](docs/CAPTURA-DE-TELAS.md)): simulador, aparelho ou Figma. Prefira dados de demonstração, nunca dados pessoais reais.
2. `npm run screens -- meu-app <arquivos>`
3. `projects/meu-app/scenes.ts`: uma cena por tela (`screen` ou `video`, `eyebrow`, `title`, `bullet`, `seconds`, `taps`).
   Para posicionar um toque, abra o print e estime o ponto do botão em % (x da esquerda, y do topo).
4. `projects/meu-app/config.ts`: `mode`, cores do app, aparelho, logo.
5. `npm run doctor -- meu-app` → `npm run still -- meu-app <frame>` → `npm run render -- meu-app` (ou `tv`).

Sem print ainda? Deixe `screen`/`video` de fora: entra um placeholder com o título e o vídeo já roda, útil para fechar o roteiro primeiro (mas o `tv` não deixa entregar assim).

## Personalização (`config.ts`)

Escreva só o que quiser mudar; o resto vem de [`src/defaults.ts`](src/defaults.ts).
Nenhum componente tem cor ou medida escrita por dentro.

| Opção | Efeito |
|---|---|
| `mode` | `'tv'` ou `'apresentacao'` (tabela acima) |
| `brand` | Paleta. Prontas em `src/palettes.ts`: `ambar`, `claro`, `azul`, `verde` (`brand: { ...palettes.verde }`). `accent`/`accentSoft` em hex de 6 dígitos |
| `audio` | `{ file: 'trilha.mp3', volume: 0.6 }` — trilha em `public/`, repete se for menor que o vídeo |
| `font.files` | Fontes locais em `public/` (`{ family, file, weight }`) — o vídeo sai igual em qualquer máquina. Sem isso, usa SF Pro/Segoe/Roboto do sistema |
| `size` | Escala de texto (mínimo 34 px no modo `tv`) |
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

## Regras de TV (modo `tv`; o `doctor` confere)

- **Um único arquivo contínuo** (muitas TVs param após o primeiro vídeo) e **loop que fecha sozinho**
- Margem segura de `layout.safe` px (overscan), texto ≥ 34 px, cenas ≥ 5 s com cinema ligado
- Todo toque tem indicador visual (ninguém vê o dedo de quem apresenta)
- Pen drive em **FAT32** → arquivo < 4 GB, copiado sozinho na raiz. **Teste na TV do evento antes do dia.**
- Não crie cartela de abertura/encerramento: só apareceria de um lado da volta do loop

## Outros formatos

`npm run render` gera 1920×1080. Para 4K: `SHOWCASE_PROJECT=<app> npx remotion render Showcase out/<app>-4k.mp4 --scale=2 --public-dir=projects/<app>/public`.
O layout atual é 16:9 (TV, telão, apresentação, YouTube). Vertical 9:16 para stories/reels exigiria outro layout (não existe ainda).

---

## Usando com uma IA (Claude Code, Codex, Cursor…)

**Funciona, e foi pensado para isso.** O repositório traz instruções que a IA lê sozinha ao abrir a pasta:
`CLAUDE.md` (Claude Code), `AGENTS.md` (Codex, Cursor e outras) e a skill `.claude/skills/novo-video-de-app/`.
Todos os comandos têm mensagens de erro que dizem o que fazer a seguir, e o `doctor` pega a maioria dos erros antes de renderizar.

### Como pedir

Abra a IA **dentro da pasta do repositório** (`cd app-showcase-video`) e peça em linguagem natural. Quanto mais você
entregar de uma vez, menos ela precisa perguntar:

> "Cria um vídeo de apresentação do app **Meu App**. Prints em `~/Desktop/prints`. Cor `#0A84FF`, fundo escuro, iPhone.
> É para **mostrar para um cliente** (modo apresentação), 4 cenas: login, painel, pedido, confirmação."

> "Faz o vídeo para a **TV da loja**, em loop, com os prints de `~/Desktop/prints` e a gravação `~/Desktop/fluxo.mov` na cena 2."

> "No vídeo do `meu-app`: deixa a cena 2 mais longa, move o toque para o botão de baixo e troca para a paleta clara."

### O que a IA faz sozinha, e o que depende de você

| A IA faz | Você precisa dar / decidir |
|---|---|
| Instala, cria o projeto, importa prints e gravações, escreve o roteiro e a aparência | Os **prints e gravações** (ou acesso a um simulador rodando o app) |
| Roda o `doctor`, gera frames e **olha as imagens** para achar título quebrado, toque no lugar errado, print cortado | **Para quê** é o vídeo (TV em loop ou apresentação) |
| Renderiza o MP4 final e diz onde está | Cor, nome e texto final: ela propõe, **você aprova** |
| Corrige o que o `doctor` apontar | Testar na **TV do evento** antes do dia (nenhuma IA faz isso) |

### O que costuma dar errado (e já está tratado)

| Armadilha | Como o repositório se defende |
|---|---|
| IA entrega vídeo com o texto de exemplo ou "tela pendente" | `npm run tv` **recusa** e lista o que falta |
| Gravação mais curta que a cena | `doctor` dá erro com a duração real |
| Print em proporção errada | `doctor` avisa; `npm run screens` corrige |
| IA roda `npm run studio` e fica esperando para sempre | `CLAUDE.md`/`AGENTS.md`/skill mandam usar `still` (o studio só serve para uma pessoa olhar) |
| IA quebra o loop com cartela de abertura (modo `tv`) | Regra escrita em `CLAUDE.md` e conferida por `npm run loopcheck` |
| IA mexe no motor (`src/`) para resolver um problema de um app só | Regra: o que é de um app fica em `projects/<app>/` |
| Esquecer o nome do projeto | Erro lista os projetos existentes e o comando certo |

### Limites honestos

- Testado em **macOS** com Node 20. Linux deve funcionar; **Windows não foi testado** (a CLI chama binários de `node_modules/.bin`).
- A IA precisa **conseguir ler imagens** para revisar os frames; sem isso ela só valida pelo `doctor`.
- O julgamento de **ritmo, texto e identidade** é humano: a IA monta, você revisa.
- Tempo de render medido: vídeo de 18 s ≈ **24 s** num Mac M5; máquinas mais fracas levam alguns minutos. A primeira vez baixa o Chrome do Remotion.

## Solução de problemas

| Sintoma | Causa / solução |
|---|---|
| `Defina o projeto…` ao rodar `npx remotion` direto | Use `npm run studio -- <app>`, ou exporte `SHOWCASE_PROJECT=<app>` |
| `Há N projetos… Diga qual` | Passe o nome: `npm run <comando> -- <app>` |
| Fonte diferente do esperado | Fonte do sistema não existe nesta máquina → use `font.files` |
| Título quebra em 3 linhas | Encurte (≤ 48 caracteres) ou reduza `size.title` (mínimo prático 60) |
| Vídeo da cena trava/some depois de alguns segundos | A gravação é mais curta que `seconds` (veja o `doctor`) |
| TV não toca o arquivo | Use `npm run tv` (não `render`), FAT32, arquivo sozinho na raiz |
| `npm audit` reclama de `extract-zip` | Vem do Remotion (download do Chrome); não afeta o render local |
