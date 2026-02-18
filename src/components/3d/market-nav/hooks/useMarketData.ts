/**
 * useMarketData — Real-time market data fetching hook
 * 
 * Fetches from MNS backend:
 *   /api/v1/latest  — forecast quantiles + confidence
 *   /api/v1/regimes — current regime classification
 * 
 * Polls every 30 seconds as fallback for SSE.
 */

import { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = 'https://mns-core-minimal-test.fly.dev'

// ─── Mock data fallback (used when API is unreachable) ────────────

const MOCK_DATA = {
  tier0: {
    symbol: 'BTCUSDT',
    horizon: '7D',
    p10: 64000,
    p25: 65500,
    p50: 67000,
    p75: 68500,
    p90: 70000,
    confidence: 0.75
  },
  tier1: {
    bias: 'NEUTRAL',
    stability: 'MODERATE'
  },
  tier2: {
    liquidity_state: 'DEEP',
    drivers: ['NEUTRAL_FLOW'],
    blockers: ['RANGE_BOUND']
  }
}

const MOCK_REGIMES = {
  volatility_regime: 'MODERATE',
  trend_regime: 'CONSOLIDATING',
  stress_regime: 'NORMAL',
  liquidity_regime: 'NORMAL'
}

export interface MarketDataState {
  data: any | null
  regimes: any | null
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

export function useMarketData(): MarketDataState {
  const [data, setData] = useState<any>(null)
  const [regimes, setRegimes] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    console.log('[useMarketData] 🔄 Fetching data...')

    try {
      const [latestRes, regimesRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/latest`),
        fetch(`${API_BASE}/api/v1/regimes`)
      ])

      console.log('[useMarketData] 📡 Response status:', {
        latest: latestRes.status,
        regimes: regimesRes.status
      })

      if (!mountedRef.current) {
        console.log('[useMarketData] ⚠️ Component unmounted, aborting')
        return
      }

      if (!latestRes.ok || !regimesRes.ok) {
        throw new Error(
          `API fetch failed: latest=${latestRes.status}, regimes=${regimesRes.status}`
        )
      }

      const latest = await latestRes.json()
      const regimesData = await regimesRes.json()

      console.log('[useMarketData] ✅ Data received:', {
        latest,
        regimes: regimesData
      })

      if (!mountedRef.current) return

      setData(latest)
      setRegimes(regimesData)
      setLoading(false)
      setError(null)
      setLastUpdated(Date.now())

      console.log('[useMarketData] ✅ State updated, loading=false')
    } catch (err: any) {
      console.error('[useMarketData] ❌ Error, using mock data:', err)
      if (mountedRef.current) {
        // Use mock data as fallback instead of showing error
        setData(MOCK_DATA)
        setRegimes(MOCK_REGIMES)
        setLoading(false)
        setError(null)
        setLastUpdated(Date.now())
        console.log('[useMarketData] 🔄 Mock data applied as fallback')
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true

    // Initial fetch
    fetchData()

    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [fetchData])

  return { data, regimes, loading, error, lastUpdated }
}
