import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { scenes, type Scene } from './scenes';
import { config } from './config';
import { Backdrop } from './components/Backdrop';
import { Camera } from './components/Camera';
import { GlassSweep, Vignette, Letterbox } from './components/Atmosphere';
import { PhoneFrame } from './components/PhoneFrame';
import { ScreenImage } from './components/ScreenImage';
import { TextBlock } from './components/TextBlock';
import { TapIndicator } from './components/TapIndicator';
import { useProjectFonts } from './fonts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/**
 * Uma cena.
 *
 * `headIn`  frames de cruzamento na entrada (0 na primeira cena, que já começa visível)
 * `tailOut` frames de cruzamento na saída
 * `frozen`  trava a animação interna no estado inicial — usado na cópia de fechamento do loop
 */
const SceneBlock: React.FC<{
  scene: Scene;
  index: number;
  length: number;
  headIn: number;
  tailOut: number;
  frozen?: boolean;
}> = ({ scene, index, length, headIn, tailOut, frozen }) => {
  const seqFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cine = config.cinematic.enabled;

  const opacity =
    (headIn > 0 ? interpolate(seqFrame, [0, headIn], [0, 1], clamp) : 1) *
    (tailOut > 0 ? interpolate(seqFrame, [length - tailOut, length], [1, 0], clamp) : 1);

  // Relógio interno da cena: só corre depois que ela entrou
  const frame = frozen ? 0 : Math.max(0, seqFrame - headIn);

  let screenStyle: React.CSSProperties;
  if (cine) {
    // Com cruzamento, a tela só respira — empurrão brusco brigaria com a mistura
    const settle = interpolate(frame, [0, Math.round(2.2 * fps)], [1.05, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });
    screenStyle = { transform: `scale(${settle})`, transformOrigin: '50% 45%' };
  } else {
    const enter = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 22 });
    screenStyle =
      scene.enter === 'push'
        ? { transform: `translateX(${interpolate(enter, [0, 1], [100, 0])}%)` }
        : scene.enter === 'up'
          ? { transform: `translateY(${interpolate(enter, [0, 1], [100, 0])}%)` }
          : { opacity: enter };
  }

  const rise = cine
    ? 0
    : interpolate(frame, [0, 26], [22, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ opacity }}>
      <PhoneFrame offsetY={rise}>
        <AbsoluteFill style={screenStyle}>
          <ScreenImage screen={scene.screen} label={scene.title} />
        </AbsoluteFill>
        {!frozen &&
          scene.taps?.map((tap, i) => <TapIndicator key={i} tap={tap} fps={fps} localFrame={frame} />)}
      </PhoneFrame>

      <TextBlock
        eyebrow={scene.eyebrow}
        title={scene.title}
        bullet={scene.bullet}
        index={index}
        total={scenes.length}
        localFrame={frame}
      />
    </AbsoluteFill>
  );
};

export const ShowcaseVideo: React.FC = () => {
  useProjectFonts();
  const { fps } = useVideoConfig();
  const cine = config.cinematic.enabled;
  const xf = cine ? Math.round(config.cinematic.crossfade * fps) : 0;

  const durations = scenes.map((s) => Math.round(s.seconds * fps));
  const total = durations.reduce((a, b) => a + b, 0);

  const starts: number[] = [];
  durations.reduce((acc, d, i) => {
    starts[i] = acc;
    return acc + d;
  }, 0);

  return (
    <AbsoluteFill>
      <Camera total={total}>
        <Backdrop />

        {scenes.map((scene, i) => {
          const headIn = i === 0 ? 0 : xf;
          const from = starts[i] - headIn;
          const length = durations[i] + headIn;
          return (
            <Sequence key={scene.id} from={from} durationInFrames={length}>
              <SceneBlock
                scene={scene}
                index={i}
                length={length}
                headIn={headIn}
                tailOut={xf}
              />
            </Sequence>
          );
        })}

        {/*
          Fechamento do loop: a primeira cena reaparece cruzando com a última,
          travada no seu estado inicial. No frame final ela está exatamente
          como no frame zero, então a volta é invisível.
        */}
        {xf > 0 && (
          <Sequence from={total - xf} durationInFrames={xf}>
            <SceneBlock
              scene={scenes[0]}
              index={0}
              length={xf}
              headIn={xf}
              tailOut={0}
              frozen
            />
          </Sequence>
        )}

        <GlassSweep total={total} />
      </Camera>

      <Vignette />
      <Letterbox />
    </AbsoluteFill>
  );
};

export const totalFrames = (fps: number) =>
  scenes.reduce((acc, s) => acc + Math.round(s.seconds * fps), 0);
