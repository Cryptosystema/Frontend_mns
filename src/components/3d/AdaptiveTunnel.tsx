import { useMemo } from 'react'
import { TunnelGeometry } from './TunnelGeometry'
import { useAdaptiveQuality } from './PerformanceSettings'
import type { RegimeData } from '@/types/forecast'
import type { RegimeVisualState } from './engine/RegimeVisualEngine'

interface AdaptiveTunnelProps {
  enabled: boolean
  regime?: RegimeData
  visualState?: RegimeVisualState
}

export function AdaptiveTunnel({ enabled, regime, visualState }: AdaptiveTunnelProps) {
  const quality = useAdaptiveQuality(enabled)

  // Adjust tunnel geometry complexity based on quality
  const tunnelConfig = useMemo(() => {
    const baseConfig = {
      segments: 64,
      radius: 5,
      length: 50,
      wireframe: false
    }

    // Reduce segments for lower quality
    if (quality.particleCount <= 300) {
      return { ...baseConfig, segments: 32 }
    }
    if (quality.particleCount <= 600) {
      return { ...baseConfig, segments: 48 }
    }

    return baseConfig
  }, [quality.particleCount])

  return <TunnelGeometry config={tunnelConfig} regime={regime} visualState={visualState} />
}
