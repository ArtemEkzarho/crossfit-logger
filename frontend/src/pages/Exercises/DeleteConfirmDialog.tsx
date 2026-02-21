import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
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
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Exercise</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete "{exercise?.name}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
