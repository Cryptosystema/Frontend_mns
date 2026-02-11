import { useEffect, useState, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  memory: number
  gpu: string
}

export function usePerformanceMonitor(enabled: boolean) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    gpu: 'unknown'
  })
  
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const rafId = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!enabled) return

    // FPS monitoring
    function measureFPS() {
      frameCount.current++
      const now = performance.now()
      const delta = now - lastTime.current

      if (delta >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / delta)
        
        // Check memory if available
        const memory = (performance as any).memory?.usedJSHeapSize || 0
        const memoryMB = Math.round(memory / 1048576)

        setMetrics(prev => ({
          ...prev,
          fps,
          memory: memoryMB
        }))

        frameCount.current = 0
        lastTime.current = now

        // Auto-disable 3D if performance too low
        if (fps < 20) {
          console.warn('Low FPS detected, consider disabling 3D')
        }

        if (memoryMB > 150) {
          console.warn('High memory usage detected')
        }
      }

      rafId.current = requestAnimationFrame(measureFPS)
    }

    // Get GPU info
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
        setMetrics(prev => ({ ...prev, gpu }))
      }
    }

    rafId.current = requestAnimationFrame(measureFPS)

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [enabled])

  return metrics
}
