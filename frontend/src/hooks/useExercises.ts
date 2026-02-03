import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createExercise,
  deleteExercise,
  getAllExercisesForAnalytics,
  getExercise,
  getExercises,
  updateExercise,
} from '../api/exercises'
import type { CreateExerciseData, UpdateExerciseData } from '../types/exercise'

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

export function useAllExercisesForAnalytics() {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['exercises', 'analytics', 'all'],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return getAllExercisesForAnalytics(token)
    },
  })
}

export function useExercise(id: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['exercises', id],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return getExercise(id, token)
    },
    enabled: !!id,
  })
}

export function useCreateExercise() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateExerciseData) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return createExercise(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
}

export function useUpdateExercise() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExerciseData }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return updateExercise(id, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
}

export function useDeleteExercise() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return deleteExercise(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
}
