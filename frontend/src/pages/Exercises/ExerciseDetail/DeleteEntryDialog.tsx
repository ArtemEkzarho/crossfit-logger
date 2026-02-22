import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

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
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Entry</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this weight entry?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
