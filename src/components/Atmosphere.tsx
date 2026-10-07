import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { config, phone, CANVAS } from '../config';

/** Reflexo que atravessa o vidro do aparelho. Dois ciclos por loop, então fecha certo. */
export const GlassSweep: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { enabled, glassSweep } = config.cinematic;
  if (!enabled || !glassSweep) return null;

  const CYCLES = 2;
  const p = ((frame / total) * CYCLES) % 1;

  // Fora da janela visível, some — evita a faixa piscando na volta do loop
  const travel = -0.6 + p * 2.2;
  const fade = Math.sin(Math.PI * p);

  return (
    <div
      style={{
        position: 'absolute',
        left: phone.x,
        top: phone.y,
        width: phone.outerW,
        height: phone.outerH,
        borderRadius: phone.radius,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 30,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -phone.outerH * 0.5,
          left: `${travel * 100}%`,
          width: '55%',
          height: phone.outerH * 2,
          transform: 'rotate(22deg)',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.11) 45%, rgba(255,255,255,0.16) 52%, transparent 100%)',
          filter: 'blur(14px)',
          opacity: fade * 0.9,
        }}
      />
    </div>
  );
};

/** Escurecimento das bordas. Puxa o olho para o centro. */
export const Vignette: React.FC = () => {
  const { enabled, vignette } = config.cinematic;
  if (!enabled || vignette <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 40,
        background: `radial-gradient(120% 105% at 50% 48%, transparent 42%, rgba(0,0,0,${
          0.8 * vignette
        }) 100%)`,
      }}
    />
  );
};

/** Barras pretas. Desligadas por padrão — ver o aviso no config. */
export const Letterbox: React.FC = () => {
  const ratio = config.cinematic.letterbox;
  if (!config.cinematic.enabled || !ratio) return null;

  const bandH = CANVAS.w / ratio;
  const bar = Math.max(0, Math.round((CANVAS.h - bandH) / 2));
  if (bar === 0) return null;

  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: bar, background: '#000', zIndex: 50 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: bar, background: '#000', zIndex: 50 }} />
    </>
  );
};
