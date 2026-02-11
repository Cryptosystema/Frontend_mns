/// <reference path="../../types/three.d.ts" />
// @ts-nocheck - Three.js JSX elements from React Three Fiber
import { LightConfig } from '@/types/3d'

const DEFAULT_LIGHTS: LightConfig = {
  ambient: {
    color: '#ffffff',
    intensity: 0.3
  },
  directional: {
    color: '#ffffff',
    intensity: 0.8,
    position: [10, 10, 5]
  },
  point: {
    color: '#00ff88',
    intensity: 1.5,
    position: [0, 0, 5]
  }
}

export function Lighting({ config = DEFAULT_LIGHTS }: { config?: LightConfig }) {
  return (
    <>
      {/* Ambient light - soft base illumination */}
      <ambientLight
        color={config.ambient.color}
        intensity={config.ambient.intensity}
      />

      {/* Directional light - main light source */}
      <directionalLight
        color={config.directional.color}
        intensity={config.directional.intensity}
        position={config.directional.position}
        castShadow
      />

      {/* Point light - accent/highlight (optional) */}
      {config.point && (
        <pointLight
          color={config.point.color}
          intensity={config.point.intensity}
          position={config.point.position}
          distance={50}
          decay={2}
        />
      )}
    </>
  )
}
