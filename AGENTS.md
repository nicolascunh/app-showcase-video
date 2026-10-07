# Instruções para agentes de IA

Leia **`CLAUDE.md`** (regras, estrutura e comandos) e **`.claude/skills/novo-video-de-app/SKILL.md`** (passo a passo
para criar um vídeo de app novo). Vale para qualquer agente — Claude Code, Codex, Cursor, etc.

Resumo do essencial:

1. Primeiro pergunte (ou deduza) se o vídeo é para **TV em loop** (`mode: 'tv'`) ou **apresentação** (`mode: 'apresentacao'`).
2. `npm install` → `npm run new -- <app>` → `npm run screens -- <app> <prints e gravações>` → escrever
   `projects/<app>/scenes.ts` e `config.ts` → `npm run doctor -- <app>`.
3. **Não rode `npm run studio`** (fica em primeiro plano). Confira com `npm run still -- <app> <frame>` e **leia a imagem**.
4. Entrega: `npm run render -- <app>` (apresentação) ou `npm run tv -- <app>` (TV).
5. Tudo de um app fica em `projects/<app>/`; `src/` só muda para melhorar **todos** os apps.
6. Não apague arquivos: renomeie com `.bak`. Não declare "ficou ótimo" sem ter visto os frames.
