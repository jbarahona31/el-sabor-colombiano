# 🚀 Quick Deploy Guide

This is a quick reference for deploying El Sabor Colombiano to Netlify + Railway.

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## ⚡ Prerequisites

- [ ] GitHub repository with latest code
- [ ] Railway account (https://railway.app)
- [ ] Netlify account (https://netlify.com)

## 📦 Step 1: Deploy Backend to Railway

1. **Create Railway Project**
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository
   - Set root directory to `backend`

2. **Add PostgreSQL**
   - In project, click "New" → "Database" → "PostgreSQL"
   - Railway auto-configures `DATABASE_URL`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-strong-random-key>
   PORT=3000
   FRONTEND_URL=<your-netlify-url-here>
   ```

4. **Initialize Database**
   - Connect to PostgreSQL in Railway
   - Run SQL from `backend/schema.sql`

5. **Get Backend URL**
   - Settings → Domains → Generate Domain
   - Copy URL (e.g., `https://el-sabor-colombiano.railway.app`)

## 🎨 Step 2: Deploy Frontend to Netlify

1. **Create Netlify Site**
   - Go to Netlify dashboard
   - Click "Add new site" → "Import from GitHub"
   - Select this repository

2. **Build Settings** (auto-detected from netlify.toml)
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

3. **Set Environment Variable**
   ```
   VITE_API_URL=<your-railway-url>/api
   ```
   ⚠️ **Important:** Include `/api` at the end!

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

5. **Get Frontend URL**
   - Copy Netlify URL (e.g., `https://el-sabor-colombiano.netlify.app`)

## 🔄 Step 3: Update Backend CORS

1. Go back to Railway
2. Update `FRONTEND_URL` variable with your Netlify URL
3. Railway will auto-redeploy

## ✅ Step 4: Verify

- [ ] Visit backend URL - should show API welcome message
- [ ] Visit frontend URL - React app should load
- [ ] Open DevTools → Network tab
- [ ] Try to login (admin/123456)
- [ ] Verify API calls work without CORS errors

## 🔐 Test Users

| Username | Password | Role |
|----------|----------|------|
| admin    | 123456   | Admin |
| mesero   | 123456   | Waiter |
| cocina   | 123456   | Kitchen |

## 🎯 Environment Variables Summary

### Railway (Backend)
```env
DATABASE_URL=<auto-set-by-railway>
NODE_ENV=production
JWT_SECRET=<your-secret-key>
PORT=3000
FRONTEND_URL=https://your-app.netlify.app
```

### Netlify (Frontend)
```env
VITE_API_URL=https://your-app.railway.app/api
```

## 🆘 Common Issues

**CORS Error?**
- Check `FRONTEND_URL` matches Netlify domain exactly
- Ensure it includes `https://`
- Redeploy backend after changing

**API Calls Fail?**
- Verify `VITE_API_URL` includes `/api` at the end
- Check Railway backend is running
- Test backend URL directly in browser

**Build Fails?**
- Check build logs in Netlify/Railway
- Verify environment variables are set
- Ensure dependencies are in package.json

## 📝 After Deployment

- [ ] Test all user roles (admin, mesero, cocina)
- [ ] Create some test orders
- [ ] Check that products load correctly
- [ ] Verify order status updates work
- [ ] Test admin panel functionality
- [ ] Change JWT_SECRET to a strong random value
- [ ] Set up custom domains (optional)
- [ ] Configure backup strategy for database

## 🔗 Useful Commands

```bash
# Test backend locally
cd backend && npm install && npm start

# Test frontend locally  
cd frontend && npm install && npm run dev

# Build frontend locally
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

---

**Need more help?** See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide.
