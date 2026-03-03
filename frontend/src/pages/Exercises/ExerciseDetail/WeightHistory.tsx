import { Delete, Edit } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import type { ExerciseMetric, WeightEntry } from '../../../types/exercise'

interface WeightHistoryProps {
  entries: WeightEntry[]
  maxValue: number | undefined
  metric: ExerciseMetric
  onEdit: (entry: WeightEntry) => void
  onDelete: (entryId: string) => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

export default function WeightHistory({ entries, maxValue, metric, onEdit, onDelete }: WeightHistoryProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isReps = metric === 'reps'

  if (entries.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No entries yet. Log your first entry!</Typography>
      </Paper>
    )
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {entries.map((entry) => {
          const primaryValue = isReps ? entry.reps : entry.weight
          const isPR = primaryValue != null && primaryValue === maxValue
          return (
            <Card key={entry._id}>
              <CardContent sx={{ pb: '12px !important' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Box display="flex" alignItems="baseline" gap={0.5} mb={0.5}>
                      <Typography variant="h6" fontWeight={700}>
                        {primaryValue ?? '—'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isReps ? 'reps' : 'kg'}
                      </Typography>
                      {isPR && <Chip label="PR" size="small" color="primary" sx={{ ml: 1 }} />}
                    </Box>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(entry.date)}
                      </Typography>
                      {isReps && entry.weight != null && (
                        <Typography variant="body2" color="text.secondary">
                          · {entry.weight} kg
                        </Typography>
                      )}
                      {!isReps && entry.reps != null && (
                        <Typography variant="body2" color="text.secondary">
                          · {entry.reps} reps
                        </Typography>
                      )}
                      {entry.sets != null && (
                        <Typography variant="body2" color="text.secondary">
                          · {entry.sets} sets
                        </Typography>
                      )}
                    </Box>
                    {entry.notes && (
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {entry.notes}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit(entry)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDelete(entry._id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            {isReps ? (
              <TableCell align="right">Reps</TableCell>
            ) : (
              <TableCell align="right">Weight (kg)</TableCell>
            )}
            {!isReps && <TableCell align="right">Reps</TableCell>}
            <TableCell align="right">Sets</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => {
            const primaryValue = isReps ? entry.reps : entry.weight
            const isPR = primaryValue != null && primaryValue === maxValue
            return (
              <TableRow key={entry._id} hover>
                <TableCell>{formatDate(entry.date)}</TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                    <Typography fontWeight={isPR ? 700 : 400}>
                      {primaryValue ?? '—'}
                    </Typography>
                    {isPR && <Chip label="PR" size="small" color="primary" />}
                  </Box>
                </TableCell>
                {!isReps && <TableCell align="right">{entry.reps ?? '—'}</TableCell>}
                <TableCell align="right">{entry.sets ?? '—'}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {entry.notes || '—'}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(entry)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => onDelete(entry._id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
