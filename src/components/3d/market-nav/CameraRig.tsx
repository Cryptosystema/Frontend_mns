/**
 * CameraRig — Camera positioning & orbit controls
 *
 * Camera looks THROUGH the tunnel opening, not down at it.
 * Position: slightly elevated, pulled back on Z axis.
 * Target:  tunnel center, slightly negative Z (into the arch).
 */

import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

const CAMERA_POSITION: [number, number, number] = [0, 3, 13]
const LOOK_TARGET: [number, number, number] = [0, 1, -2]

export function CameraRig() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(...CAMERA_POSITION)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 82
      camera.near = 0.1
      camera.far = 1000
      camera.updateProjectionMatrix()
    }
  }, [camera])

  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      enableZoom
      zoomSpeed={0.6}
      enablePan={false}
      enableRotate
      minDistance={10}
      maxDistance={30}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      target={LOOK_TARGET}
    />
  )
}
