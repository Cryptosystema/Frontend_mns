// INTEGRATION EXAMPLE for MarketNavigationScene
// This file demonstrates how to integrate the 3D Market Navigation visualization
// into your application.

import { MarketNavigationScene } from '@/components/3d/market-nav'
import type { MarketNavigationData } from '@/components/3d/market-nav'

// Example 1: With Mock Data (for testing)
export function MarketNavigationDemo() {
  const mockData: MarketNavigationData = {
    predictions: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      p10: 90000 + i * 100 + Math.random() * 500,
      p50: 95000 + i * 150 + Math.random() * 700,
      p90: 100000 + i * 200 + Math.random() * 900,
    })),
    regime: 'NORMAL',
    volatility: 0.3,
    confidence: 0.85,
    stress: 0.2,
  }

  return (
    <div>
      <h1 style={{ color: '#fff', fontFamily: 'monospace', padding: '20px' }}>
        Market Navigation 3D Visualization
      </h1>
      <MarketNavigationScene data={mockData} />
    </div>
  )
}

// Example 2: With Real Forecast Data
// Uncomment and adapt to your data structure:
/*
import { useForecastData } from '@/hooks/useForecastData'

export function MarketNavigationWithRealData() {
  const forecastData = useForecastData() // Your SSE hook
  
  // Transform forecast data to MarketNavigationData format
  const navigationData: MarketNavigationData = {
    predictions: forecastData.tiers.tier0.predictions.map(p => ({
      day: p.day,
      p10: p.p10,
      p50: p.p50,
      p90: p.p90,
    })),
    regime: forecastData.regime.stress, // 'NORMAL' | 'MODERATE' | 'HIGH' | 'EXTREME'
    volatility: forecastData.regime.volatility,
    confidence: forecastData.confidence,
    stress: forecastData.regime.stress_score,
  }
  
  return <MarketNavigationScene data={navigationData} />
}
*/

// Example 3: Switching Between Regimes (for testing different states)
export function MarketNavigationRegimeTest() {
  const regimes: Array<'NORMAL' | 'MODERATE' | 'HIGH' | 'EXTREME'> = [
    'NORMAL',
    'MODERATE',
    'HIGH',
    'EXTREME',
  ]

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {regimes.map((regime) => {
        const data: MarketNavigationData = {
          predictions: Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            p10: 90000 + i * 100,
            p50: 95000 + i * 150,
            p90: 100000 + i * 200,
          })),
          regime,
          volatility: regime === 'EXTREME' ? 0.9 : regime === 'HIGH' ? 0.6 : regime === 'MODERATE' ? 0.4 : 0.2,
          confidence: 0.85,
          stress: regime === 'EXTREME' ? 0.9 : regime === 'HIGH' ? 0.7 : regime === 'MODERATE' ? 0.5 : 0.2,
        }

        return (
          <div key={regime} style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#fff', fontFamily: 'monospace', padding: '20px' }}>
              {regime} Regime
            </h2>
            <MarketNavigationScene data={data} />
          </div>
        )
      })}
    </div>
  )
}
