/**
 * Lighting — Volumetric glow lighting setup
 *
 * Creates the atmospheric lighting that makes peaks glow:
 *   - Low ambient base
 *   - Directional fill lights
 *   - Point lights at tunnel mouth for volumetric effect
 *   - Center arch highlight
 *   - Subtle backlight for depth
 */

import { RegimeColorSet } from './MetricPeaks'

interface LightingProps {
  colors: RegimeColorSet
}

export function Lighting({ colors }: LightingProps) {
  return (
    <>
      {/* Ambient base */}
      <ambientLight color="#ffffff" intensity={0.3} />

      {/* Directional fill lights */}
      <directionalLight color="#ffffff" intensity={0.8} position={[5, 8, 15]} />
      <directionalLight color="#4a6fa5" intensity={0.4} position={[-10, 5, 10]} />

      {/* Tunnel mouth glow — volumetric effect */}
      <pointLight
        position={[0, 5, -4]}
        intensity={6.0}
        color={colors.glow}
        distance={25}
        decay={1.2}
      />

      {/* Center arch highlight */}
      <pointLight
        position={[0, 3, 0]}
        intensity={4.5}
        color={colors.surface}
        distance={20}
        decay={1.6}
      />

      {/* Subtle backlight for depth */}
      <pointLight
        position={[0, 2, 8]}
        intensity={2.0}
        color={colors.glow}
        distance={15}
        decay={2.0}
      />
    </>
  )
}
