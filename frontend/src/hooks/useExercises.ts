import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteExercise,
  deleteWeightEntry,
  getExerciseAnalytics,
  getExerciseByName,
  getExercises,
  logWeight,
  updateWeightEntry,
} from '../api/exercises'
import type { ExerciseName, LogWeightData, UpdateWeightEntryData } from '../types/exercise'

export function useExercises() {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return getExercises(token)
    },
  })
}

export function useExerciseAnalytics(name: ExerciseName, days: number) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['exercises', 'analytics', name, days],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return getExerciseAnalytics(name, token, days)
    },
    staleTime: 60 * 1000, // 1 minute — no refetch when switching back to a cached exercise
  })
}

export function useExercise(name: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['exercises', name],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return getExerciseByName(name, token)
    },
    enabled: !!name,
  })
}

export function useLogWeight() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LogWeightData) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return logWeight(data, token)
    },
    onSuccess: (exercise) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
      queryClient.setQueryData(['exercises', exercise.name], exercise)
    },
  })
}

export function useUpdateWeightEntry() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      entryId,
      data,
    }: {
      name: string
      entryId: string
      data: UpdateWeightEntryData
    }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return updateWeightEntry(name, entryId, data, token)
    },
    onSuccess: (exercise) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
      queryClient.setQueryData(['exercises', exercise.name], exercise)
    },
  })
}

export function useDeleteWeightEntry() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, entryId }: { name: string; entryId: string }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return deleteWeightEntry(name, entryId, token)
    },
    onSuccess: (exercise) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
      queryClient.setQueryData(['exercises', exercise.name], exercise)
    },
  })
}

export function useDeleteExercise() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return deleteExercise(name, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
}
