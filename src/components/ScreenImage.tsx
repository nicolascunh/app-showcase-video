import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { config } from '../config';

/** PNG da tela, ou placeholder legível enquanto ela não existe. */
export const ScreenImage: React.FC<{ screen?: string; label: string }> = ({ screen, label }) => {
  const { brand, font } = config;

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
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
    />
  );
};
