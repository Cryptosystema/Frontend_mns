# MNS Terminal

## 🌐 Production Status

**Live URL**: https://mns.com.ge  
**Backend**: https://mns-core-minimal-test.fly.dev  
**Status**: ✅ Operational (Phase 25 complete)

### Current Features
- ✅ Real-time BTC price updates (5s refresh via SSE)
- ✅ Market regime detection (Volatility/Trend/Stress/Liquidity)
- ✅ 7-day probabilistic forecasts (P10/P50/P90 quantiles)
- ✅ 24-hour price history chart
- ✅ Forecast confidence scoring with visual gauge
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Accessibility compliant (WCAG AA)
- ✅ SEO optimized (100/100 Lighthouse)

### Phase Status
- ✅ Phase 22: Backend Integration (SSE + REST fallback)
- ✅ Phase 23: Enhanced Intelligence (regime detection)
- ✅ Phase 24: Production Hardening (security + performance)
- ✅ Phase 25: UX Polish (charts + visualizations)
- ✅ Phase 26: Pre-Launch Validation (testing + QA)
- ⏭️ Next: Phase 28 (3D Visualization)

### Performance Metrics
- **Lighthouse Desktop**: 93/100 (Performance: 85/100)
- **Lighthouse Mobile**: 91/100 (Performance: 78/100)
- **Bundle Size**: 65.89 KB gzipped
- **Load Time**: <3s (desktop), <3.5s (mobile)
- **E2E Tests**: 10/10 passing ✅

---

## Integration Contract

MNS Terminal integrates with a production-ready backend via two delivery mechanisms: Server-Sent Events (SSE) as the primary real-time transport, and REST as a fallback snapshot mechanism. The formal integration contract defines endpoint specifications, delivery priority rules, degradation and recovery procedures, frontend responsibilities, and observability requirements. This contract governs Phase 22.2 (SSE client), Phase 22.3 (REST fallback), and future product development. See [docs/INTEGRATION_CONTRACT_PHASE_22.md](docs/INTEGRATION_CONTRACT_PHASE_22.md) for complete specification.

<!-- Force redeploy Sun Feb 16 2026 with TS6133 fix (commit 0189ab4) -->