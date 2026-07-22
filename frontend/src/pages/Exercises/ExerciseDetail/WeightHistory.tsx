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
import { useTranslation } from 'react-i18next'
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

export default function WeightHistory({
  entries,
  maxValue,
  metric,
  onEdit,
  onDelete,
}: WeightHistoryProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isReps = metric === 'reps'
  const { t } = useTranslation()

  if (entries.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{t('exerciseDetail.weightHistory.empty')}</Typography>
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
            <Card
              key={entry._id}
              onClick={() => onEdit(entry)}
              sx={{ cursor: 'pointer' }}
            >
              <CardContent sx={{ pb: '12px !important' }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Box display="flex" alignItems="baseline" gap={0.5} mb={0.5}>
                      <Typography variant="h6" fontWeight={700}>
                        {primaryValue ?? '—'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isReps
                          ? t('exerciseDetail.weightHistory.header.reps')
                          : t('dashboard.unit.kg')}
                      </Typography>
                      {isPR && (
                        <Chip
                          label={t('exerciseDetail.weightHistory.pr')}
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(entry.date)}
                      </Typography>
                      {isReps && entry.weight != null && (
                        <Typography variant="body2" color="text.secondary">
                          · {entry.weight} {t('dashboard.unit.kg')}
                        </Typography>
                      )}
                      {!isReps && entry.reps != null && (
                        <Typography variant="body2" color="text.secondary">
                          · {entry.reps}{' '}
                          {t('exerciseDetail.weightHistory.header.reps').toLowerCase()}
                        </Typography>
                      )}
                      {entry.sets != null && (
                        <Typography variant="body2" color="text.secondary">
                          · {entry.sets}{' '}
                          {t('exerciseDetail.weightHistory.header.sets').toLowerCase()}
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
                    <Tooltip title={t('common.edit')}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(entry)
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(entry._id)
                        }}
                      >
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
            <TableCell>{t('exerciseDetail.weightHistory.header.date')}</TableCell>
            {isReps ? (
              <TableCell align="right">{t('exerciseDetail.weightHistory.header.reps')}</TableCell>
            ) : (
              <TableCell align="right">{t('exerciseDetail.weightHistory.header.weight')}</TableCell>
            )}
            {!isReps && (
              <TableCell align="right">{t('exerciseDetail.weightHistory.header.reps')}</TableCell>
            )}
            <TableCell align="right">{t('exerciseDetail.weightHistory.header.sets')}</TableCell>
            <TableCell>{t('exerciseDetail.weightHistory.header.notes')}</TableCell>
            <TableCell align="center">{t('exerciseDetail.weightHistory.header.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => {
            const primaryValue = isReps ? entry.reps : entry.weight
            const isPR = primaryValue != null && primaryValue === maxValue
            return (
              <TableRow
                key={entry._id}
                hover
                onClick={() => onEdit(entry)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{formatDate(entry.date)}</TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                    <Typography fontWeight={isPR ? 700 : 400}>{primaryValue ?? '—'}</Typography>
                    {isPR && (
                      <Chip
                        label={t('exerciseDetail.weightHistory.pr')}
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>
                </TableCell>
                {!isReps && <TableCell align="right">{entry.reps ?? '—'}</TableCell>}
                <TableCell align="right">{entry.sets ?? '—'}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {entry.notes || '—'}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={t('common.edit')}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(entry)
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('common.delete')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(entry._id)
                      }}
                    >
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
