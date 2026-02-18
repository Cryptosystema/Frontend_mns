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
    try {
      const [latestRes, regimesRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/latest`),
        fetch(`${API_BASE}/api/v1/regimes`)
      ])

      if (!mountedRef.current) return

      if (!latestRes.ok || !regimesRes.ok) {
        throw new Error(
          `API fetch failed: latest=${latestRes.status}, regimes=${regimesRes.status}`
        )
      }

      const latest = await latestRes.json()
      const regimesData = await regimesRes.json()

      if (!mountedRef.current) return

      setData(latest)
      setRegimes(regimesData)
      setLoading(false)
      setError(null)
      setLastUpdated(Date.now())
    } catch (err: any) {
      console.error('[useMarketData] Failed to fetch market data:', err)
      if (mountedRef.current) {
        setError(err.message || 'Unknown error')
        setLoading(false)
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
