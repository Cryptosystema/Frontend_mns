/**
 * Atmosphere — Fog & floating particle system
 *
 * Fog:  Very dark blue-black, close start for tunnel depth
 * Particles: 1200 points in cylindrical distribution,
 *            drifting slowly toward the camera with organic motion.
 */

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface AtmosphereProps {
  fogColor: string
  particleColor: string
}

const PARTICLE_COUNT = 1200

export function Atmosphere({ fogColor, particleColor }: AtmosphereProps) {
  const { scene } = useThree()
  const pointsRef = useRef<THREE.Points>(null!)

  // Apply fog & background
  useMemo(() => {
    scene.fog = new THREE.Fog(fogColor, 8, 40)
    scene.background = new THREE.Color(fogColor)
  }, [scene, fogColor])

  // Generate initial particle positions (cylindrical distribution)
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 5.5 + 0.5 // 0.5 → 6
      const i3 = i * 3

      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = Math.sin(angle) * radius
      positions[i3 + 2] = (Math.random() - 0.5) * 60
    }

    return positions
  }, [])

  // Animate particles: drift toward camera, organic XY motion
  useFrame(() => {
    if (!pointsRef.current) return
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array
    const now = Date.now()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      // Slow drift toward camera (+Z)
      positions[i3 + 2] += 0.02

      // Wrap around when too close
      if (positions[i3 + 2] > 30) {
        positions[i3 + 2] = -30
      }

      // Subtle organic XY sway
      positions[i3] += Math.sin(now * 0.0001 + i) * 0.002
      positions[i3 + 1] += Math.cos(now * 0.0001 + i) * 0.002
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={particleColor}
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
