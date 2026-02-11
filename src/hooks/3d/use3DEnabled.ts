import { useMemo } from 'react'

interface Feature3DConfig {
  enabled: boolean
  premiumOnly: boolean
  rolloutPercent: number
  minMemoryGB: number
  minCores: number
}

const CONFIG: Feature3DConfig = {
  enabled: import.meta.env.VITE_ENABLE_3D === 'true',
  premiumOnly: false, // For now, available to all
  rolloutPercent: 100, // 100% rollout for dev
  minMemoryGB: 4,
  minCores: 2
}

function checkDeviceCapability(): boolean {
  // Check WebGL2 support
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  
  if (!gl) {
    console.warn('WebGL not supported, disabling 3D')
    return false
  }

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4
  if (memory < CONFIG.minMemoryGB) {
    console.warn(`Low memory (${memory}GB), disabling 3D`)
    return false
  }

  // Check CPU cores
  const cores = navigator.hardwareConcurrency || 2
  if (cores < CONFIG.minCores) {
    console.warn(`Low CPU cores (${cores}), disabling 3D`)
    return false
  }

  // Check if mobile with weak GPU
  const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent)
  if (isMobile && cores < 4) {
    console.warn('Weak mobile device, disabling 3D')
    return false
  }

  return true
}

export function use3DEnabled(): boolean {
  return useMemo(() => {
    // Feature flag check
    if (!CONFIG.enabled) {
      return false
    }

    // Device capability check
    if (!checkDeviceCapability()) {
      return false
    }

    // Rollout percentage (for gradual rollout)
    const random = Math.random() * 100
    if (random > CONFIG.rolloutPercent) {
      return false
    }

    return true
  }, [])
}
