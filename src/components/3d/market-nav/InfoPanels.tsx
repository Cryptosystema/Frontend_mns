import { MarketNavigationData } from './utils/types'

interface Props {
  data: MarketNavigationData
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(10, 14, 20, 0.85)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  fontFamily: 'monospace',
  fontSize: '12px',
  minWidth: '200px',
}

export function InfoPanels({ data }: Props) {
  return (
    <>
      {/* Engine Status - Left Panel */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          ...panelStyle,
        }}
      >
        <h3 style={{ color: '#ffffff', margin: '0 0 15px 0', fontSize: '14px' }}>
          Engine Status
        </h3>
        
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#8b949e' }}>Regime: </span>
          <span style={{ color: '#ffffff' }}>{data.regime}</span>
          <span style={{ color: '#00ff88', marginLeft: '8px' }}>
            {(1 + data.volatility * 0.1).toFixed(2)}x
          </span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#8b949e' }}>VOLATILITY: </span>
          <span style={{ color: data.volatility > 0.5 ? '#ff8800' : '#00ff88' }}>
            {(data.volatility * 100).toFixed(0)}%
          </span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#8b949e' }}>CONFIDENCE: </span>
          <span style={{ color: '#ffffff' }}>
            {(data.confidence * 100).toFixed(0)}%
          </span>
        </div>
        
        <div>
          <span style={{ color: '#8b949e' }}>STATUS: </span>
          <span style={{ color: '#00ff88' }}>LIVE</span>
        </div>
      </div>
      
      {/* Projection Details - Right Panel */}
      <div
        style={{
          position: 'absolute',
          right: '20px',
          top: '20px',
          ...panelStyle,
        }}
      >
        <h3 style={{ color: '#ffffff', margin: '0 0 15px 0', fontSize: '14px' }}>
          Projection Details
        </h3>
        
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#8b949e' }}>Horizon: </span>
          <span
            style={{
              color: '#00ff88',
              background: 'rgba(0, 255, 136, 0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            {data.predictions.length} DAYS
          </span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#8b949e' }}>Data Points: </span>
          <span style={{ color: '#ffffff' }}>{data.predictions.length}</span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#8b949e' }}>Range: </span>
          <span style={{ color: '#ffffff' }}>P10-P90</span>
        </div>
        
        <div>
          <span style={{ color: '#8b949e' }}>Mode: </span>
          <span style={{ color: '#ffffff' }}>PROBABILISTIC</span>
        </div>
      </div>
    </>
  )
}
