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
- Jotai (atomic state management)
- Recharts for analytics
- react-i18next (English + Ukrainian)
- Clerk for authentication

**Infrastructure:**
- pnpm monorepo
- Railway deployment
- Nixpacks containerization

## Features

- **Exercise Tracking** — Log entries (weight + reps/sets/notes) per exercise; one document per exercise type per user with full history
- **Two Metric Types** — Weight exercises track max kg (PR); bodyweight exercises (Push Up, Pull Up) track max reps
- **Personal Best** — PR highlighted in the exercise detail view; a `%` button shows 50–90% breakdowns for warm-up planning
- **Exercise Detail Page** — Per-exercise view with PR display, full history sorted by date, inline edit and delete
- **Analytics Dashboard** — Max progression per user over time; lazy-loads per selected exercise (one request per tab, cached for 1 min); configurable period (7/14/30/90 days) with all-time PR fallback for inactive users
- **Crossfit Timer** — Four modes with audio alerts and a 5-second pre-start countdown (see below)
- **User Authentication** — Secure sign in/up via Clerk
- **User-scoped Data** — Each user sees only their own exercises; analytics shows all users
- **i18n** — English and Ukrainian; language switcher in the AppBar, persisted via localStorage

### Supported Exercises

| Exercise | Metric |
|----------|--------|
| Deadlift, Power Clean, Bench Press, Front Squat, Back Squat | Weight (kg) |
| Push Press, Strict Press, Overhead Squat, Power Snatch, Back Lunges | Weight (kg) |
| Push Up, Pull Up | Reps |

### Crossfit Timer

Public route (`/timer`) — no login required.

| Mode | Description |
|------|-------------|
| **AMRAP** | Countdown from a set duration; do as many rounds as possible |
| **EMOM** | Every Minute On the Minute; beeps at each new minute |
| **For Time** | Count-up stopwatch; stop manually when finished |
| **Tabata** | Configurable work/rest intervals × N rounds |

Audio cues via Web Audio API: beep at 3/2/1 seconds remaining, double beep on interval transitions, triple beep on completion. A 5-second "Get ready!" countdown plays before every mode starts.

## Project Structure

```
crossfit-logger/
├── backend/
│   ├── src/
│   │   ├── server.ts               # Express app entry point
│   │   ├── models/
│   │   │   └── Exercise.ts         # MongoDB schema (weightHistory array)
│   │   └── routes/
│   │       └── exercises/
│   │           ├── index.ts        # Router assembly
│   │           ├── analytics.ts    # GET /analytics/:name
│   │           ├── entries.ts      # PUT/DELETE /:name/entries/:entryId
│   │           ├── exercises.ts    # GET, POST, DELETE /:name
│   │           └── helpers.ts      # Clerk user name lookup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                # App entry with providers
│   │   ├── App.tsx                 # Route definitions
│   │   ├── i18n.ts                 # i18next setup (EN + UK)
│   │   ├── locales/
│   │   │   ├── en.json             # English strings
│   │   │   └── uk.json             # Ukrainian strings
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Dashboard/          # Per-exercise analytics charts
│   │   │   │   ├── index.tsx           # Page layout
│   │   │   │   ├── AnalyticsChart.tsx  # Chart (reads atoms + runs query)
│   │   │   │   ├── atoms.ts            # selectedExercise + period atoms
│   │   │   │   ├── buildChartData.ts   # Pure data transform
│   │   │   │   ├── userColors.ts       # 20-color palette
│   │   │   │   └── ChartFilters/
│   │   │   │       ├── index.tsx
│   │   │   │       ├── ExerciseSelector.tsx
│   │   │   │       └── PeriodSelector.tsx
│   │   │   ├── Timer/              # Crossfit timer (Jotai atoms)
│   │   │   │   ├── index.tsx           # Orchestrator (effects only)
│   │   │   │   ├── timerAtoms.ts       # All state, derived values, and actions
│   │   │   │   ├── timerAudio.ts       # Web Audio API beep utilities
│   │   │   │   ├── timerHelpers.ts     # fmt() helper
│   │   │   │   ├── TimerDisplay.tsx    # Clock display + sub-labels
│   │   │   │   ├── TimerConfig.tsx     # Mode-specific config fields
│   │   │   │   └── TimerControls.tsx   # Start/Pause/Reset buttons
│   │   │   └── Exercises/
│   │   │       ├── index.tsx               # Exercise list page
│   │   │       ├── ExerciseDetail.tsx      # Detail page orchestrator
│   │   │       ├── ExerciseDetail/
│   │   │       │   ├── ExerciseDetailHeader.tsx  # PR display + % calculator dialog
│   │   │       │   ├── WeightHistory.tsx          # Responsive table/cards
│   │   │       │   ├── EditEntryDialog.tsx        # Edit entry dialog
│   │   │       │   └── DeleteEntryDialog.tsx      # Delete confirm dialog
│   │   │       ├── ExercisesTable.tsx      # Clickable exercise list
│   │   │       ├── ExerciseFormDialog.tsx  # Log entry dialog
│   │   │       └── DeleteConfirmDialog.tsx
│   │   ├── components/
│   │   │   ├── Layout.tsx          # AppBar + drawer navigation
│   │   │   └── ProtectedRoute.tsx  # Clerk auth guard
│   │   ├── hooks/
│   │   │   └── useExercises.ts     # React Query hooks
│   │   ├── api/
│   │   │   └── exercises.ts        # API client functions
│   │   └── types/
│   │       └── exercise.ts         # Shared types, EXERCISE_DEFINITIONS, getMaxValue
│   └── package.json
│
└── pnpm-workspace.yaml
```

## Data Model

Each exercise is stored as one document per type per user with an embedded `weightHistory` array. `weight` is optional for reps-based exercises.

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

```json
{
  "userId": "...",
  "name": "Push Up",
  "weightHistory": [
    { "_id": "...", "reps": 30, "sets": 3, "date": "2026-02-22" }
  ]
}
```

The personal best is derived client-side via `getMaxValue()` — uses `weight` for kg exercises and `reps` for bodyweight exercises.

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
| GET | `/api/exercises/analytics/:name` | Get all users' entries for a specific exercise (`?days=N`, default 7) |
| GET | `/api/exercises/:name` | Get a single exercise by name for the authenticated user |
| POST | `/api/exercises` | Log entry — upserts by name, appends to weightHistory |
| PUT | `/api/exercises/:name/entries/:entryId` | Update a single weight entry |
| DELETE | `/api/exercises/:name/entries/:entryId` | Delete a single weight entry |
| DELETE | `/api/exercises/:name` | Delete an entire exercise record |

## Deployment

The app is configured for Railway deployment:

- **Frontend:** Uses nixpacks with `pnpm build` and `npx serve -s dist`
- **Backend:** Standard Node.js deployment with TypeScript compilation

## License

MIT
