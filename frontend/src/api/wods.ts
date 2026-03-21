import type { AddWodResultData, CreateWodData, Wod } from '../types/wod'

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

export async function getWods(token: string): Promise<Wod[]> {
  return fetchWithAuth(`${API_URL}/api/wods`, {}, token)
}

export async function createWod(data: CreateWodData, token: string): Promise<Wod> {
  return fetchWithAuth(`${API_URL}/api/wods`, { method: 'POST', body: JSON.stringify(data) }, token)
}

export async function deleteWod(id: string, token: string): Promise<{ message: string }> {
  return fetchWithAuth(`${API_URL}/api/wods/${id}`, { method: 'DELETE' }, token)
}

export async function addWodResult(id: string, data: AddWodResultData, token: string): Promise<Wod> {
  return fetchWithAuth(`${API_URL}/api/wods/${id}/results`, { method: 'POST', body: JSON.stringify(data) }, token)
}

export async function deleteWodResult(wodId: string, resultId: string, token: string): Promise<Wod> {
  return fetchWithAuth(`${API_URL}/api/wods/${wodId}/results/${resultId}`, { method: 'DELETE' }, token)
}
