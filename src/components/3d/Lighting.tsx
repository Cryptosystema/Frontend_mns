/// <reference path="../../types/three.d.ts" />
// @ts-nocheck - Three.js JSX elements from React Three Fiber
import { LightConfig } from '@/types/3d'
import { getRegimeTheme, type RegimeType } from './config/regimePalette'
import type { RegimeVisualState } from './engine/RegimeVisualEngine'

const DEFAULT_LIGHTS: LightConfig = {
  ambient: {
    color: '#ffffff',
    intensity: 0.6
  },
  directional: {
    color: '#ffffff',
    intensity: 1.2,
    position: [5, 8, 15]
  },
  point: {
    color: '#00ff88',
    intensity: 2,
    position: [0, 0, 5]
  }
}

interface LightingProps {
  config?: LightConfig
  regime?: RegimeType
  visualState?: RegimeVisualState
}

export function Lighting({ config = DEFAULT_LIGHTS, regime = 'NORMAL', visualState }: LightingProps) {
  const theme = getRegimeTheme(regime)
  
  // Use visual state for intelligent lighting adjustments
  const ambientIntensity = visualState?.ambientIntensity ?? config.ambient.intensity
  const glowIntensity = visualState?.glowIntensity ?? 0.8

  return (
    <>
      <ambientLight
        color={config.ambient.color}
        intensity={ambientIntensity}
      />

      <directionalLight
        color={config.directional.color}
        intensity={config.directional.intensity}
        position={config.directional.position}
        castShadow
      />

      <directionalLight
        color="#b8d4ff"
        intensity={0.6}
        position={[-10, 5, 10]}
      />

      <directionalLight
        color={theme.glow}
        intensity={glowIntensity}
        position={[0, 5, -15]}
      />

      {config.point && (
        <pointLight
          color={theme.glow}
          intensity={config.point.intensity * (glowIntensity / 0.8)}
          position={config.point.position}
          distance={60}
          decay={2}
        />
      )}
    </>
  )
}
