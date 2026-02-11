/// <reference path="../../types/three.d.ts" />
// @ts-nocheck - Three.js JSX elements from React Three Fiber
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'
import { TunnelConfig, MaterialConfig } from '@/types/3d'

const DEFAULT_TUNNEL: TunnelConfig = {
  segments: 64,
  radius: 5,
  length: 50,
  wireframe: false
}

const DEFAULT_MATERIAL: MaterialConfig = {
  color: '#0088ff',
  opacity: 0.3,
  transparent: true,
  wireframe: false,
  emissive: '#0088ff',
  emissiveIntensity: 0.2
}

export function TunnelGeometry({
  config = DEFAULT_TUNNEL,
  material = DEFAULT_MATERIAL
}: {
  config?: TunnelConfig
  material?: MaterialConfig
}) {
  const meshRef = useRef<Mesh>(null)

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

      {/* Basic material */}
      <meshStandardMaterial
        color={material.color}
        transparent={material.transparent}
        opacity={material.opacity}
        wireframe={material.wireframe}
        emissive={material.emissive}
        emissiveIntensity={material.emissiveIntensity}
        side={THREE.BackSide}
      />
    </mesh>
  )
}
