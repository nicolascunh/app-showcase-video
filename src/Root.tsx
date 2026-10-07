import React from 'react';
import { Composition } from 'remotion';
import { ShowcaseVideo, totalFrames } from './Video';
import { FPS } from './scenes';
import { CANVAS } from './config';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Showcase"
      component={ShowcaseVideo}
      durationInFrames={totalFrames(FPS)}
      fps={FPS}
      width={CANVAS.w}
      height={CANVAS.h}
    />
  );
};
