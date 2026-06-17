# Development Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.10+ (for backend development)

### 1. Start the local stack

```bash
docker compose up --build
```

This will start:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

Database migrations run automatically on API startup.

### 2. Create a user

#### Option A: Use the dev seed endpoint (fastest)

```bash
curl -X POST http://localhost:8000/dev/seed
```

Returns an auth response with credentials:
- Email: `demo@example.com`
- Password: `password`

#### Option B: Register manually in the UI

1. Open http://localhost:5173
2. Click "Register"
3. Fill in:
   - Full Name: Your Name
   - Workspace Name: My Workspace
   - Email: your@email.com
   - Password: securepassword

### 3. Log in

1. Go to http://localhost:5173/login
2. Enter credentials
3. You'll be redirected to the Dashboard

## Frontend Development

### Environment Variables

Create a `.env.local` file in `applications/frontend/` to override defaults:

```env
VITE_API_URL=http://localhost:8000
```

If not set, defaults to `http://localhost:8000`.

### Development server

```bash
cd applications/frontend
npm install
npm run dev
```

Opens at http://localhost:5173 with HMR enabled.

### Build

```bash
cd applications/frontend
npm run build
```

Output is in `dist/`.

### Lint

```bash
cd applications/frontend
npm run lint
```

## Backend Development

### Environment Variables

The API Gateway reads from environment variables (defaults are in `src/core/config.py`):

```env
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=contactcenter
DATABASE_USER=admin
DATABASE_PASSWORD=admin123
REDIS_HOST=redis
REDIS_PORT=6379
AUTH_SECRET_KEY=local-development-secret-change-before-production
```

### Local setup (without Docker)

```bash
cd applications/api-gateway

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start the API
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

Requires PostgreSQL and Redis running locally.

### View API docs

Once running, open http://localhost:8000/docs

## API Endpoints

### Auth

- `POST /auth/register` — Create account
- `POST /auth/login` — Sign in
- `GET /auth/me` — Get current user (requires token)
- `POST /dev/seed` — Create demo user (local only)

### Projects

- `GET /projects` — List user's projects
- `POST /projects` — Create project
- `GET /projects/{id}` — Get project
- `PUT /projects/{id}` — Update project
- `DELETE /projects/{id}` — Delete project

### Dashboard

- `GET /dashboard/summary` — Dashboard metrics

### System

- `GET /health` — Health check (DB, Redis status)

## Architecture

```
Frontend (React + TypeScript)
    ↓ (HTTP + JWT Bearer tokens)
API Gateway (FastAPI)
    ↓
    ├── PostgreSQL (Projects, Users, Tenants)
    └── Redis (Dashboard cache, session data)
```

Each user belongs to a **Tenant**. Projects are scoped to tenants for multi-workspace support.

## Database Migrations

Migrations are in `applications/api-gateway/alembic/versions/`.

### Create a new migration

```bash
cd applications/api-gateway
alembic revision --autogenerate -m "description of changes"
```

### Run migrations

```bash
alembic upgrade head
```

Migrations run automatically when the API container starts.

## Testing

Frontend unit tests coming soon.

Backend tests:

```bash
cd applications/api-gateway
pytest
```

## Troubleshooting

### Port already in use

- Frontend (5173): `lsof -i :5173` and kill the process
- API (8000): `lsof -i :8000` and kill the process
- PostgreSQL (5432): Change `DATABASE_PORT` in env
- Redis (6379): Change `REDIS_PORT` in env

### CORS errors

Frontend and API must be on compatible origins. Check `applications/api-gateway/src/main.py` for `allow_origins`.

### API not responding

1. Check logs: `docker compose logs api-gateway`
2. Verify Docker is running: `docker ps`
3. Check database: `docker compose logs postgres`
4. Ping health: `curl http://localhost:8000/health`

### Token expired

Tokens expire after 8 hours. Log out and back in to refresh.

## Next Steps

- Add project detail pages with SIP/recording modules
- Implement upload pipeline
- Connect AI analysis endpoints
- Add reporting module
- Set up Kubernetes deployment
- Deploy to AWS
