import { useAuth } from '@clerk/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AddWodResultData, CreateWodData } from '../../types/wod'
import { addWodResult, createWod, deleteWod, deleteWodResult, getWods } from '../wods'

export function useWods() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['wods'],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return getWods(token)
    },
  })
}

export function useCreateWod() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateWodData) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return createWod(data, token)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wods'] }),
  })
}

export function useDeleteWod() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return deleteWod(id, token)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wods'] }),
  })
}

export function useAddWodResult() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AddWodResultData }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return addWodResult(id, data, token)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wods'] }),
  })
}

export function useDeleteWodResult() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ wodId, resultId }: { wodId: string; resultId: string }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return deleteWodResult(wodId, resultId, token)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wods'] }),
  })
}
