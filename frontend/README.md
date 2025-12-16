# El Sabor Colombiano - Frontend

React frontend application built with Vite.

## 🚀 Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure backend URL in `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

Build the app:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

Build output will be in the `dist/` directory.

## 🚢 Netlify Deployment

This frontend is configured for Netlify deployment.

### Automatic Deployment

Netlify will automatically:
- Install dependencies
- Run `npm run build`
- Publish the `dist/` directory
- Apply settings from `netlify.toml`

### Configuration

The `netlify.toml` file includes:
- Build settings (already configured)
- SPA redirect rules for client-side routing
- Security headers
- Cache control for assets

### Required Environment Variable

Set this in Netlify dashboard:

- `VITE_API_URL` - Your Railway backend URL (e.g., https://your-app.railway.app/api)

**Important:** The URL must include `/api` at the end.

### Manual Deployment

You can also deploy manually using Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── api.js           # API configuration & client
│   ├── assets/              # Images, icons
│   ├── App.jsx              # Main component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static files
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── netlify.toml             # Netlify configuration
├── .env.example             # Environment variables template
└── package.json             # Dependencies
```

## 🔧 Environment Variables

All frontend environment variables must start with `VITE_` to be exposed to the client.

Available variables:
- `VITE_API_URL` - Backend API base URL

## 🛠️ Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📝 Notes

- This is a Vite + React project
- Environment variables are baked into the build at build time
- The `netlify.toml` handles SPA routing (all routes go to index.html)
- API client in `src/config/api.js` handles authentication tokens

For detailed deployment instructions, see [DEPLOYMENT.md](../DEPLOYMENT.md) in the root directory.
