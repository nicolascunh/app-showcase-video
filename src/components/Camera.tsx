import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { config, CANVAS } from '../config';

/**
 * Movimento de câmera sobre o quadro inteiro.
 *
 * Todo movimento é função de seno ou cosseno com ciclo completo ao longo
 * da duração total. Isso significa que o último frame chega exatamente na
 * mesma posição do primeiro — o loop fecha sem salto, sem precisar de corte.
 */
export const Camera: React.FC<{ children: React.ReactNode; total: number }> = ({
  children,
  total,
}) => {
  const frame = useCurrentFrame();
  const { enabled, camera, cameraAmount: k, tilt } = config.cinematic;

  if (!enabled || camera === 'none') {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const t = (frame / total) * Math.PI * 2;

  // Volta a zero nas duas pontas
  const cycle = (1 - Math.cos(t)) / 2;
  const swing = Math.sin(t);

  let scale = 1;
  let x = 0;
  let rotY = 0;

  if (camera === 'push') {
    scale = 1 + 0.055 * k * cycle;
  } else if (camera === 'drift') {
    scale = 1.03;
    x = 34 * k * swing;
  } else {
    scale = 1 + 0.05 * k * cycle;
    x = 20 * k * swing;
    rotY = tilt * 0.16 * k * swing;
  }

  return (
    <AbsoluteFill style={{ perspective: 2600, perspectiveOrigin: '50% 50%' }}>
      <AbsoluteFill
        style={{
          width: CANVAS.w,
          height: CANVAS.h,
          transform: `translateX(${x}px) scale(${scale}) rotateY(${rotY}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
