import React from 'react';
import { AbsoluteFill, Freeze, Img, OffthreadVideo, staticFile } from 'remotion';
import { config } from '../config';

/** PNG da tela, ou placeholder legível enquanto ela não existe. */
export const ScreenImage: React.FC<{
  screen?: string;
  video?: string;
  label: string;
  /** Relógio da cena em frames: o vídeo começa quando a cena entra e congela na cópia de fechamento do loop */
  clock: number;
}> = ({ screen, video, label, clock }) => {
  const { brand, font } = config;
  const fit = { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' } as const;

  if (video) {
    return (
      <Freeze frame={clock}>
        <OffthreadVideo src={staticFile(`screens/${video}`)} muted style={fit} />
      </Freeze>
    );
  }

  if (!screen) {
    return (
      <AbsoluteFill
        style={{
          background: brand.bg,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        <div
          style={{
            border: `2px dashed ${brand.accent}`,
            borderRadius: 24,
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: font.body,
              fontSize: 20,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: brand.accent,
              marginBottom: 14,
            }}
          >
            {config.labels.placeholder}
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: 30,
              fontWeight: 600,
              color: brand.ink,
              lineHeight: 1.25,
            }}
          >
            {label}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <Img
      src={staticFile(`screens/${screen}`)}
      style={fit}
    />
  );
};
