import type { Exercise, CreateExerciseData, UpdateExerciseData } from '../types/exercise'

// In development, use empty string to go through Vite proxy
// In production, use VITE_API_URL
const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')

async function fetchWithAuth(url: string, options: RequestInit = {}, token: string) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

export async function getExercises(token: string): Promise<Exercise[]> {
  return fetchWithAuth(`${API_URL}/api/exercises`, {}, token)
}

export async function getAllExercisesForAnalytics(token: string): Promise<Exercise[]> {
  return fetchWithAuth(`${API_URL}/api/exercises/analytics/all`, {}, token)
}

export async function getExercise(id: string, token: string): Promise<Exercise> {
  return fetchWithAuth(`${API_URL}/api/exercises/${id}`, {}, token)
}

export async function createExercise(data: CreateExerciseData, token: string): Promise<Exercise> {
  return fetchWithAuth(
    `${API_URL}/api/exercises`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  )
}

export async function updateExercise(
  id: string,
  data: UpdateExerciseData,
  token: string
): Promise<Exercise> {
  return fetchWithAuth(
    `${API_URL}/api/exercises/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  )
}

export async function deleteExercise(id: string, token: string): Promise<{ message: string }> {
  return fetchWithAuth(
    `${API_URL}/api/exercises/${id}`,
    {
      method: 'DELETE',
    },
    token
  )
}
