import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface DeleteEntryDialogProps {
  open: boolean
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteEntryDialog({
  open,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteEntryDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('exerciseDetail.deleteDialog.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('exerciseDetail.deleteDialog.confirm')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? t('common.deleting') : t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
