import React from 'react';
import { interpolate, Easing } from 'remotion';
import { config, textArea, CANVAS } from '../config';

/**
 * Entrada escalonada. Em modo cinematográfico tudo fica mais lento e o
 * deslocamento menor — o texto assenta, não salta.
 */
const reveal = (frame: number, delay: number): React.CSSProperties => {
  const cine = config.cinematic.enabled;
  const fade = cine ? 26 : 14;
  const shift = cine ? 36 : 26;
  const t = frame - delay * (cine ? 1.9 : 1);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  return {
    opacity: interpolate(t, [0, fade], [0, 1], clamp),
    transform: `translateY(${interpolate(t, [0, fade + 12], [shift, 0], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    })}px)`,
  };
};

export const TextBlock: React.FC<{
  eyebrow: string;
  title: string;
  bullet: string;
  index: number;
  total: number;
  localFrame: number;
}> = ({ eyebrow, title, bullet, index, total, localFrame }) => {
  const frame = localFrame;
  const { brand, font, size, layout } = config;
  const lower = textArea.mode === 'lower';
  const centered = textArea.align === 'center';

  const box: React.CSSProperties = lower
    ? {
        position: 'absolute',
        left: textArea.x,
        width: textArea.width,
        bottom: layout.safe,
        textAlign: 'center',
        alignItems: 'center',
      }
    : {
        position: 'absolute',
        left: textArea.x,
        width: textArea.width,
        top: 0,
        height: CANVAS.h,
        justifyContent: 'center',
      };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...box }}>
      <div
        style={{
          ...reveal(frame, 4),
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          justifyContent: centered ? 'center' : 'flex-start',
        }}
      >
        <div style={{ width: 54, height: 3, background: brand.accent }} />
        <span
          style={{
            fontFamily: font.body,
            fontSize: size.eyebrow,
            letterSpacing: config.cinematic.enabled ? 7 : 4,
            textTransform: 'uppercase',
            color: brand.accent,
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </span>
      </div>

      <h1
        style={{
          ...reveal(frame, 10),
          fontFamily: font.display,
          fontSize: size.title,
          lineHeight: 1.08,
          fontWeight: font.titleWeight,
          color: brand.ink,
          margin: '30px 0 0',
          letterSpacing: font.titleTracking,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          ...reveal(frame, 18),
          fontFamily: font.body,
          fontSize: size.bullet,
          lineHeight: 1.45,
          color: brand.inkMuted,
          margin: '28px 0 0',
          maxWidth: lower ? '100%' : 780,
        }}
      >
        {bullet}
      </p>

      {layout.showProgress && (
        <div
          style={{
            ...reveal(frame, 26),
            display: 'flex',
            gap: 12,
            marginTop: 64,
            justifyContent: centered ? 'center' : 'flex-start',
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? 64 : 28,
                height: 5,
                borderRadius: 999,
                background: i === index ? brand.accent : 'rgba(128,128,128,0.35)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
