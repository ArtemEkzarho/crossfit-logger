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

- **Exercise Tracking** — Log weight entries (with reps, sets, notes) per exercise type; one document per exercise type per user with full weight history
- **Supported Exercises** — Deadlift, Power Clean, Bench Press
- **Personal Best** — Max weight across all entries is highlighted as the personal record (PR)
- **Exercise Detail Page** — Per-exercise view showing the PR prominently and the full weight history sorted by date; supports editing and deleting individual entries
- **Analytics Dashboard** — Max weight progression over time per user, filterable by exercise type
- **User Authentication** — Secure sign in/up via Clerk
- **User-scoped Data** — Each user sees only their own exercises

## Project Structure

```
crossfit-logger/
├── backend/
│   ├── src/
│   │   ├── server.ts               # Express app entry point
│   │   ├── models/
│   │   │   └── Exercise.ts         # MongoDB schema (weightHistory array)
│   │   └── routes/
│   │       └── exercises.ts        # REST API endpoints
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                # App entry with providers
│   │   ├── App.tsx                 # Route definitions
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Dashboard.tsx       # Analytics charts
│   │   │   └── Exercises/
│   │   │       ├── index.tsx               # Exercise list page
│   │   │       ├── ExerciseDetail.tsx      # Detail page orchestrator (state + handlers)
│   │   │       ├── ExerciseDetail/
│   │   │       │   ├── ExerciseDetailHeader.tsx  # Back button + name + PR display
│   │   │       │   ├── WeightHistory.tsx          # Responsive table/cards
│   │   │       │   ├── EditEntryDialog.tsx        # Edit weight entry dialog
│   │   │       │   └── DeleteEntryDialog.tsx      # Delete confirm dialog
│   │   │       ├── ExercisesTable.tsx      # Clickable exercise list
│   │   │       ├── ExerciseFormDialog.tsx  # Log weight dialog
│   │   │       └── DeleteConfirmDialog.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useExercises.ts     # React Query hooks
│   │   ├── api/
│   │   │   └── exercises.ts        # API client functions
│   │   └── types/
│   │       └── exercise.ts         # Shared types + getMaxWeight helper
│   └── package.json
│
└── pnpm-workspace.yaml
```

## Data Model

Each exercise is stored as a single document per type per user with an embedded `weightHistory` array:

```json
{
  "userId": "...",
  "name": "Deadlift",
  "weightHistory": [
    { "_id": "...", "weight": 120, "reps": 5, "sets": 3, "notes": "", "date": "2026-02-22" },
    { "_id": "...", "weight": 130, "reps": 3, "sets": 3, "notes": "PR!", "date": "2026-03-01" }
  ]
}
```

The personal best (max weight) is derived client-side from `weightHistory`.

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
VITE_API_URL=http://localhost:3001
```

### Installation

```bash
# Install dependencies
pnpm install

# Start backend (from backend/)
cd backend && pnpm dev

# Start frontend (from frontend/)
cd frontend && pnpm dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3001`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/exercises` | Get all exercises for the authenticated user |
| GET | `/api/exercises/:name` | Get a single exercise by name |
| POST | `/api/exercises` | Log weight — upserts by exercise name, appends to weightHistory |
| PUT | `/api/exercises/:name/entries/:entryId` | Update a single weight entry |
| DELETE | `/api/exercises/:name/entries/:entryId` | Delete a single weight entry |
| DELETE | `/api/exercises/:name` | Delete an entire exercise record |
| GET | `/api/exercises/analytics/all` | Get all users' exercises for analytics |

## Deployment

The app is configured for Railway deployment:

- **Frontend:** Uses nixpacks with `pnpm build` and `npx serve -s dist`
- **Backend:** Standard Node.js deployment with TypeScript compilation

## License

MIT
