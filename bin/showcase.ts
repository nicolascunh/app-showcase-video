/**
 * CLI do app-showcase-video.
 *
 *   npm run new -- <nome>                   cria projects/<nome> a partir do template
 *   npm run list                            lista os projetos
 *   npm run screens -- <nome> a.png b.png   importa prints já no tamanho certo do aparelho
 *   npm run doctor -- <nome>                valida roteiro, telas, regras de TV e ambiente
 *   npm run studio -- <nome>                preview com timeline
 *   npm run still -- <nome> [frame]         PNG de um frame (padrão: 90)
 *   npm run render -- <nome>                out/<nome>.mp4
 *   npm run tv -- <nome>                    out/<nome>-tv.mp4 (áudio mudo, perfil de TV/pen drive)
 *   npm run loopcheck -- <nome>             compara último e primeiro frame (volta do loop)
 *
 * <nome> pode ser omitido se existir um único projeto, ou se SHOWCASE_PROJECT estiver definido.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { resolve } from '../src/resolve';
import type { Scene, UserConfig } from '../src/types';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS = path.join(ROOT, 'projects');
const TEMPLATE = path.join(ROOT, 'templates', 'base');
const OUT = path.join(ROOT, 'out');
const FPS = 30;

const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

const die = (msg: string): never => {
  console.error(c.red(`✗ ${msg}`));
  process.exit(1);
};

/* ───────────── projeto ───────────── */

const listProjects = () =>
  fs.existsSync(PROJECTS)
    ? fs
        .readdirSync(PROJECTS, { withFileTypes: true })
        .filter((d) => d.isDirectory() && fs.existsSync(path.join(PROJECTS, d.name, 'scenes.ts')))
        .map((d) => d.name)
    : [];

const pickSlug = (arg?: string): string => {
  const slug = arg ?? process.env.SHOWCASE_PROJECT;
  if (slug) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug))
      die(`Nome de projeto inválido "${slug}". Use minúsculas, números e hífen.`);
    if (!fs.existsSync(path.join(PROJECTS, slug, 'scenes.ts')))
      die(`Projeto "${slug}" não existe. Projetos: ${listProjects().join(', ') || '(nenhum)'}. Crie com: npm run new -- ${slug}`);
    return slug;
  }
  const all = listProjects();
  if (all.length === 1) return all[0];
  return die(
    all.length === 0
      ? 'Nenhum projeto ainda. Crie um: npm run new -- <nome>'
      : `Há ${all.length} projetos (${all.join(', ')}). Diga qual: npm run <comando> -- <nome>`,
  );
};

const projectDir = (slug: string) => path.join(PROJECTS, slug);

const loadProject = async (slug: string) => {
  const dir = projectDir(slug);
  const cfgMod = await import(pathToFileURL(path.join(dir, 'config.ts')).href);
  const scMod = await import(pathToFileURL(path.join(dir, 'scenes.ts')).href);
  const userConfig = cfgMod.userConfig as UserConfig | undefined;
  const scenes = scMod.scenes as Scene[] | undefined;
  if (!userConfig) die(`projects/${slug}/config.ts precisa exportar "userConfig".`);
  if (!Array.isArray(scenes)) die(`projects/${slug}/scenes.ts precisa exportar "scenes".`);
  return { dir, ...resolve(userConfig!), scenes: scenes! };
};

const totalSeconds = (scenes: Scene[]) =>
  scenes.reduce((a, s) => a + Math.round(s.seconds * FPS), 0) / FPS;

/* ───────────── execução ───────────── */

const bin = (name: string) => path.join(ROOT, 'node_modules', '.bin', name);

const run = (cmd: string, args: string[], env: NodeJS.ProcessEnv = {}) => {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (r.error) die(`Não consegui executar ${cmd}: ${r.error.message}`);
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const remotion = (slug: string, args: string[]) =>
  run(bin('remotion'), [...args, `--public-dir=${path.join(projectDir(slug), 'public')}`], {
    SHOWCASE_PROJECT: slug,
  });

const hasCmd = (cmd: string) => spawnSync(cmd, ['-version'], { stdio: 'ignore' }).status === 0;

/** ffmpeg do sistema, ou o que vem embutido no Remotion. */
const ffmpegInvocation = (): { cmd: string; pre: string[] } => {
  if (hasCmd('ffmpeg')) return { cmd: 'ffmpeg', pre: [] };
  return { cmd: bin('remotion'), pre: ['ffmpeg'] };
};

const ffmpeg = (args: string[], opts: { capture?: boolean } = {}) => {
  const { cmd, pre } = ffmpegInvocation();
  const r = spawnSync(cmd, [...pre, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: opts.capture ? 'pipe' : 'inherit',
    // remotion.config.ts exige um projeto, mesmo para `remotion ffmpeg`
    env: { ...process.env, SHOWCASE_PROJECT: process.env.SHOWCASE_PROJECT ?? '_' },
  });
  return r;
};

/* ───────────── PNG ───────────── */

const pngSize = (file: string): { w: number; h: number } | null => {
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    if (buf.toString('ascii', 1, 4) !== 'PNG') return null;
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  } finally {
    fs.closeSync(fd);
  }
};

/* ───────────── comandos ───────────── */

const cmdNew = (name?: string) => {
  if (!name) die('Uso: npm run new -- <nome-do-app>   (ex: npm run new -- meu-app)');
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name!)) die('Nome: só minúsculas, números e hífen (ex: meu-app).');
  const dest = projectDir(name!);
  if (fs.existsSync(dest)) die(`projects/${name} já existe. Nada foi alterado.`);
  fs.mkdirSync(PROJECTS, { recursive: true });
  fs.cpSync(TEMPLATE, dest, { recursive: true });
  console.log(c.green(`✓ projects/${name} criado`));
  console.log(`
Próximos passos:
  1. Cores e aparelho ........ projects/${name}/config.ts
  2. Roteiro (textos/cenas) .. projects/${name}/scenes.ts
  3. Prints do app ........... npm run screens -- ${name} ~/Desktop/prints/*.png
  4. Conferir ................ npm run doctor -- ${name}
  5. Ver ..................... npm run studio -- ${name}
  6. Gerar ................... npm run render -- ${name}   (TV: npm run tv -- ${name})
`);
};

const cmdList = async () => {
  const all = listProjects();
  if (!all.length) return console.log('Nenhum projeto. Crie: npm run new -- <nome>');
  for (const slug of all) {
    try {
      const p = await loadProject(slug);
      console.log(`${c.bold(slug)}  ${c.dim(`${p.scenes.length} cenas · ${totalSeconds(p.scenes)}s · ${p.device.label}`)}`);
    } catch (e) {
      console.log(`${c.bold(slug)}  ${c.red('erro ao carregar: ' + (e as Error).message)}`);
    }
  }
};

const cmdScreens = async (slug: string, files: string[]) => {
  if (!files.length) die('Uso: npm run screens -- <nome> print1.png print2.jpg ...');
  const p = await loadProject(slug);
  const { w, h } = p.device.exportSize;
  const destDir = path.join(p.dir, 'public', 'screens');
  fs.mkdirSync(destDir, { recursive: true });

  for (const f of files) {
    const src = path.resolve(f);
    if (!fs.existsSync(src)) {
      console.log(c.yellow(`! não achei ${f}, pulei`));
      continue;
    }
    const base = path
      .basename(src, path.extname(src))
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'tela';
    let out = path.join(destDir, `${base}.png`);
    if (fs.existsSync(out)) {
      // nunca sobrescreve: guarda ao lado com sufixo numérico
      let i = 2;
      while (fs.existsSync(path.join(destDir, `${base}-${i}.png`))) i++;
      out = path.join(destDir, `${base}-${i}.png`);
      console.log(c.yellow(`! ${base}.png já existe, salvando como ${path.basename(out)}`));
    }
    // cobre a área e corta o excesso pelo topo (barra de status fica, rodapé cede)
    const r = ffmpeg(
      ['-y', '-loglevel', 'error', '-i', src, '-vf', `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}:(iw-${w})/2:0`, '-frames:v', '1', out],
      { capture: true },
    );
    if (r.status !== 0) {
      console.log(c.red(`✗ ${f}: ${String(r.stderr).trim().split('\n').pop()}`));
      continue;
    }
    console.log(c.green(`✓ ${path.basename(out)}`) + c.dim(`  ${w}×${h}  (${p.device.label})`));
  }
  console.log(c.dim(`\nAgora aponte "screen" em projects/${slug}/scenes.ts. Depois: npm run doctor -- ${slug}`));
};

type Level = 'ok' | 'warn' | 'fail';

const cmdDoctor = async (slug: string): Promise<boolean> => {
  const results: { level: Level; msg: string }[] = [];
  const add = (level: Level, msg: string) => results.push({ level, msg });

  const nodeMajor = Number(process.versions.node.split('.')[0]);
  add(nodeMajor >= 18 ? 'ok' : 'fail', `Node ${process.versions.node}${nodeMajor >= 18 ? '' : ' (precisa 18+)'}`);
  add(
    hasCmd('ffmpeg') ? 'ok' : 'warn',
    hasCmd('ffmpeg') ? 'ffmpeg do sistema' : 'ffmpeg não instalado — uso o embutido no Remotion (ok)',
  );

  let p: Awaited<ReturnType<typeof loadProject>>;
  try {
    p = await loadProject(slug);
  } catch (e) {
    add('fail', `projects/${slug} não carregou: ${(e as Error).message}`);
    return report(slug, results);
  }
  const { config, device, scenes, dir } = p;
  add('ok', `Projeto "${slug}" carregado — ${scenes.length} cenas, ${totalSeconds(scenes)}s, ${device.label}`);

  if (scenes.length === 0) add('fail', 'Roteiro vazio.');

  const ids = new Set<string>();
  for (const s of scenes) {
    if (ids.has(s.id)) add('fail', `id repetido: "${s.id}"`);
    ids.add(s.id);
    if (!s.title?.trim()) add('fail', `cena "${s.id}" sem título`);
    if (!s.eyebrow?.trim()) add('warn', `cena "${s.id}" sem eyebrow`);
    if (!s.bullet?.trim()) add('warn', `cena "${s.id}" sem bullet`);
    if (config.cinematic.enabled && s.seconds < 5)
      add('warn', `cena "${s.id}" tem ${s.seconds}s — com cinema ligado, abaixo de 5s fica apertada`);
    if (s.title && s.title.length > 48)
      add('warn', `título de "${s.id}" tem ${s.title.length} caracteres — pode quebrar em 3+ linhas`);
    for (const t of s.taps ?? []) {
      if (t.x < 0 || t.x > 100 || t.y < 0 || t.y > 100) add('fail', `toque fora da tela em "${s.id}" (x/y são % de 0 a 100)`);
      if (t.at < 0 || t.at > s.seconds) add('fail', `toque de "${s.id}" acontece em ${t.at}s, fora da cena (${s.seconds}s)`);
    }
    if (!s.screen) {
      add('warn', `cena "${s.id}" sem tela — vai aparecer placeholder`);
      continue;
    }
    const file = path.join(dir, 'public', 'screens', s.screen);
    if (!fs.existsSync(file)) {
      add('fail', `tela "${s.screen}" (cena "${s.id}") não existe em public/screens/`);
      continue;
    }
    const size = pngSize(file);
    if (!size) {
      add('warn', `"${s.screen}" não é PNG legível`);
      continue;
    }
    const want = device.exportSize;
    const aspectOk = Math.abs(size.w / size.h - want.w / want.h) < 0.02;
    if (!aspectOk)
      add('warn', `"${s.screen}" é ${size.w}×${size.h}; o ${device.label} pede ${want.w}×${want.h} (proporção diferente — vai cortar). Use: npm run screens -- ${slug} <arquivo>`);
    else if (size.w < want.w * 0.75)
      add('warn', `"${s.screen}" é ${size.w}×${size.h}, menor que ${want.w}×${want.h} — vai ficar mole na TV`);
  }

  for (const [k, v] of Object.entries(config.size)) {
    if (v < 34) add('warn', `size.${k} = ${v}px — abaixo de 34px não se lê a 3 metros`);
  }
  if (config.layout.safe < 96) add('warn', `layout.safe = ${config.layout.safe}px — overscan de TV pode cortar texto`);
  if (config.logo.file && !fs.existsSync(path.join(dir, 'public', config.logo.file)))
    add('fail', `logo "${config.logo.file}" não existe em projects/${slug}/public/`);
  for (const f of config.font.files)
    if (!fs.existsSync(path.join(dir, 'public', f.file))) add('fail', `fonte "${f.file}" não existe em projects/${slug}/public/`);
  if (!/^#[0-9a-fA-F]{6}$/.test(config.brand.accent))
    add('fail', `brand.accent "${config.brand.accent}" precisa ser hex de 6 dígitos (#RRGGBB) — o fundo concatena alfa nele`);
  if (!/^#[0-9a-fA-F]{6}$/.test(config.brand.accentSoft))
    add('fail', `brand.accentSoft "${config.brand.accentSoft}" precisa ser hex de 6 dígitos (#RRGGBB)`);

  const unfilled = scenes.filter((s) => /^Uma frase curta|^Mostre o que o usuário|^Feche mostrando/.test(s.bullet ?? ''));
  if (unfilled.length) add('warn', `${unfilled.length} cena(s) ainda com o texto de exemplo do template`);

  return report(slug, results);
};

const report = (slug: string, results: { level: Level; msg: string }[]): boolean => {
  const icon = { ok: c.green('✓'), warn: c.yellow('!'), fail: c.red('✗') };
  console.log(c.bold(`\nDiagnóstico — ${slug}\n`));
  for (const r of results) console.log(` ${icon[r.level]} ${r.msg}`);
  const fails = results.filter((r) => r.level === 'fail').length;
  const warns = results.filter((r) => r.level === 'warn').length;
  console.log(
    `\n${fails ? c.red(`${fails} erro(s)`) : c.green('sem erros')}${warns ? c.yellow(` · ${warns} aviso(s)`) : ''}\n`,
  );
  return fails === 0;
};

const outFile = (slug: string, suffix = '') => path.join(OUT, `${slug}${suffix}.mp4`);

const cmdRender = (slug: string) => {
  fs.mkdirSync(OUT, { recursive: true });
  remotion(slug, ['render', 'Showcase', outFile(slug), '--codec=h264', '--crf=18']);
  console.log(c.green(`\n✓ ${path.relative(ROOT, outFile(slug))}`));
};

const cmdTv = (slug: string) => {
  const src = outFile(slug);
  if (!fs.existsSync(src)) cmdRender(slug);
  const dest = outFile(slug, '-tv');
  const r = ffmpeg([
    '-y', '-loglevel', 'error', '-stats',
    '-i', src,
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart',
    dest,
  ]);
  if (r.status !== 0) die('ffmpeg falhou ao preparar o arquivo de TV.');
  const mb = fs.statSync(dest).size / 1024 / 1024;
  console.log(c.green(`\n✓ ${path.relative(ROOT, dest)} (${mb.toFixed(1)} MB)`));
  console.log(`
Pen drive:
  • formate em FAT32 (arquivo < 4 GB: ${mb < 4096 ? 'ok' : c.red('ESTOURA')})
  • copie o arquivo sozinho na raiz do drive
  • teste na TV do evento antes do dia. Sempre.
`);
};

const cmdLoopCheck = async (slug: string) => {
  const p = await loadProject(slug);
  const total = Math.round(p.scenes.reduce((a, s) => a + Math.round(s.seconds * FPS), 0));
  const dir = path.join(OUT, 'loopcheck');
  fs.mkdirSync(dir, { recursive: true });
  const first = path.join(dir, `${slug}-first.png`);
  const last = path.join(dir, `${slug}-last.png`);
  remotion(slug, ['still', 'Showcase', first, '--frame=0']);
  remotion(slug, ['still', 'Showcase', last, `--frame=${total - 1}`]);
  const r = ffmpeg(['-i', first, '-i', last, '-lavfi', 'psnr', '-f', 'null', '-'], { capture: true });
  const m = String(r.stderr).match(/average:([\d.]+|inf)/);
  const psnr = m ? (m[1] === 'inf' ? Infinity : Number(m[1])) : NaN;
  console.log(c.bold('\nVolta do loop'));
  console.log(` frame 0 ........ ${path.relative(ROOT, first)}`);
  console.log(` frame ${total - 1} ..... ${path.relative(ROOT, last)}`);
  if (Number.isNaN(psnr)) return console.log(c.yellow(' não consegui calcular a diferença; compare os dois PNGs a olho.'));
  const good = psnr >= 30;
  console.log(` PSNR ........... ${psnr === Infinity ? '∞' : psnr.toFixed(1) + ' dB'}  ${good ? c.green('✓ volta contínua') : c.red('✗ salto visível — revise duração/animação contínua')}`);
  console.log(c.dim(' (≥ 30 dB = o último frame cai praticamente onde o primeiro começa; olhe os PNGs mesmo assim)\n'));
};

/* ───────────── main ───────────── */

const main = async () => {
  const [cmd, ...rest] = process.argv.slice(2);

  switch (cmd) {
    case 'new':
      return cmdNew(rest[0]);
    case 'list':
      return cmdList();
    case 'screens': {
      const slug = pickSlug(rest[0] && !fs.existsSync(rest[0]) ? rest[0] : undefined);
      const files = rest[0] === slug ? rest.slice(1) : rest;
      return cmdScreens(slug, files);
    }
    case 'doctor': {
      const ok = await cmdDoctor(pickSlug(rest[0]));
      process.exit(ok ? 0 : 1);
    }
    case 'studio': {
      const slug = pickSlug(rest[0]);
      return remotion(slug, ['studio']);
    }
    case 'still': {
      const slug = pickSlug(rest[0]);
      const frame = rest[1] ?? '90';
      fs.mkdirSync(OUT, { recursive: true });
      const file = path.join(OUT, `${slug}-frame-${frame}.png`);
      remotion(slug, ['still', 'Showcase', file, `--frame=${frame}`]);
      return console.log(c.green(`\n✓ ${path.relative(ROOT, file)}`));
    }
    case 'render': {
      const slug = pickSlug(rest[0]);
      if (!(await cmdDoctor(slug))) die('Corrija os erros acima antes de renderizar.');
      return cmdRender(slug);
    }
    case 'tv': {
      const slug = pickSlug(rest[0]);
      if (!(await cmdDoctor(slug))) die('Corrija os erros acima antes de renderizar.');
      return cmdTv(slug);
    }
    case 'loopcheck':
      return cmdLoopCheck(pickSlug(rest[0]));
    default:
      console.log(
        fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*\n/, '').replace(/^ \* ?/gm, ''),
      );
  }
};

main().catch((e) => die((e as Error).message));
