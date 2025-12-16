# ✅ Deployment Verification Checklist

Use this checklist to verify your deployment is working correctly.

## 🔍 Pre-Deployment Verification

### Configuration Files Present
- [ ] `frontend/netlify.toml` exists
- [ ] `backend/railway.json` exists
- [ ] `backend/nixpacks.toml` exists
- [ ] `frontend/.env.example` exists
- [ ] `backend/.env.example` exists

### Documentation Available
- [ ] `DEPLOYMENT.md` - Detailed guide
- [ ] `QUICK_DEPLOY.md` - Quick reference
- [ ] `DEPLOYMENT_SUMMARY.md` - Overview
- [ ] `frontend/README.md` - Frontend docs
- [ ] `backend/README.md` - Backend docs

### Local Build Tests
- [ ] `cd frontend && npm install` - Dependencies install
- [ ] `cd frontend && npm run build` - Build succeeds
- [ ] `cd frontend && npm run lint` - Linting passes
- [ ] `cd backend && npm install` - Dependencies install
- [ ] Build output in `frontend/dist/` looks correct

## 🚀 Railway Backend Deployment

### Initial Setup
- [ ] Railway account created
- [ ] Project created from GitHub repository
- [ ] Root directory set to `backend`
- [ ] PostgreSQL database added
- [ ] `DATABASE_URL` automatically set

### Environment Variables Set
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET=<strong-random-key>` (min 32 characters)
- [ ] `PORT=3000`
- [ ] `FRONTEND_URL=<will-set-after-netlify>`

### Database Initialization
- [ ] Connected to PostgreSQL
- [ ] Executed `schema.sql` successfully
- [ ] Verified tables exist: `usuarios`, `productos`, `pedidos`
- [ ] Test users exist (admin, mesero, cocina)

### Deployment Success
- [ ] Build logs show successful deployment
- [ ] No error messages in deployment logs
- [ ] Backend URL generated (e.g., `https://xyz.railway.app`)

### Backend API Testing
- [ ] Visit `https://your-backend.railway.app`
- [ ] Should see welcome JSON message
- [ ] Status code 200
- [ ] JSON includes endpoints info

Test with curl:
```bash
curl https://your-backend.railway.app
# Should return: {"mensaje": "🇨🇴 Bienvenido a El Sabor Colombiano API", ...}
```

- [ ] Test login endpoint:
```bash
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","clave":"123456"}'
# Should return token
```

## 🎨 Netlify Frontend Deployment

### Initial Setup
- [ ] Netlify account created
- [ ] Site created from GitHub repository
- [ ] Build settings auto-detected from `netlify.toml`
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`

### Environment Variables Set
- [ ] `VITE_API_URL=https://your-backend.railway.app/api`
- [ ] ⚠️ **Important**: URL ends with `/api`

### Deployment Success
- [ ] Build logs show successful build
- [ ] No error messages in build logs
- [ ] Site published successfully
- [ ] Frontend URL generated (e.g., `https://xyz.netlify.app`)

### Frontend Testing
- [ ] Visit `https://your-frontend.netlify.app`
- [ ] React app loads without errors
- [ ] No console errors in DevTools
- [ ] Vite logo and React logo visible (default app)

## 🔗 Integration Testing

### Update Backend CORS
- [ ] Go back to Railway
- [ ] Set `FRONTEND_URL=https://your-frontend.netlify.app`
- [ ] Wait for automatic redeployment
- [ ] Check backend logs - no errors

### Test Cross-Origin Communication
Open frontend in browser with DevTools:

- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Try to make API call
- [ ] No CORS errors appear
- [ ] API calls reach backend successfully

Test login flow:
- [ ] Click on login page
- [ ] Enter: username `admin`, password `123456`
- [ ] Check Network tab for API call
- [ ] Should POST to `https://your-backend.railway.app/api/auth/login`
- [ ] Should receive token in response
- [ ] No CORS errors
- [ ] Successfully redirected after login

## 🧪 Functional Testing

### Authentication
- [ ] Login works for admin (admin/123456)
- [ ] Login works for mesero (mesero/123456)
- [ ] Login works for cocina (cocina/123456)
- [ ] Invalid credentials show error
- [ ] Token stored in localStorage
- [ ] Logout works correctly

### Products
- [ ] Products list loads
- [ ] Can view product details
- [ ] Admin can create product
- [ ] Admin can edit product
- [ ] Admin can delete product
- [ ] Non-admin cannot modify products

### Orders
- [ ] Can create new order
- [ ] Order appears in orders list
- [ ] Can view order details
- [ ] Can update order status
- [ ] Statistics load correctly (admin)

### Real-time Updates
- [ ] Pedidos refresh automatically
- [ ] Status changes reflect immediately
- [ ] Sound notification works (kitchen panel)

## 🔐 Security Verification

### HTTPS
- [ ] Frontend uses HTTPS (automatic on Netlify)
- [ ] Backend uses HTTPS (automatic on Railway)
- [ ] No mixed content warnings

### CORS
- [ ] Only frontend URL allowed in production
- [ ] No wildcard (`*`) CORS in production
- [ ] Credentials: true is set
- [ ] OPTIONS requests handled correctly

### Authentication
- [ ] JWT tokens expire correctly
- [ ] Unauthorized requests blocked
- [ ] Protected routes require authentication
- [ ] Role-based access control works

### Environment Variables
- [ ] No secrets in source code
- [ ] All secrets in environment variables
- [ ] `.env` files not committed to git
- [ ] JWT_SECRET is strong and unique

## 📊 Performance Checks

### Frontend
- [ ] Page loads in < 3 seconds
- [ ] Assets cached correctly
- [ ] Lighthouse score > 90
- [ ] No unused dependencies

### Backend
- [ ] API responses < 1 second
- [ ] Database queries optimized
- [ ] Connection pooling active
- [ ] No memory leaks

### Database
- [ ] Queries complete quickly
- [ ] Indexes present on key columns
- [ ] Connection pool size appropriate

## 🔍 Error Handling

### Test Error Scenarios
- [ ] Network timeout handled gracefully
- [ ] Invalid input shows user-friendly error
- [ ] 404 routes handled correctly
- [ ] 500 errors logged but sanitized
- [ ] Rate limiting works (test with many requests)

## 📱 Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

## 🎯 Post-Deployment Tasks

### Monitoring Setup
- [ ] Check Railway dashboard for metrics
- [ ] Check Netlify dashboard for traffic
- [ ] Set up alerts for downtime (optional)

### Documentation
- [ ] Update README with live URLs
- [ ] Document any deployment issues encountered
- [ ] Create runbook for common issues

### Backups
- [ ] Database backup configured in Railway
- [ ] Source code in GitHub (version control)
- [ ] Environment variables documented

### Custom Domains (Optional)
- [ ] Purchase domain name
- [ ] Configure DNS for frontend (Netlify)
- [ ] Configure DNS for backend (Railway)
- [ ] SSL certificates auto-generated
- [ ] Update CORS and environment variables

## ✨ Success Criteria

All items should be checked before considering deployment successful:

**Critical (Must Pass)**
- [ ] Frontend loads without errors
- [ ] Backend API responds correctly
- [ ] Database connected and initialized
- [ ] Authentication works
- [ ] No CORS errors
- [ ] HTTPS enabled on both services
- [ ] Environment variables set correctly

**Important (Should Pass)**
- [ ] All CRUD operations work
- [ ] Real-time updates function
- [ ] Security headers present
- [ ] Performance acceptable

**Nice to Have**
- [ ] Custom domains configured
- [ ] Monitoring set up
- [ ] Backups scheduled

## 🐛 Common Issues & Solutions

### "CORS policy blocked"
**Solution**: Update `FRONTEND_URL` in Railway to match Netlify URL exactly

### "Network Error" on API calls
**Solution**: Check `VITE_API_URL` includes `/api` at the end

### "Database connection failed"
**Solution**: Verify PostgreSQL service is running in Railway

### "Build failed" on Netlify
**Solution**: Check build logs, verify Node version, check dependencies

### "502 Bad Gateway" from Railway
**Solution**: Check backend logs, verify `PORT` is set, check if app starts

## 📞 Support

If issues persist:
1. Check deployment logs in Railway/Netlify
2. Review `DEPLOYMENT.md` for detailed troubleshooting
3. Check Railway/Netlify status pages
4. Open issue in GitHub repository

---

**Deployment Date**: ___________________

**Verified By**: ___________________

**Status**: [ ] Pass [ ] Fail [ ] Needs Attention

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
