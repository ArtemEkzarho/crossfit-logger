import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface DeleteWodDialogProps {
  open: boolean
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteWodDialog({
  open,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteWodDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('wods.deleteDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('wods.deleteDialog.confirm')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" disabled={isDeleting}>
          {isDeleting ? t('common.deleting') : t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
