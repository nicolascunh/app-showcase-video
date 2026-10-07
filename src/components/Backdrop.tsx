import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from 'remotion';
import { config, phone, CANVAS } from '../config';

/** Grão fino — evita faixamento de gradiente em painel grande. */
const Grain: React.FC = () =>
  config.backdrop.grain ? (
    <AbsoluteFill
      style={{
        opacity: 0.045,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  ) : null;

const Logo: React.FC = () => {
  const { file, height, position } = config.logo;
  if (!file) return null;
  const s = config.layout.safe;
  const pos: React.CSSProperties = {
    'top-left': { top: s, left: s },
    'top-right': { top: s, right: s },
    'bottom-left': { bottom: s, left: s },
    'bottom-right': { bottom: s, right: s },
  }[position];

  return (
    <Img src={staticFile(file)} style={{ position: 'absolute', height, ...pos }} />
  );
};

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { brand, backdrop } = config;
  const k = backdrop.intensity;

  const base =
    brand.bg === brand.bgTint
      ? brand.bg
      : `radial-gradient(120% 90% at 18% 8%, ${brand.bgTint} 0%, ${brand.bg} 62%)`;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: base }} />

      {backdrop.motif === 'beam' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: -420,
              left: -300,
              width: 1500,
              height: 2100,
              transform: 'rotate(19deg)',
              background: `linear-gradient(90deg, transparent 0%, ${brand.accent}2B 38%, ${brand.accentSoft}12 62%, transparent 100%)`,
              filter: 'blur(48px)',
              opacity: interpolate(Math.sin(frame / 62), [-1, 1], [0.5 * k, 1.3 * k]),
            }}
          />
          <div
            style={{ position: 'absolute', left: 34, top: -84, bottom: -84, width: 30, overflow: 'hidden' }}
          >
            <div style={{ transform: `translateY(${(frame * 1.15) % 84}px)` }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 46,
                    marginBottom: 38,
                    borderRadius: 7,
                    border: `2px solid ${brand.accent}`,
                    opacity: 0.3 * k,
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {backdrop.motif === 'glow' && (
        <div
          style={{
            position: 'absolute',
            left: phone.x + phone.outerW / 2 - 760,
            top: CANVAS.h / 2 - 760,
            width: 1520,
            height: 1520,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${brand.accent}38 0%, transparent 62%)`,
            filter: 'blur(60px)',
            opacity: interpolate(Math.sin(frame / 70), [-1, 1], [0.7 * k, 1.15 * k]),
          }}
        />
      )}

      {backdrop.motif === 'grid' && (
        <AbsoluteFill
          style={{
            opacity: 0.5 * k,
            backgroundImage: `linear-gradient(${brand.accent}1F 1px, transparent 1px), linear-gradient(90deg, ${brand.accent}1F 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(80% 70% at 30% 45%, #000 0%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(80% 70% at 30% 45%, #000 0%, transparent 78%)',
          }}
        />
      )}

      <Grain />
      <Logo />
    </AbsoluteFill>
  );
};
