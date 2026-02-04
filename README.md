# Crossfit Logger

A full-stack web application for tracking CrossFit workouts, monitoring progress, and viewing analytics.

## Tech Stack

**Backend:**
- Node.js + Express.js 5
- TypeScript
- MongoDB with Mongoose
- Clerk for authentication

**Frontend:**
- React 19 + TypeScript
- Vite
- Material-UI (MUI)
- TanStack React Query
- Recharts for analytics
- Clerk for authentication

**Infrastructure:**
- pnpm monorepo
- Railway deployment
- Nixpacks containerization

## Features

- **Exercise Tracking** - Log workouts with weight, reps, sets, and notes
- **Supported Exercises** - Deadlift, Power Clean, Bench Press
- **Analytics Dashboard** - Visualize progress with charts:
  - Exercise frequency (bar chart)
  - Weight progression over time (line chart)
  - Volume trends (stacked area chart)
- **User Authentication** - Secure sign in/up via Clerk
- **User-scoped Data** - Each user sees only their exercises

## Project Structure

```
crossfit-logger/
├── backend/
│   ├── src/
│   │   ├── server.ts           # Express app entry point
│   │   ├── models/
│   │   │   └── Exercise.ts     # MongoDB schema
│   │   └── routes/
│   │       └── exercises.ts    # REST API endpoints
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx            # App entry with providers
│   │   ├── App.tsx             # Route definitions
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Landing page
│   │   │   ├── Dashboard.tsx   # Analytics charts
│   │   │   └── Exercises.tsx   # CRUD interface
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   └── package.json
│
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js >= 22.11.0
- pnpm
- MongoDB instance
- Clerk account

### Environment Variables

**Backend (`backend/.env.local`):**
```
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
FRONTEND_URL=http://localhost:5173
PORT=3001
```

**Frontend (`frontend/.env.local`):**
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Installation

```bash
# Install dependencies
pnpm install

# Start backend (from backend/)
cd backend
pnpm dev

# Start frontend (from frontend/)
cd frontend
pnpm dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3001`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/exercises` | Get user's exercises |
| GET | `/api/exercises/:id` | Get single exercise |
| POST | `/api/exercises` | Create exercise |
| PUT | `/api/exercises/:id` | Update exercise |
| DELETE | `/api/exercises/:id` | Delete exercise |
| GET | `/api/exercises/analytics/all` | Get all exercises for analytics |

## Deployment

The app is configured for Railway deployment:

- **Frontend:** Uses nixpacks with `pnpm build` and `npx serve -s dist`
- **Backend:** Standard Node.js deployment with TypeScript compilation

## License

MIT
