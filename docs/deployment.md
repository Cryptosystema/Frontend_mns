# MNS Terminal - Deployment Information

## 🌐 Production URLs

**Frontend**: https://mns.com.ge  
**Backend API**: https://mns-core-minimal-test.fly.dev  
**Status**: ✅ Operational

## 🏗️ Infrastructure

### Frontend (Vercel)
- **Platform**: Vercel
- **Region**: Global CDN
- **Framework**: Vite + TypeScript
- **Auto-Deploy**: Enabled (main branch)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

### Backend (Fly.io)
- **Platform**: Fly.io
- **Region**: Frankfurt (fra)
- **Runtime**: Python 3.11
- **Framework**: FastAPI
- **Instances**: 1x shared-cpu-1x
- **Memory**: 256MB

## 📦 Build Information

### Bundle Sizes
- **CSS**: 15.59 KB (gzipped: 3.63 KB)
- **JavaScript**: 190.08 KB (gzipped: 65.50 KB)
- **Total**: ~205 KB (gzipped: ~69 KB)

### Dependencies
- **Production**: chart.js (visualization)
- **Dev**: typescript, vite

## 🚀 Deployment History

### Phase 25 (Feb 12, 2026) - UX Polish
- Responsive design system
- Chart.js integration
- Loading states & error handling
- SEO optimization
- Commit: `95b98e7`

### Phase 24 (Feb 11, 2026) - Production Hardening
- Security enhancements
- Performance optimization
- Error resilience

### Phase 23 (Feb 10, 2026) - Real-time Data UI
- Live BTC price display
- Market regime indicators
- Confidence visualization

### Phase 22 (Feb 9, 2026) - SSE Integration
- Server-Sent Events client
- Real-time updates
- Delivery controller

## 🔧 Configuration

### Environment Variables (Frontend)
```bash
# No environment variables required (all hardcoded for MVP)
BACKEND_URL=https://mns-core-minimal-test.fly.dev
```

### API Endpoints
```
GET /api/v1/price          # Current BTC price
GET /api/v1/regimes        # Market regimes
GET /api/v1/latest         # Latest forecast
GET /stream                # SSE real-time updates
```

## 📊 Performance Metrics

### Lighthouse Scores (Production)
- **Desktop**: 93/100 average
- **Mobile**: 91/100 average
- **Accessibility**: 95/100
- **SEO**: 100/100

### Load Times
- **First Contentful Paint**: 1.2s (desktop), 1.8s (mobile)
- **Largest Contentful Paint**: 2.1s (desktop), 3.2s (mobile)
- **Time to Interactive**: 2.8s (desktop), 3.5s (mobile)

## 🔄 CI/CD Pipeline

### Automatic Deployments
1. **Push to main branch** → GitHub webhook
2. **Vercel detects change** → starts build
3. **Build executes** → `npm ci && npm run build`
4. **Deploy to production** → global CDN update
5. **Status**: Build complete (~30-45 seconds)

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Or preview deployment
vercel
```

## 🛡️ Security

### HTTPS
- ✅ Frontend: Forced HTTPS (Vercel automatic)
- ✅ Backend: HTTPS with Let's Encrypt (Fly.io)

### CORS
- Configured for `mns.com.ge` origin
- Credentials: Not required (public API)

### Content Security Policy
- Default Vercel CSP applied
- No custom CSP configured (future enhancement)

## 📝 Monitoring

### Frontend
- **Platform**: Vercel Analytics
- **Error Tracking**: Console errors logged
- **Performance**: Vercel Speed Insights

### Backend
- **Platform**: Fly.io Metrics
- **Uptime**: Fly.io health checks
- **Logs**: `fly logs` command

## 🔍 Troubleshooting

### Frontend Issues
```bash
# Check build logs
vercel logs

# Test local build
npm run build && npm run preview
```

### Backend Issues
```bash
# Check API health
curl https://mns-core-minimal-test.fly.dev/health

# View logs
fly logs -a mns-core-minimal-test
```

### Common Issues
1. **Charts not loading**: Check Chart.js CDN availability
2. **API timeout**: Backend cold start (30s first request)
3. **CORS errors**: Verify origin configuration

## 📞 Support

- **Repository**: https://github.com/Cryptosystema/mns-terminal
- **Issues**: GitHub Issues
- **Docs**: `/docs` directory

## ✅ Production Checklist

Pre-launch validation (Phase 26):
- [x] Lighthouse audit passed
- [x] E2E tests passed (10/10)
- [x] Mobile responsive verified
- [x] Cross-browser tested
- [x] Accessibility validated
- [x] SEO optimized
- [x] Performance acceptable
- [x] Error handling tested
- [x] Security reviewed
- [x] Documentation complete

**Status**: 🚀 PRODUCTION READY FOR MVP LAUNCH
