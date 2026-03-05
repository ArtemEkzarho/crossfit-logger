import type { Exercise, LogWeightData, UpdateWeightEntryData } from '../types/exercise'

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

export async function getExerciseAnalytics(name: string, token: string, days: number): Promise<Exercise[]> {
  return fetchWithAuth(`${API_URL}/api/exercises/analytics/${encodeURIComponent(name)}?days=${days}`, {}, token)
}

export async function getExerciseByName(name: string, token: string): Promise<Exercise> {
  return fetchWithAuth(`${API_URL}/api/exercises/${encodeURIComponent(name)}`, {}, token)
}

export async function logWeight(data: LogWeightData, token: string): Promise<Exercise> {
  return fetchWithAuth(
    `${API_URL}/api/exercises`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  )
}

export async function updateWeightEntry(
  name: string,
  entryId: string,
  data: UpdateWeightEntryData,
  token: string
): Promise<Exercise> {
  return fetchWithAuth(
    `${API_URL}/api/exercises/${encodeURIComponent(name)}/entries/${entryId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  )
}

export async function deleteWeightEntry(
  name: string,
  entryId: string,
  token: string
): Promise<Exercise> {
  return fetchWithAuth(
    `${API_URL}/api/exercises/${encodeURIComponent(name)}/entries/${entryId}`,
    { method: 'DELETE' },
    token
  )
}

export async function deleteExercise(name: string, token: string): Promise<{ message: string }> {
  return fetchWithAuth(
    `${API_URL}/api/exercises/${encodeURIComponent(name)}`,
    { method: 'DELETE' },
    token
  )
}
