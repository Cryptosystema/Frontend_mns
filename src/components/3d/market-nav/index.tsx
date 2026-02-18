/**
 * MarketNavigationScene — 3D visualization orchestrator
 *
 * Composes: TunnelGeometry + CameraRig + Lighting + Atmosphere
 * Drives everything from live backend data via useMarketData.
 */

import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { TunnelGeometry } from './TunnelGeometry'
import { CameraRig } from './CameraRig'
import { Lighting } from './Lighting'
import { Atmosphere } from './Atmosphere'
import { useMarketData } from './hooks/useMarketData'
import { usePeakAnimation } from './hooks/usePeakAnimation'
import {
  PEAKS,
  computePeakHeights,
  mapRegime,
  getRegimeColors
} from './MetricPeaks'

export interface MarketNavigationData {
  predictions?: Array<{ day: number; p10: number; p50: number; p90: number }>
  regime?: { stress?: string }
  volatility?: number
  confidence?: number
  stress?: number
}

// ─── Loading state ────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0a0e14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4a9eff',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}
    >
      Initializing market navigation…
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────

function ErrorScreen({ message }: { message: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#1a0404',
        color: '#ff4444',
        padding: '20px',
        fontFamily: 'monospace',
        fontSize: '13px'
      }}
    >
      ⚠ Market data unavailable: {message}
    </div>
  )
}

// ─── Inner scene (rendered inside <Canvas>) ───────────────────────

interface SceneInnerProps {
  peakHeights: number[]
  regime: string
}

function SceneInner({ peakHeights, regime }: SceneInnerProps) {
  const colors = getRegimeColors(regime)

  return (
    <>
      <CameraRig />
      <Lighting colors={colors} />
      <Atmosphere fogColor={colors.fog} particleColor={colors.particles} />
      <TunnelGeometry
        peakHeights={peakHeights}
        regimeColor={colors.surface}
        wireframeColor={colors.wireframe}
      />
    </>
  )
}

// ─── Main exported component ──────────────────────────────────────

export function MarketNavigationScene() {
  const { data, regimes, loading, error } = useMarketData()

  // Determine current regime
  const regime = useMemo(
    () => mapRegime(regimes?.stress_regime ?? regimes?.stress),
    [regimes]
  )

  // Compute target peak heights from API data
  const targetHeights = useMemo(
    () => {
      const heights = data
        ? computePeakHeights(data, regimes)
        : PEAKS.map((p) => p.baseHeight * p.normalizer(null))
      console.log('[MarketNavigationScene] 📊 Peak heights computed:', heights)
      console.log('[MarketNavigationScene] 📊 PEAKS count:', PEAKS.length, 'Heights count:', heights.length)
      return heights
    },
    [data, regimes]
  )

  // Smoothly animate between height snapshots
  const animatedHeights = usePeakAnimation(targetHeights, 1000)

  const colors = getRegimeColors(regime)

  console.log('[MarketNavigationScene] 🎨 Render state:', {
    loading,
    error,
    hasData: !!data,
    hasRegimes: !!regimes,
    peakHeightsLength: animatedHeights.length,
    regime
  })

  if (loading) {
    console.log('[MarketNavigationScene] ⏳ Still loading...')
    return <LoadingScreen />
  }
  if (error && !data) {
    console.log('[MarketNavigationScene] ❌ Error state:', error)
    return <ErrorScreen message={error} />
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas
        camera={{ position: [0, 3, 13], fov: 82, near: 0.1, far: 1000 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ background: colors.fog }}
      >
        <SceneInner peakHeights={animatedHeights} regime={regime} />
      </Canvas>
    </div>
  )
}

export { MarketNavigationScene as default }
