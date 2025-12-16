# 🚀 Deployment Guide - El Sabor Colombiano

This guide explains how to deploy the El Sabor Colombiano application using:
- **Netlify** for the React frontend
- **Railway** for the Node.js backend + PostgreSQL database

## 📋 Prerequisites

- GitHub account with access to this repository
- Netlify account (free tier works)
- Railway account (free trial available)

---

## 🔧 Backend Deployment (Railway)

### Step 1: Create Railway Project

1. Go to [Railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select the `el-sabor-colombiano` repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically provision a PostgreSQL database
3. The `DATABASE_URL` environment variable will be automatically set

### Step 3: Configure Backend Service

1. Click on your backend service (should auto-detect the Node.js app)
2. Go to **Settings** → **Root Directory**
3. Set root directory to: `backend`
4. Railway will automatically detect `package.json` and install dependencies

### Step 4: Set Environment Variables

Go to **Variables** tab and add:

```bash
# Required Environment Variables
NODE_ENV=production
JWT_SECRET=your_very_secure_random_secret_key_here_change_this
PORT=3000
FRONTEND_URL=https://your-netlify-domain.netlify.app
```

**Important:**
- Generate a strong JWT_SECRET (use a password generator)
- You'll set the actual Netlify URL after deploying the frontend
- `DATABASE_URL` is automatically set by Railway when you add PostgreSQL

### Step 5: Initialize Database

1. Once deployed, go to your Railway backend service
2. Click **"Connect"** → **"PostgreSQL"**
3. Open a connection to your database
4. Run the SQL schema from `backend/schema.sql` to create tables and seed data

**Alternative:** You can use Railway's CLI or any PostgreSQL client:
```bash
psql $DATABASE_URL -f backend/schema.sql
```

### Step 6: Get Backend URL

1. Go to **Settings** → **Domains**
2. Click **"Generate Domain"** to get a public URL
3. Your backend will be available at: `https://your-app.railway.app`
4. Save this URL - you'll need it for the frontend configuration

---

## 🎨 Frontend Deployment (Netlify)

### Step 1: Create Netlify Site

1. Go to [Netlify.com](https://netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify and select the `el-sabor-colombiano` repository

### Step 2: Configure Build Settings

Set the following in the deploy configuration:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

**Note:** The `netlify.toml` file in the frontend directory already contains these settings, so they should auto-populate.

### Step 3: Set Environment Variables

Before deploying, add environment variables:

1. Go to **Site settings** → **Environment variables**
2. Add the following variable:

```bash
VITE_API_URL=https://your-railway-backend.railway.app/api
```

**Replace `your-railway-backend.railway.app` with your actual Railway backend URL from Step 6 above.**

### Step 4: Deploy

1. Click **"Deploy site"**
2. Netlify will:
   - Install dependencies
   - Run the build command
   - Publish the `dist` folder
3. Wait for deployment to complete (usually 1-2 minutes)

### Step 5: Get Frontend URL

1. After deployment, you'll get a URL like: `https://random-name.netlify.app`
2. You can customize this under **Site settings** → **Domain management**
3. Copy this URL

### Step 6: Update Backend CORS

1. Go back to Railway
2. Update the `FRONTEND_URL` environment variable with your Netlify URL
3. Railway will automatically redeploy the backend

---

## ✅ Verify Deployment

### Test Backend

Visit your Railway URL in a browser:
```
https://your-app.railway.app
```

You should see:
```json
{
  "mensaje": "🇨🇴 Bienvenido a El Sabor Colombiano API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "productos": "/api/productos",
    "pedidos": "/api/pedidos"
  }
}
```

### Test Frontend

1. Visit your Netlify URL
2. The React app should load
3. Try logging in with test credentials:
   - Username: `admin` / Password: `123456`
   - Username: `mesero` / Password: `123456`
   - Username: `cocina` / Password: `123456`

### Test Integration

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to fetch data from the app
4. Verify that API calls go to your Railway backend
5. Check that there are no CORS errors

---

## 🔄 Continuous Deployment

Both Netlify and Railway support automatic deployments:

### Automatic Deploys on Push

1. **Railway**: Deploys automatically when you push to the main branch
2. **Netlify**: Deploys automatically when you push to the main branch

### Deploy from Branch

Both platforms support deploying from specific branches:
- Set up branch deploys in Railway and Netlify settings
- Useful for staging environments

---

## 🔐 Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production` in Railway
- [ ] Enable SSL (automatic on both Railway and Netlify)
- [ ] Set proper CORS origins (update `FRONTEND_URL`)
- [ ] Review and update rate limiting settings if needed
- [ ] Set up database backups in Railway
- [ ] Enable Netlify's security headers (already in netlify.toml)
- [ ] Add custom domain names (optional)

---

## 📊 Environment Variables Summary

### Backend (Railway)

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | Auto-set by Railway | ✅ Yes |
| `JWT_SECRET` | `your_secret_key_min_32_chars` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `PORT` | `3000` | ✅ Yes |
| `FRONTEND_URL` | `https://your-app.netlify.app` | ✅ Yes |

### Frontend (Netlify)

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `https://your-app.railway.app/api` | ✅ Yes |

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Database connection fails**
- Check that PostgreSQL service is running in Railway
- Verify `DATABASE_URL` is set correctly
- Check database logs in Railway

**Problem: 502 Bad Gateway**
- Check backend logs in Railway
- Verify the app starts correctly (`npm start`)
- Ensure PORT is set correctly

**Problem: CORS errors**
- Verify `FRONTEND_URL` matches your Netlify domain exactly
- Check that it includes `https://`
- Redeploy backend after changing CORS settings

### Frontend Issues

**Problem: Build fails**
- Check build logs in Netlify
- Verify all dependencies are in `package.json`
- Ensure `vite.config.js` is correct

**Problem: API calls fail**
- Verify `VITE_API_URL` is set correctly in Netlify
- Check Network tab in browser DevTools
- Ensure backend URL ends with `/api`

**Problem: 404 on page refresh**
- The `netlify.toml` should handle this
- Verify the redirect rule is present
- Check Netlify deploy logs

### General Issues

**Problem: Environment variables not working**
- Redeploy after changing environment variables
- Check that variable names are spelled correctly
- For Vite, ensure frontend variables start with `VITE_`

---

## 🔗 Useful Links

### Railway
- Dashboard: https://railway.app/dashboard
- Documentation: https://docs.railway.app/
- CLI: https://docs.railway.app/develop/cli

### Netlify
- Dashboard: https://app.netlify.com/
- Documentation: https://docs.netlify.com/
- CLI: https://docs.netlify.com/cli/get-started/

---

## 📞 Support

If you encounter issues:
1. Check the logs in Railway/Netlify dashboards
2. Review this deployment guide
3. Check the main README.md for project details
4. Open an issue in the GitHub repository

---

**Deployment Status After Setup:**
- ✅ Frontend: Live on Netlify with automatic deploys
- ✅ Backend: Running on Railway with PostgreSQL
- ✅ CORS: Configured for cross-origin requests
- ✅ SSL: Enabled automatically on both platforms
- ✅ CI/CD: Automatic deploys on git push

🎉 Your application is now live and ready for users!
