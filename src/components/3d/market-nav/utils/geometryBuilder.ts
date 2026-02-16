import * as THREE from 'three'
import { ForecastDataPoint } from './types'

export function buildTopologyGeometry(
  predictions: ForecastDataPoint[],
  volatility: number
): THREE.BufferGeometry {
  const segments = 64  // High quality mesh
  const size = 40      // Scene size
  
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  const positions = geometry.attributes.position.array as Float32Array
  
  // Transform flat plane to topographic surface
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    
    // Normalize coordinates to 0-1 range
    const normalizedX = (x + size / 2) / size
    const normalizedY = (y + size / 2) / size
    
    // Map X to time axis (forecast days)
    const dayIndex = Math.floor(normalizedX * (predictions.length - 1))
    const currentDay = predictions[Math.min(dayIndex, predictions.length - 1)]
    const nextDay = predictions[Math.min(dayIndex + 1, predictions.length - 1)]
    
    // Interpolate between days
    const dayFraction = (normalizedX * (predictions.length - 1)) % 1
    const p10 = currentDay.p10 + (nextDay.p10 - currentDay.p10) * dayFraction
    const p50 = currentDay.p50 + (nextDay.p50 - currentDay.p50) * dayFraction
    const p90 = currentDay.p90 + (nextDay.p90 - currentDay.p90) * dayFraction
    
    // Map Y to probability range (P10 to P90)
    const priceAtPoint = p10 + (p90 - p10) * normalizedY
    
    // Calculate Z height (deviation from median)
    const deviation = Math.abs(priceAtPoint - p50)
    const baseHeight = (deviation / 1000) * (1 + volatility)
    
    // Add smooth wave effect for organic look
    const wave1 = Math.sin(normalizedX * Math.PI * 2) * 0.3
    const wave2 = Math.cos(normalizedY * Math.PI * 3) * 0.2
    const waveEffect = (wave1 + wave2) * volatility * 0.5
    
    // Set final Z position
    positions[i + 2] = baseHeight + waveEffect
  }
  
  // Recalculate normals for proper lighting
  geometry.computeVertexNormals()
  
  return geometry
}
