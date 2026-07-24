import { useUser } from '@clerk/react'
import { AddCircleOutlined, Delete } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { Wod, WodResult } from '../../types/wod'
import { WOD_TYPE_COLORS, formatResult } from '../../types/wod'

interface WodCardProps {
  wod: Wod
  onDelete: (id: string) => void
  onAddResult: (wod: Wod) => void
  onDeleteResult: (wodId: string, resultId: string) => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatMovement(m: Wod['movements'][0]) {
  const parts: string[] = []
  if (m.reps) parts.push(`${m.reps}`)
  if (m.weight) parts.push(`@ ${m.weight} kg`)
  if (m.sets && m.sets > 1) parts.push(`× ${m.sets}`)
  return parts.length ? `${m.name} — ${parts.join(' ')}` : m.name
}

function ResultRow({
  result,
  wodType,
  currentUserId,
  onDeleteResult,
  wodId,
}: {
  result: WodResult
  wodType: Wod['type']
  currentUserId: string | undefined | null
  onDeleteResult: (wodId: string, resultId: string) => void
  wodId: string
}) {
  const { t } = useTranslation()
  const score = formatResult(wodType, result)
  const isOwn = result.userId === currentUserId

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>
        {result.userName}
      </Typography>
      {score && (
        <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
          {score}
        </Typography>
      )}
      {result.rxd && (
        <Chip label={t('wods.card.rxd')} size="small" variant="outlined" color="success" />
      )}
      {result.notes && (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          {result.notes}
        </Typography>
      )}
      {isOwn && (
        <Tooltip title={t('common.delete')}>
          <IconButton size="small" onClick={() => onDeleteResult(wodId, result._id)}>
            <Delete fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  )
}

export default function WodCard({ wod, onDelete, onAddResult, onDeleteResult }: WodCardProps) {
  const { t } = useTranslation()
  const { user } = useUser()
  const isCreator = wod.createdBy === user?.id

  return (
    <Card variant="outlined">
      <CardContent>
        {/* Header */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDate(wod.date)}
              </Typography>
              <Chip
                label={t(`wods.types.${wod.type}`)}
                color={WOD_TYPE_COLORS[wod.type]}
                size="small"
              />
            </Stack>
            {wod.name && (
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {wod.name}
              </Typography>
            )}
          </Box>
          {isCreator && (
            <Tooltip title={t('common.delete')}>
              <IconButton size="small" onClick={() => onDelete(wod._id)}>
                <Delete fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* Movements */}
        {wod.movements.filter((m) => m.name).length > 0 && (
          <Stack spacing={0.25} sx={{ my: 1 }}>
            {wod.movements
              .filter((m) => m.name)
              .map((m, i) => (
                <Typography key={i} variant="body2" color="text.secondary">
                  {formatMovement(m)}
                </Typography>
              ))}
          </Stack>
        )}

        {/* WOD notes */}
        {wod.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
            {wod.notes}
          </Typography>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Results */}
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="subtitle2">{t('wods.results.title')}</Typography>
          <Tooltip title={t('wods.results.add')}>
            <IconButton size="small" color="primary" onClick={() => onAddResult(wod)}>
              <AddCircleOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {wod.results.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('wods.results.empty')}
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {wod.results.map((r) => (
              <ResultRow
                key={r._id}
                result={r}
                wodType={wod.type}
                currentUserId={user?.id}
                onDeleteResult={onDeleteResult}
                wodId={wod._id}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
