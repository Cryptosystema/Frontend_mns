import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export function CameraRig() {
  const { camera } = useThree()
  const timeRef = useRef(0)
  useFrame((_, delta) => {
    timeRef.current += delta
    camera.position.set(0, 3, 16)
    camera.lookAt(0, 0, -20)
  })
  return null
}
