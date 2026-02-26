import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { Html, EffectComposer, UnrealBloomPass } from '@react-three/drei';
import * as THREE from 'three';

// --- SHADER CODE ---
const vertexShader = `
  uniform float uTime;
  uniform float uVolatility;
  uniform float uConfidence;
  uniform float uRegime;
  uniform float uMu;
  uniform float uSigma;
  varying float vZ;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float x = (uv.x - 0.5) * 2.0;
    float y = (uv.y - 0.5) * 2.0;
    float gauss = uVolatility * exp(-pow(x - uMu, 2.0) / (2.0 * pow(uSigma, 2.0)));
    float z = gauss + 0.08 * sin(8.0 * x + uTime * 1.5) * (0.5 + uConfidence) + 0.04 * sin(12.0 * y + uTime * 2.0);
    vZ = z;
    vec3 pos = position;
    pos.z += z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uRegime;
  varying float vZ;
  varying vec2 vUv;
  void main() {
    vec3 colorNormal = vec3(0.0, 0.95, 1.0); // #00f2ff
    vec3 colorStress = vec3(1.0, 0.3, 0.0); // #ff4d00
    float glow = smoothstep(0.05, 0.15, abs(vZ));
    vec3 color = mix(colorNormal, colorStress, uRegime);
    color += glow * 1.2;
    gl_FragColor = vec4(color, 0.4 + 0.6 * glow);
  }
`;

// --- MAIN COMPONENT ---
interface SSEData {
  volatility: number;
  confidence: number;
  regime: number; // 0 = normal, 1 = stress
  mu: number;     // P50 center
  sigma: number;  // Spread (from P10/P90)
}

interface NeuralTunnelProps {
  sseData: SSEData;
}

export const NeuralTunnel: React.FC<NeuralTunnelProps> = ({ sseData }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, camera, gl } = useThree();

  // Geometry: High-density plane, tilted
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(8, 16, 128, 128);
    geo.rotateX(-Math.PI / 2.5);
    geo.translate(0, 0, 6);
    return geo;
  }, []);

  // Uniforms with lerping
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uVolatility: { value: sseData.volatility },
    uConfidence: { value: sseData.confidence },
    uRegime: { value: sseData.regime },
    uMu: { value: sseData.mu },
    uSigma: { value: sseData.sigma },
  }), []);

  // Smoothly interpolate uniforms
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let frame: number;
    function animate() {
      uniforms.uVolatility.value = lerp(uniforms.uVolatility.value, sseData.volatility, 0.08);
      uniforms.uConfidence.value = lerp(uniforms.uConfidence.value, sseData.confidence, 0.08);
      uniforms.uRegime.value = lerp(uniforms.uRegime.value, sseData.regime, 0.08);
      uniforms.uMu.value = lerp(uniforms.uMu.value, sseData.mu, 0.08);
      uniforms.uSigma.value = lerp(uniforms.uSigma.value, sseData.sigma, 0.08);
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [sseData, uniforms]);

  // Animate time
  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  });

  // Clean up geometry/material
  useEffect(() => {
    return () => {
      geometry.dispose();
      materialRef.current?.dispose();
    };
  }, [geometry]);

  // Wireframe color by regime
  const wireframeColor = sseData.regime < 0.5 ? '#00f2ff' : '#ff4d00';

  return (
    <group>
      {/* Tunnel Mesh */}
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          wireframe
          transparent
        />
      </mesh>
      {/* Neon Wireframe Overlay */}
      <mesh geometry={geometry} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={wireframeColor}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Post-processing: UnrealBloomPass */}
      <EffectComposer>
        <UnrealBloomPass threshold={0.1} strength={1.2} radius={0.8} />
      </EffectComposer>
      {/* HUD Overlays */}
      <Html position={[-3.5, 2.5, 2]} transform occlude style={{ minWidth: 220, backdropFilter: 'blur(10px)', background: 'rgba(10,20,40,0.55)', borderRadius: 12, padding: 16, color: '#00f2ff', fontFamily: 'JetBrains Mono, monospace', fontSize: 16, border: '1.5px solid #00f2ff' }}>
        <div>
          <b>Engine Status</b><br />
          Volatility: {sseData.volatility.toFixed(2)}<br />
          Confidence: {sseData.confidence.toFixed(2)}<br />
          Regime: {sseData.regime < 0.5 ? 'NORMAL' : 'STRESS'}
        </div>
      </Html>
      <Html position={[3.5, 2.5, 2]} transform occlude style={{ minWidth: 220, backdropFilter: 'blur(10px)', background: 'rgba(10,20,40,0.55)', borderRadius: 12, padding: 16, color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontSize: 16, border: '1.5px solid #fff' }}>
        <div>
          <b>Projection Details</b><br />
          μ (P50): {sseData.mu.toFixed(2)}<br />
          σ (Spread): {sseData.sigma.toFixed(2)}
        </div>
      </Html>
    </group>
  );
};

export default NeuralTunnel;
