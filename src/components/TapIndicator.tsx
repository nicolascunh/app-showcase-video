import React from 'react';
import { interpolate, Easing } from 'remotion';
import { config } from '../config';
import type { Tap } from '../scenes';

/** Círculo de toque. Ninguém vê o dedo de quem apresenta. */
export const TapIndicator: React.FC<{ tap: Tap; fps: number; localFrame: number }> = ({
  tap,
  fps,
  localFrame,
}) => {
  const frame = localFrame;
  const { brand, layout } = config;
  const start = Math.round(tap.at * fps);
  const local = frame - start;
  const duration = Math.round(0.9 * fps);

  if (local < 0 || local > duration) return null;

  const s = layout.phoneScale;
  const clamp = { extrapolateRight: 'clamp' } as const;

  const ringScale = interpolate(local, [0, duration], [0.35, 2.5], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const ringOpacity = interpolate(local, [0, duration * 0.25, duration], [0, 0.85, 0], clamp);
  const dotScale = interpolate(local, [0, 6, 16], [0.6, 1.15, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const dotOpacity = interpolate(local, [0, 4, duration * 0.7, duration], [0, 1, 1, 0], clamp);

  const ring = 92 * s;
  const dot = 62 * s;

  return (
    <div style={{ position: 'absolute', left: `${tap.x}%`, top: `${tap.y}%`, zIndex: 15 }}>
      <div
        style={{
          position: 'absolute',
          width: ring,
          height: ring,
          marginLeft: -ring / 2,
          marginTop: -ring / 2,
          borderRadius: 999,
          border: `3px solid ${brand.accent}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: dot,
          height: dot,
          marginLeft: -dot / 2,
          marginTop: -dot / 2,
          borderRadius: 999,
          background: brand.ink,
          transform: `scale(${dotScale})`,
          opacity: dotOpacity,
        }}
      />
    </div>
  );
};
