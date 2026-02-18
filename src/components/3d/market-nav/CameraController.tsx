import { OrbitControls } from '@react-three/drei'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from 'three'

interface Config {
  position: [number, number, number]
  fov: number
}

interface Props {
  config: Config
}

export function CameraController({ config }: Props) {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(...config.position)
    if (camera instanceof PerspectiveCamera) {
      camera.fov = config.fov
      camera.updateProjectionMatrix()
    }
  }, [camera, config])
  
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
      target={[0, 0.5, -1]}
    />
  )
}
