---
name: novo-video-de-app
description: Cria (ou ajusta) o vídeo de apresentação de um app neste repositório — de prints e gravações de tela até o MP4, para TV/pen drive em loop ou para apresentar a clientes, site e redes. Use quando o pedido for "faz um vídeo do app X", "apresentação do app em vídeo", "vídeo para a TV do evento/loja", ou para trocar cena, cor, aparelho ou texto de um vídeo existente.
---

# Novo vídeo de app

Repositório: motor em `src/`, um projeto por app em `projects/<app>/`. Leia `CLAUDE.md` para as regras de TV e do loop.

## Fluxo

1. **Levante o mínimo** (pergunte só o que faltar, não tudo):
   - nome do app (vira o `<app>`: minúsculas, números, hífen)
   - **para quê** é o vídeo: TV/telão em loop (`mode: 'tv'`, padrão) ou apresentação para alguém assistir (`mode: 'apresentacao'`)
   - pasta/arquivos com os prints e/ou gravações de tela (ou, se não houver, siga com placeholders)
   - cor principal (hex) e se prefere fundo claro ou escuro
   - 3 a 6 telas e a ideia de cada uma (o que o usuário ganha, não o que o botão faz)
   - aparelho: iPhone ou Pixel
2. `npm run new -- <app>`. Se o projeto já existe, **edite-o**; não recrie.
3. **Prints e gravações**: `npm run screens -- <app> <arquivos>` (PNG/JPG e .mov/.mp4; vídeo vira MP4 30 fps sem áudio). Se não houver prints, capture do simulador/emulador
   (`docs/CAPTURA-DE-TELAS.md`) quando o app estiver rodando localmente; senão deixe `screen` de fora.
   Nunca use dados pessoais reais nos prints.
4. **Roteiro** em `projects/<app>/scenes.ts`: um `id` por tela, `screen` (print) **ou** `video` (gravação, que precisa durar ≥ `seconds`), `eyebrow` curto, `title` ≤ 48 caracteres, `bullet` de uma frase,
   `seconds` ≥ 5, e `taps` (x/y em % da tela, `at` em segundos) sobre o botão realmente tocado — **abra o print e leia a posição**, não chute.
5. **Aparência** em `projects/<app>/config.ts`: `accent` e `accentSoft` em hex de 6 dígitos, paleta pronta
   (`src/palettes.ts`) se servir, `logo` se houver, `mode`, e `audio.file` se pedirem trilha (só faz sentido em apresentação). Só sobrescreva o que difere do padrão.
6. `npm run doctor -- <app>` — corrija todo erro; avalie cada aviso.
7. **Olhe o resultado** (nunca `npm run studio`, que não retorna): `npm run still -- <app> <frame>` em pelo menos uma cena de cada tela e **leia as imagens**.
   Confira título quebrando em 3 linhas, texto contra o fundo, toque sobre o botão certo, print cortado.
8. Só no modo `tv`: `npm run loopcheck -- <app>` e olhe os dois PNGs.
9. Entregável: modo `apresentacao` → `npm run render -- <app>` (`out/<app>.mp4`); modo `tv` → `npm run tv -- <app>` (`out/<app>-tv.mp4`, recusa placeholder). Diga o caminho e a duração; no modo `tv`, lembre de testar na TV do evento.

## Cuidados

- Mudança que vale para todos os apps vai em `src/`; mudança de um app, só na pasta dele.
- Modo `tv`: não quebre o loop (sem cartela de abertura/encerramento, sem fade para preto). Modo `apresentacao`: abertura e encerramento são bem-vindos.
- Não apague nada; para tirar algo do caminho, renomeie com `.bak`.
- Ritmo e texto final são decisão do dono do app: mostre o still/vídeo e peça ajuste, não declare "ficou ótimo".
