import React from 'react';
import { config, phone } from '../config';

/** Recorte da câmera. É o detalhe que identifica o aparelho a 3 metros. */
const Cutout: React.FC = () => {
  const { kind, w, h, top } = phone.cutout;
  if (kind === 'none') return null;

  const common: React.CSSProperties = {
    position: 'absolute',
    top,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#000',
    zIndex: 20,
  };

  if (kind === 'punch-hole') {
    return <div style={{ ...common, width: w, height: w, borderRadius: '50%' }} />;
  }

  return <div style={{ ...common, width: w, height: h, borderRadius: 999 }} />;
};

/** Casca do aparelho. Proporção, raio e recorte vêm do modelo escolhido no config. */
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  offsetY?: number;
}> = ({ children, offsetY = 0 }) => {
  const inner: React.CSSProperties = {
    position: 'relative',
    width: phone.screenW,
    height: phone.screenH,
    borderRadius: phone.radius - phone.bezel,
    overflow: 'hidden',
    background: '#000',
  };

  if (!config.layout.showDevice) {
    return (
      <div
        style={{
          ...inner,
          position: 'absolute',
          left: phone.x + phone.bezel,
          top: phone.y + phone.bezel + offsetY,
        }}
      >
        {children}
        <Cutout />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: phone.x,
        top: phone.y + offsetY,
        width: phone.outerW,
        height: phone.outerH,
        borderRadius: phone.radius,
        background: phone.body,
        padding: phone.bezel,
        boxSizing: 'border-box',
        boxShadow: '0 60px 120px rgba(0,0,0,0.45), 0 0 0 1px rgba(128,128,128,0.22)',
      }}
    >
      {/* Filete claro na borda interna — lê como quina do vidro */}
      <div
        style={{
          position: 'absolute',
          inset: phone.bezel - 2,
          borderRadius: phone.radius - phone.bezel + 2,
          border: '2px solid rgba(255,255,255,0.10)',
          pointerEvents: 'none',
          zIndex: 25,
        }}
      />
      <div style={inner}>
        {children}
        <Cutout />
      </div>
    </div>
  );
};
