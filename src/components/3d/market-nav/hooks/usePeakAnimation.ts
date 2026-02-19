/**
 * usePeakAnimation — Smooth peak height transitions
 * 
 * Animates between old and new peak heights using ease-out cubic.
 * Returns interpolated heights array updated each animation frame.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export function usePeakAnimation(
  targetHeights: number[],
  duration: number = 1000
): number[] {
  const [currentHeights, setCurrentHeights] = useState<number[]>(targetHeights)
  const startHeightsRef = useRef<number[]>(targetHeights)
  const startTimeRef = useRef<number>(Date.now())
  const rafRef = useRef<number | null>(null)
  const targetRef = useRef<number[]>(targetHeights)

  // Memoize target comparison
  const targetKey = targetHeights.join(',')

  useEffect(() => {
    startHeightsRef.current = [...currentHeights]
    startTimeRef.current = Date.now()
    targetRef.current = targetHeights

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)

      const target = targetRef.current
      const start = startHeightsRef.current
      if (target.length === 0) return
      const newHeights = target.map((t, i) => {
        const s = (i < start.length ? start[i] : null) ?? t
        return s + (t - s) * eased
      })

      setCurrentHeights(newHeights)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [targetKey, duration])

  return currentHeights
}
