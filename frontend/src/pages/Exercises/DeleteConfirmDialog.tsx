import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { Exercise } from '../../types/exercise'

interface DeleteConfirmDialogProps {
  open: boolean
  exercise: Exercise | null
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteConfirmDialog({
  open,
  exercise,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('exercises.deleteDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('exercises.deleteDialog.confirm', { name: exercise?.name })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? t('common.deleting') : t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
