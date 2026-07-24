import { Add, ChevronRight } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { Exercise } from '../../types/exercise'
import { getExerciseMetric, getMaxValue } from '../../types/exercise'

interface ExercisesTableProps {
  exercises: Exercise[]
  onNavigate: (name: string) => void
  onCreate: () => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

export default function ExercisesTable({ exercises, onNavigate, onCreate }: ExercisesTableProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()

  if (exercises.length === 0) {
    return (
      <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('exercises.table.empty')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('exercises.table.emptyDesc')}
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={onCreate}>
          {t('exercises.table.logEntry')}
        </Button>
      </Paper>
    )
  }

  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ mt: 3 }}>
        {exercises.map((exercise) => {
          const maxValue = getMaxValue(exercise)
          const metric = getExerciseMetric(exercise.name)
          const lastEntry = exercise.weightHistory?.[exercise.weightHistory.length - 1]
          return (
            <Card key={exercise._id}>
              <CardActionArea onClick={() => onNavigate(exercise.name)}>
                <CardContent>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">{exercise.name}</Typography>
                      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 0.5 }}>
                        {maxValue != null && (
                          <Chip
                            label={`${maxValue} ${metric === 'reps' ? t('exerciseDetail.weightHistory.header.reps') : t('dashboard.unit.kg')}`}
                            size="small"
                            color="primary"
                          />
                        )}
                        {lastEntry && (
                          <Chip
                            label={formatDate(lastEntry.date)}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          label={`${exercise.weightHistory.length} ${t('exercises.table.header.entries').toLowerCase()}`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>
                    <ChevronRight color="action" />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        })}
      </Stack>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('exercises.table.header.exercise')}</TableCell>
            <TableCell align="right">{t('exercises.table.header.best')}</TableCell>
            <TableCell align="right">{t('exercises.table.header.entries')}</TableCell>
            <TableCell>{t('exercises.table.header.lastLogged')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {exercises.map((exercise) => {
            const maxValue = getMaxValue(exercise)
            const metric = getExerciseMetric(exercise.name)
            const lastEntry = exercise.weightHistory?.[exercise.weightHistory.length - 1]
            return (
              <TableRow
                key={exercise._id}
                hover
                onClick={() => onNavigate(exercise.name)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row">
                  <Typography sx={{ fontWeight: 500 }}>{exercise.name}</Typography>
                </TableCell>
                <TableCell align="right">
                  {maxValue != null ? (
                    <Typography color="primary" sx={{ fontWeight: 700 }}>
                      {maxValue}{' '}
                      {metric === 'reps'
                        ? t('exerciseDetail.weightHistory.header.reps')
                        : t('dashboard.unit.kg')}
                    </Typography>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell align="right">{exercise.weightHistory.length}</TableCell>
                <TableCell>{lastEntry ? formatDate(lastEntry.date) : '—'}</TableCell>
                <TableCell align="right">
                  <ChevronRight color="action" />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
