import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LocaleWrapper from './components/LocaleWrapper'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Exercises from './pages/Exercises'
import ExerciseDetail from './pages/Exercises/ExerciseDetail'
import Timer from './pages/Timer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:locale" element={<LocaleWrapper />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="timer" element={<Timer />} />
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
    </BrowserRouter>
  )
}

export default App
