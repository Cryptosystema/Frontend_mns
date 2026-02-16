export interface ForecastDataPoint {
  day: number
  p10: number  // Lower confidence bound
  p50: number  // Median prediction
  p90: number  // Upper confidence bound
}

export interface MarketNavigationData {
  predictions: ForecastDataPoint[]
  regime: 'NORMAL' | 'MODERATE' | 'HIGH' | 'EXTREME'
  volatility: number      // 0-1 range
  confidence: number      // 0-1 range
  stress: number         // 0-1 range
}

export interface RegimeVisualConfig {
  surfaceColor: string
  emissiveColor: string
  lightColor: string
  particleColor: string
  particleSpeed: number
  particleCount: number
  emissiveIntensity: number
}
