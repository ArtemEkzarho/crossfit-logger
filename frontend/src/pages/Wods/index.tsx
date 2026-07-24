import { Add } from '@mui/icons-material'
import { Alert, Box, CircularProgress, Container, Fab, Snackbar, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAddWodResult, useCreateWod, useDeleteWod, useDeleteWodResult, useWods } from '../../api/hooks/useWods'
import type { AddWodResultData, CreateWodData, Wod } from '../../types/wod'
import DeleteWodDialog from './DeleteWodDialog'
import WodCard from './WodCard'
import WodFormDialog, { emptyWodForm, type WodFormData } from './WodFormDialog'
import WodResultDialog, { emptyResultForm, type ResultFormData } from './WodResultDialog'

export default function Wods() {
  const { t } = useTranslation()
  const { data: wods, isLoading, error } = useWods()
  const createWod = useCreateWod()
  const deleteWod = useDeleteWod()
  const addResult = useAddWodResult()
  const deleteResult = useDeleteWodResult()

  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<WodFormData>(emptyWodForm())
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [resultTarget, setResultTarget] = useState<Wod | null>(null)
  const [resultForm, setResultForm] = useState<ResultFormData>(emptyResultForm())
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  })

  const showSnack = (message: string, severity: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, message, severity })

  const handleSubmitWod = async () => {
    const data: CreateWodData = {
      date: formData.date,
      type: formData.type,
      name: formData.name || undefined,
      movements: formData.movements.filter((m) => m.name.trim()),
      notes: formData.notes || undefined,
    }
    try {
      await createWod.mutateAsync(data)
      showSnack(t('wods.successLogged'))
      setFormOpen(false)
    } catch (err) {
      showSnack(err instanceof Error ? err.message : 'An error occurred', 'error')
    }
  }

  const handleSubmitResult = async () => {
    if (!resultTarget) return
    const data: AddWodResultData = { rxd: resultForm.rxd, notes: resultForm.notes || undefined }

    if (resultTarget.type === 'forTime' && (resultForm.resultMinutes || resultForm.resultSeconds)) {
      data.timeSeconds =
        (Number(resultForm.resultMinutes) || 0) * 60 + (Number(resultForm.resultSeconds) || 0)
    }
    if ((resultTarget.type === 'amrap' || resultTarget.type === 'emom') && resultForm.resultRounds) {
      data.rounds = Number(resultForm.resultRounds)
    }
    if (resultTarget.type === 'amrap' && resultForm.resultReps) {
      data.reps = Number(resultForm.resultReps)
    }
    if (resultTarget.type === 'tabata' && resultForm.resultTotalReps) {
      data.totalReps = Number(resultForm.resultTotalReps)
    }

    try {
      await addResult.mutateAsync({ id: resultTarget._id, data })
      showSnack(t('wods.results.successAdded'))
      setResultTarget(null)
    } catch (err) {
      showSnack(err instanceof Error ? err.message : 'An error occurred', 'error')
    }
  }

  const handleDeleteWod = async () => {
    if (!deleteId) return
    try {
      await deleteWod.mutateAsync(deleteId)
      showSnack(t('wods.successDeleted'))
    } catch (err) {
      showSnack(err instanceof Error ? err.message : 'An error occurred', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  const handleDeleteResult = async (wodId: string, resultId: string) => {
    try {
      await deleteResult.mutateAsync({ wodId, resultId })
      showSnack(t('wods.results.successDeleted'))
    } catch (err) {
      showSnack(err instanceof Error ? err.message : 'An error occurred', 'error')
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            {t('wods.error', { message: error instanceof Error ? error.message : 'Unknown error' })}
          </Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('wods.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {t('wods.subtitle')}
        </Typography>

        {!wods?.length ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6">{t('wods.empty')}</Typography>
            <Typography variant="body2">{t('wods.emptyDesc')}</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {wods.map((wod) => (
              <WodCard
                key={wod._id}
                wod={wod}
                onDelete={setDeleteId}
                onAddResult={(w) => { setResultTarget(w); setResultForm(emptyResultForm()) }}
                onDeleteResult={handleDeleteResult}
              />
            ))}
          </Stack>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => { setFormData(emptyWodForm()); setFormOpen(true) }}
        >
          <Add />
        </Fab>

        <WodFormDialog
          open={formOpen}
          isSaving={createWod.isPending}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmitWod}
          onClose={() => setFormOpen(false)}
        />

        <WodResultDialog
          open={!!resultTarget}
          isSaving={addResult.isPending}
          wodType={resultTarget?.type ?? 'forTime'}
          formData={resultForm}
          onChange={setResultForm}
          onSubmit={handleSubmitResult}
          onClose={() => setResultTarget(null)}
        />

        <DeleteWodDialog
          open={!!deleteId}
          isDeleting={deleteWod.isPending}
          onConfirm={handleDeleteWod}
          onClose={() => setDeleteId(null)}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  )
}
