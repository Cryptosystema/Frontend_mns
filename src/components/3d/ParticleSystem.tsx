/// <reference path="../../types/three.d.ts" />
// @ts-nocheck - Three.js JSX elements from React Three Fiber
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getRegimeTheme, type RegimeType } from './config/regimePalette'
import type { RegimeVisualState } from './engine/RegimeVisualEngine'

interface ParticleSystemProps {
  count?: number
  regime?: RegimeType
  visualState?: RegimeVisualState
}

export function ParticleSystem({ 
  count = 1000,
  regime = 'NORMAL',
  visualState
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const theme = getRegimeTheme(regime)

  // Apply density multiplier from visual state (capped at 1.5x)
  const actualCount = useMemo(() => {
    if (visualState) {
      return Math.floor(count * visualState.particleDensity)
    }
    return count
  }, [count, visualState])

  const particleConfig = useMemo(() => {
    // Use visual state speed if available, otherwise fallback
    const speed = visualState?.particleSpeed ?? 0.03

    return {
      speed,
      size: 0.04,
      color: new THREE.Color(theme.particles),
      opacity: 0.4
    }
  }, [visualState, theme])

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3)
    const velocities = new Float32Array(actualCount * 3)

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3

      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 4.5
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = (Math.random() - 0.5) * 50

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      const floatSpeed = 0.005
      velocities[i3] = (Math.random() - 0.5) * floatSpeed
      velocities[i3 + 1] = (Math.random() - 0.5) * floatSpeed
      velocities[i3 + 2] = (Math.random() * 0.5 + 0.5) * particleConfig.speed
    }

    return { positions, velocities }
  }, [actualCount, particleConfig.speed])

  useFrame((state) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const time = state.clock.elapsedTime

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3

      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1] + Math.sin(time + i * 0.1) * 0.001
      positions[i3 + 2] += velocities[i3 + 2]

      if (positions[i3 + 2] < -25) {
        positions[i3 + 2] = 25
      }
      if (positions[i3 + 2] > 25) {
        positions[i3 + 2] = -25
      }

      const x = positions[i3]
      const y = positions[i3 + 1]
      const radius = Math.sqrt(x * x + y * y)
      if (radius > 4.5) {
        const angle = Math.atan2(y, x)
        positions[i3] = Math.cos(angle) * 4.5
        positions[i3 + 1] = Math.sin(angle) * 4.5
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={actualCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleConfig.size}
        color={particleConfig.color}
        transparent
        opacity={particleConfig.opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
