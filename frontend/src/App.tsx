import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import LocaleWrapper from './components/LocaleWrapper'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Exercises = lazy(() => import('./pages/Exercises'))
const ExerciseDetail = lazy(() => import('./pages/Exercises/ExerciseDetail'))
const Timer = lazy(() => import('./pages/Timer'))
const Wods = lazy(() => import('./pages/Wods'))

function PageLoader() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/:locale" element={<LocaleWrapper />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="timer" element={<Timer />} />
              <Route
                path="wods"
                element={
                  <ProtectedRoute>
                    <Wods />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="exercises"
                element={
                  <ProtectedRoute>
                    <Exercises />
                  </ProtectedRoute>
                }
              />
              <Route
                path="exercises/:name"
                element={
                  <ProtectedRoute>
                    <ExerciseDetail />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
