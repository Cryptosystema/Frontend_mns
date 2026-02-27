import { useEffect } from "react"
import { useThree } from "@react-three/fiber"

export function CameraRig() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 30, 25)
    camera.lookAt(0, 0, -5)
  }, [camera])
  return null
}
