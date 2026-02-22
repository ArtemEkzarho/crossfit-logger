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
import type { WeightEntry } from '../../../types/exercise'

interface WeightHistoryProps {
  entries: WeightEntry[]
  maxWeight: number | undefined
  onEdit: (entry: WeightEntry) => void
  onDelete: (entryId: string) => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

export default function WeightHistory({ entries, maxWeight, onEdit, onDelete }: WeightHistoryProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (entries.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No entries yet. Log your first weight!</Typography>
      </Paper>
    )
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {entries.map((entry) => (
          <Card key={entry._id}>
            <CardContent sx={{ pb: '12px !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {entry.weight}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      kg
                    </Typography>
                    {entry.weight === maxWeight && (
                      <Chip label="PR" size="small" color="primary" sx={{ ml: 1 }} />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(entry.date)}
                    </Typography>
                    {entry.reps != null && (
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
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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
        ))}
      </Stack>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Weight (kg)</TableCell>
            <TableCell align="right">Reps</TableCell>
            <TableCell align="right">Sets</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry._id} hover>
              <TableCell>{formatDate(entry.date)}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  <Typography fontWeight={entry.weight === maxWeight ? 700 : 400}>
                    {entry.weight}
                  </Typography>
                  {entry.weight === maxWeight && (
                    <Chip label="PR" size="small" color="primary" />
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">{entry.reps ?? '—'}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
