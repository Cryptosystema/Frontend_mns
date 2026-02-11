export interface Scene3DProps {
  data?: any // Will be properly typed when forecast data structure is defined
  onInteraction?: (event: InteractionEvent) => void
}

export interface InteractionEvent {
  type: 'hover' | 'click' | 'drag'
  timestamp: number
  target?: string
}

export interface TunnelConfig {
  segments: number
  radius: number
  length: number
  wireframe: boolean
}

export interface CameraConfig {
  position: [number, number, number]
  fov: number
  near: number
  far: number
}

export interface LightConfig {
  ambient: {
    color: string
    intensity: number
  }
  directional: {
    color: string
    intensity: number
    position: [number, number, number]
  }
  point?: {
    color: string
    intensity: number
    position: [number, number, number]
  }
}

export interface MaterialConfig {
  color: string
  opacity: number
  transparent: boolean
  wireframe: boolean
  emissive?: string
  emissiveIntensity?: number
}
