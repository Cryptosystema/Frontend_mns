import { RegimeVisualConfig } from './types'

export const REGIME_CONFIG: Record<string, RegimeVisualConfig> = {
  NORMAL: {
    surfaceColor: '#00a8ff',      // Cool blue
    emissiveColor: '#0088cc',      // Blue glow
    lightColor: '#00d4ff',         // Bright blue light
    particleColor: '#00c8ff',      // Blue particles
    particleSpeed: 0.01,           // Slow movement
    particleCount: 300,            // Few particles
    emissiveIntensity: 0.3,        // Subtle glow
  },
  MODERATE: {
    surfaceColor: '#00ff88',       // Green
    emissiveColor: '#00cc66',
    lightColor: '#00ff99',
    particleColor: '#00ff88',
    particleSpeed: 0.03,
    particleCount: 500,
    emissiveIntensity: 0.4,
  },
  HIGH: {
    surfaceColor: '#ff8800',       // Orange
    emissiveColor: '#dd6600',
    lightColor: '#ffaa00',
    particleColor: '#ff8800',
    particleSpeed: 0.06,
    particleCount: 800,
    emissiveIntensity: 0.5,
  },
  EXTREME: {
    surfaceColor: '#ff4444',       // Red
    emissiveColor: '#dd2222',
    lightColor: '#ff6666',
    particleColor: '#ff4444',
    particleSpeed: 0.1,             // Fast chaotic
    particleCount: 1200,            // Many particles
    emissiveIntensity: 0.7,         // Strong glow
  },
}

export function getRegimeConfig(regime: string): RegimeVisualConfig {
  return REGIME_CONFIG[regime] || REGIME_CONFIG.NORMAL
}
