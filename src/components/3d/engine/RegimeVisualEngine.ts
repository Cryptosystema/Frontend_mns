/**
 * Semantic Visual Engine
 * 
 * Maps regime state and confidence to professional-grade visual parameters.
 * Every parameter reflects system intelligence — no decorative effects.
 */

export interface RegimeVisualState {
  // Core visual identity
  tunnelColor: string
  fogColor: string
  fogDensity: number
  
  // Lighting parameters
  ambientIntensity: number
  glowIntensity: number
  bloomIntensity: number
  
  // Dynamic elements
  particleSpeed: number
  particleDensity: number
  
  // Material properties
  tunnelOpacity: number
  tunnelEmissive: number
  metalness: number
  roughness: number
}

/**
 * Compute visual state based on regime and confidence
 * 
 * @param regime - Current market regime
 * @param confidence - Prediction confidence (0-1)
 * @returns Complete visual state configuration
 */
export function computeRegimeVisualState(
  regime: 'NORMAL' | 'COMPRESSION' | 'ELEVATED_STRESS' | 'CRITICAL',
  confidence: number
): RegimeVisualState {
  // Normalize confidence to safe range
  const conf = Math.max(0, Math.min(1, confidence))
  
  // Base configurations per regime
  const regimeConfigs: Record<string, Omit<RegimeVisualState, 'fogDensity' | 'tunnelOpacity' | 'bloomIntensity'>> = {
    NORMAL: {
      tunnelColor: '#0b3d91',      // Deep blue - stable, professional
      fogColor: '#0a1929',          // Dark blue fog
      ambientIntensity: 0.5,
      glowIntensity: 0.6,
      particleSpeed: 0.03,
      particleDensity: 1.0,
      tunnelEmissive: 0.15,
      metalness: 0.2,
      roughness: 0.5
    },
    COMPRESSION: {
      tunnelColor: '#4a6fa5',      // Steel blue - neutral tension
      fogColor: '#1a2940',          // Medium blue fog
      ambientIntensity: 0.6,
      glowIntensity: 0.8,
      particleSpeed: 0.045,
      particleDensity: 1.2,
      tunnelEmissive: 0.2,
      metalness: 0.25,
      roughness: 0.45
    },
    ELEVATED_STRESS: {
      tunnelColor: '#ff9f1c',      // Amber - alert without panic
      fogColor: '#332415',          // Warm dark fog
      ambientIntensity: 0.7,
      glowIntensity: 1.0,
      particleSpeed: 0.06,
      particleDensity: 1.3,
      tunnelEmissive: 0.3,
      metalness: 0.3,
      roughness: 0.4
    },
    CRITICAL: {
      tunnelColor: '#b00020',      // Deep red - critical state
      fogColor: '#2d0a0e',          // Dark red fog
      ambientIntensity: 0.8,
      glowIntensity: 1.2,
      particleSpeed: 0.08,
      particleDensity: 1.5,
      tunnelEmissive: 0.4,
      metalness: 0.35,
      roughness: 0.35
    }
  }
  
  const base = regimeConfigs[regime]
  
  // Confidence modulation
  // High confidence = sharper, clearer environment
  // Low confidence = softer, more atmospheric uncertainty
  const confidenceModifier = {
    fogDensity: 0.015 + (0.025 * (1 - conf)),      // More fog when less confident
    opacityBoost: conf * 0.15,                      // Higher opacity with confidence
    bloomMultiplier: 1 + ((1 - conf) * 0.3)        // Subtle bloom increase with uncertainty
  }
  
  // Regime-specific fog density base
  const regimeFogBase: Record<string, number> = {
    NORMAL: 0.012,
    COMPRESSION: 0.018,
    ELEVATED_STRESS: 0.025,
    CRITICAL: 0.035
  }
  
  // Regime-specific bloom intensity
  const regimeBloomBase: Record<string, number> = {
    NORMAL: 0.3,
    COMPRESSION: 0.4,
    ELEVATED_STRESS: 0.6,
    CRITICAL: 0.8
  }
  
  return {
    ...base,
    fogDensity: regimeFogBase[regime] * confidenceModifier.bloomMultiplier,
    tunnelOpacity: Math.min(0.5, 0.25 + confidenceModifier.opacityBoost + (regime === 'CRITICAL' ? -0.05 : 0)),
    bloomIntensity: regimeBloomBase[regime] * confidenceModifier.bloomMultiplier
  }
}

/**
 * Get fog parameters for THREE.Fog
 */
export function getFogParameters(state: RegimeVisualState) {
  return {
    color: state.fogColor,
    near: 15,
    far: 15 + (50 / state.fogDensity)
  }
}

/**
 * Validate performance constraints
 * Ensures visual state stays within acceptable bounds
 */
export function validatePerformanceConstraints(state: RegimeVisualState): RegimeVisualState {
  return {
    ...state,
    particleDensity: Math.min(1.5, state.particleDensity),  // Never exceed 1.5x baseline
    bloomIntensity: Math.min(1.0, state.bloomIntensity)     // Cap bloom to avoid oversaturation
  }
}
