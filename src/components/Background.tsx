/* eslint-disable no-shadow */

import { useTheme } from '@mui/material';
import clsx from 'clsx';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

enum Vanta {
  CLOUDS,
  WAVES,
}
type VANTA = {
  [index: string]: any;
  CLOUDS: any;
  WAVES: any;
};

declare global {
  interface Window {
    VANTA: VANTA;
  }
}

let instance: VANTA;

type VantaBackgroudProps = {
  enabled?: boolean;
  light: any;
  dark: any;
  bg?: number;
  el?: string;
};

export const VantaBackground: FunctionComponent<
  PropsWithChildren<VantaBackgroudProps>
> = ({
  enabled = false,
  children,
  light = SunnyBlueClouds,
  dark = DarkFog,
  bg,
  el = '#bg',
}) => {
  const instance = useRef<any>();
  const theme = useTheme();
  const { type, ...rest } = theme.palette.mode === 'light' ? light : dark;

  const sharedProps = {
    el: el,
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
  };

  /** Destroy the background on unmount */
  useEffect(() => {
    return () => {
      if (instance.current && instance.current.destroy) {
        instance.current.destroy();
        instance.current = null;
      }
    };
  }, []);

  const render = useMemo(
    () => () => {
      if (!document.querySelector(el)) return;

      console.log('RENDERING VANTA', el, enabled);

      const fn = window.VANTA[type] || window.VANTA.CLOUDS;
      if (enabled && !instance.current) {
        instance.current = fn({
          ...sharedProps,
          ...rest,
        });
      } else if (!enabled && instance.current && instance.current.destroy) {
        instance.current.destroy();
        instance.current = null;
      }
    },
    [enabled, dark, light, type]
  );

  useEffect(() => {
    if (!window.VANTA) return;

    render();
    // eslint-disable-next-line consistent-return
    return () => {
      if (instance.current && instance.current.destroy)
        instance.current.destroy();
      instance.current = null;
    };
  }, [enabled, dark, light, type]);

  useEffect(() => {
    document.getElementById('vanta')?.addEventListener('load', render);
    return () => {
      document.getElementById('vanta')?.removeEventListener('load', render);
    };
  });

  useEffect(() => {
    if (instance.current && instance.current.updateUniforms) {
      Object.assign(instance.current.options, {
        ...rest,
        ...sharedProps,
      });
      instance.current.updateUniforms();
    }
  }, [sharedProps, rest]);

  return (
    <div
      id={el.replace('#', '')}
      className={clsx(theme.palette.mode, 'fh', `bg${bg}`, {
        animated: enabled,
      })}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export const SunnyBlueClouds = {
  type: 'CLOUD',
  skyColor: 0x2096d7,
  cloudColor: 0xc5c8fa,
  sunColor: 0xdc7412,
  sunlightColor: 0xe17833,
  speed: 1,
  width: '100%',
  height: '100%',
};

export const SunsetDarkClouds = {
  skyColor: 0x0,
  cloudColor: 0x121216,
  speed: 1,
};

export const DarkNightClouds = {
  skyColor: 0x143569,
  cloudColor: 0x21212a,
  cloudShadowColor: 0x3a3a5c,
  sunColor: 0x272c64,
  sunGlareColor: 0x717582,
  sunlightColor: 0xffffff,
  speed: 0.5,
};

export const BlackClouds = {
  skyColor: 0x143569,
  cloudColor: 0x21212a,
  cloudShadowColor: 0x3a3a5c,
  sunColor: 0x272c64,
  sunGlareColor: 0x717582,
  sunlightColor: 0xffffff,
  speed: 0.6,
};
export const DarkFog = {
  type: 'FOG',
  highlightColor: 0xffffff,
  midtoneColor: 0x575757,
  lowlightColor: 0x0,
  baseColor: 0x252525,
};

export const DarkWaves = {
  type: 'WAVES',
  scale: 1.0,
  scaleMobile: 1.0,
  color: 0x252525,
  shininess: 34.0,
  waveHeight: 9.5,
  waveSpeed: 0.55,
  zoom: 0.88,
};

export const SlowBigWaves = {
  type: 'WAVES',
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
  shininess: 28.0,
  waveHeight: 40.0,
  waveSpeed: 0.3,
  zoom: 0.88,
};

export const ColorFulFog = {
  type: 'FOG',
};

export const DarkFogLightCloudBackground = () => (
  <VantaBackground light={SunnyBlueClouds} dark={DarkFog} />
);
