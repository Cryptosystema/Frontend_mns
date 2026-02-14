/// <reference path="../../types/three.d.ts" />
// @ts-nocheck - Three.js JSX elements from React Three Fiber
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'
import { TunnelConfig, MaterialConfig } from '@/types/3d'
import type { RegimeData } from '@/types/forecast'
import { getRegimeColor } from './utils/regimeColors'
import type { RegimeVisualState } from './engine/RegimeVisualEngine'

const DEFAULT_TUNNEL: TunnelConfig = {
  segments: 64,
  radius: 5,
  length: 50,
  wireframe: false
}

export function TunnelGeometry({
  config = DEFAULT_TUNNEL,
  regime,
  visualState
}: {
  config?: TunnelConfig
  material?: MaterialConfig
  regime?: RegimeData
  visualState?: RegimeVisualState
}) {
  const meshRef = useRef<Mesh>(null)
  
  // Get color based on visual state (or fallback to regime)
  const tunnelColor = useMemo(() => {
    if (visualState) {
      return visualState.tunnelColor
    }
    if (regime) {
      return getRegimeColor(regime)
    }
    return '#0088ff'
  }, [visualState, regime])
  
  // Material properties from visual state
  const materialProps = useMemo(() => {
    if (visualState) {
      return {
        opacity: visualState.tunnelOpacity,
        emissiveIntensity: visualState.tunnelEmissive,
        metalness: visualState.metalness,
        roughness: visualState.roughness
      }
    }
    return {
      opacity: 0.3,
      emissiveIntensity: 0.2,
      metalness: 0.2,
      roughness: 0.5
    }
  }, [visualState])

  // Slow rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      {/* Cylinder geometry for tunnel */}
      <cylinderGeometry
        args={[
          config.radius,        // radiusTop
          config.radius,        // radiusBottom
          config.length,        // height (tunnel length)
          config.segments,      // radialSegments
          1,                    // heightSegments
          true                  // openEnded
        ]}
      />

      {/* Semantic material - reflects regime intelligence */}
      <meshStandardMaterial
        color={tunnelColor}
        transparent={true}
        opacity={materialProps.opacity}
        wireframe={false}
        emissive={tunnelColor}
        emissiveIntensity={materialProps.emissiveIntensity}
        metalness={materialProps.metalness}
        roughness={materialProps.roughness}
        side={THREE.BackSide}
      />
    </mesh>
  )
}
