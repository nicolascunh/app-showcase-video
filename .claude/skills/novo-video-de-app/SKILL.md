---
name: novo-video-de-app
description: Cria (ou ajusta) o vídeo de apresentação de um app neste repositório — de prints até o MP4 para TV/pen drive. Use quando o pedido for "faz um vídeo do app X", "apresentação do app em vídeo", "vídeo para a TV do evento/loja", ou para trocar cena, cor, aparelho ou texto de um vídeo existente.
---

# Novo vídeo de app

Repositório: motor em `src/`, um projeto por app em `projects/<app>/`. Leia `CLAUDE.md` para as regras de TV e do loop.

## Fluxo

1. **Levante o mínimo** (pergunte só o que faltar, não tudo):
   - nome do app (vira o `<app>`: minúsculas, números, hífen)
   - pasta/arquivos com os prints (ou, se não houver, siga com placeholders)
   - cor principal (hex) e se prefere fundo claro ou escuro
   - 3 a 6 telas e a ideia de cada uma (o que o usuário ganha, não o que o botão faz)
   - aparelho: iPhone ou Pixel
2. `npm run new -- <app>`. Se o projeto já existe, **edite-o**; não recrie.
3. **Prints**: `npm run screens -- <app> <arquivos>`. Se não houver prints, capture do simulador/emulador
   (`docs/CAPTURA-DE-TELAS.md`) quando o app estiver rodando localmente; senão deixe `screen` de fora.
   Nunca use dados pessoais reais nos prints.
4. **Roteiro** em `projects/<app>/scenes.ts`: um `id` por tela, `eyebrow` curto, `title` ≤ 48 caracteres, `bullet` de uma frase,
   `seconds` ≥ 5, e `taps` (x/y em % da tela, `at` em segundos) sobre o botão realmente tocado.
5. **Aparência** em `projects/<app>/config.ts`: `accent` e `accentSoft` em hex de 6 dígitos, paleta pronta
   (`src/palettes.ts`) se servir, `logo` se houver. Só sobrescreva o que difere do padrão.
6. `npm run doctor -- <app>` — corrija todo erro; avalie cada aviso.
7. **Olhe o resultado**: `npm run still -- <app> <frame>` em pelo menos uma cena de cada tela e **leia as imagens**.
   Confira título quebrando em 3 linhas, texto contra o fundo, toque sobre o botão certo, print cortado.
8. `npm run loopcheck -- <app>` e olhe os dois PNGs.
9. Entregável: `npm run tv -- <app>` → `out/<app>-tv.mp4`. Diga o caminho, a duração e lembre de testar na TV do evento.

## Cuidados

- Mudança que vale para todos os apps vai em `src/`; mudança de um app, só na pasta dele.
- Não quebre o loop (sem cartela de abertura/encerramento, sem fade para preto).
- Não apague nada; para tirar algo do caminho, renomeie com `.bak`.
- Ritmo e texto final são decisão do dono do app: mostre o still/vídeo e peça ajuste, não declare "ficou ótimo".
