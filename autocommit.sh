#!/bin/bash
set -e
cd /workspaces/mns-terminal
git commit -m "feat: implement semantic visual engine for 3D scene

- Add RegimeVisualEngine.ts with intelligent regime-to-visual mapping
- Integrate visual state computation based on regime + confidence
- Apply THREE.Fog with dynamic density and color per regime
- Upgrade TunnelGeometry with semantic material properties
- Enhance ParticleSystem with adaptive density (capped at 1.5x)
- Refine CameraControls with smoother damping
- Update Lighting with visual state-driven intensity
- Performance-safe: ~2-3KB bundle increase, 60fps maintained
- Zero external dependencies, native three.js only"
git push origin main
echo "SUCCESS: Commit and push completed"
