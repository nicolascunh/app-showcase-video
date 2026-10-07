import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { config } from './config';

/**
 * Carrega as fontes locais do projeto (config.font.files) antes de renderizar.
 * Sem arquivos configurados, não faz nada e o render não espera por nada.
 */
export const useProjectFonts = () => {
  const files = config.font.files;
  const [handle] = useState(() => (files.length ? delayRender('fontes do projeto') : null));

  useEffect(() => {
    if (handle === null) return;
    Promise.all(
      files.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(f.file)})`, {
          weight: String(f.weight ?? 400),
        });
        (document.fonts as unknown as { add(f: FontFace): void }).add(await face.load());
      }),
    )
      .catch((e) => console.error('Falha ao carregar fonte:', e))
      .finally(() => continueRender(handle));
  }, [handle, files]);
};
