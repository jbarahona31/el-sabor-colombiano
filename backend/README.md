# El Sabor Colombiano - Backend

Backend API built with Node.js, Express, and PostgreSQL.

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

3. Configure your database URL in `.env`:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/el_sabor_colombiano
JWT_SECRET=your_secret_key_here
PORT=3000
```

4. Create database and run schema:
```bash
# Create database
createdb el_sabor_colombiano

# Run schema
psql -d el_sabor_colombiano -f schema.sql
```

5. Start the server:
```bash
npm start

# or with hot reload:
npm run dev
```

## 🚢 Railway Deployment

This backend is configured for Railway deployment with PostgreSQL.

### Automatic Deployment

Railway will automatically:
- Detect Node.js project
- Install dependencies with `npm ci`
- Start the server with `npm start`
- Provision PostgreSQL if added

### Required Environment Variables

Set these in Railway dashboard:

- `DATABASE_URL` - Auto-set when you add PostgreSQL service
- `JWT_SECRET` - Generate a secure random string
- `NODE_ENV=production`
- `FRONTEND_URL` - Your Netlify URL (e.g., https://your-app.netlify.app)
- `PORT=3000`

### Database Initialization

After deployment, initialize the database:

1. Go to Railway dashboard → Your PostgreSQL service
2. Connect to the database
3. Run the SQL from `schema.sql`

Or use Railway CLI:
```bash
railway run psql -f schema.sql
```

## 📡 API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/auth/verificar` - Verify JWT token
- `GET /api/productos` - List products
- `POST /api/productos` - Create product (admin only)
- `GET /api/pedidos` - List orders
- `POST /api/pedidos` - Create order

## 🔧 Configuration Files

- `railway.json` - Railway deployment configuration
- `nixpacks.toml` - Build configuration for Railway
- `.env.example` - Environment variables template

## 📝 Notes

- The server automatically configures SSL for PostgreSQL in production
- CORS is configured to accept requests from the frontend URL
- Rate limiting is enabled to prevent abuse
- All routes under `/api/` are rate-limited

For detailed deployment instructions, see [DEPLOYMENT.md](../DEPLOYMENT.md) in the root directory.
