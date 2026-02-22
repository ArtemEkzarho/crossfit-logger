import { ArrowBack, Percent } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import type { ExerciseMetric } from '../../../types/exercise'

const PERCENTAGES = [50, 60, 70, 80, 90]

interface ExerciseDetailHeaderProps {
  name: string
  maxValue: number | undefined
  metric: ExerciseMetric
  onBack: () => void
  onLogWeight: () => void
}

export default function ExerciseDetailHeader({
  name,
  maxValue,
  metric,
  onBack,
  onLogWeight,
}: ExerciseDetailHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const unit = metric === 'reps' ? 'reps' : 'kg'

  return (
    <>
      <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>
        Back to Exercises
      </Button>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            {name}
          </Typography>
          {maxValue != null && (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
              <Typography variant="h2" color="primary" fontWeight={700}>
                {maxValue}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                {unit}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                personal best
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title={maxValue == null ? 'No PR yet' : '% of PR'}>
            <span>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={maxValue == null}
                color="primary"
                sx={{ border: 1, borderColor: 'divider' }}
              >
                <Percent />
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="contained" onClick={onLogWeight}>
            Log Entry
          </Button>
        </Box>
      </Box>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, minWidth: 190 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            % of PR ({maxValue} {unit})
          </Typography>
          <List dense disablePadding sx={{ mt: 1 }}>
            {PERCENTAGES.map((pct) => {
              const value = parseFloat(((maxValue ?? 0) * pct / 100).toFixed(2))
              return (
                <ListItem key={pct} disablePadding sx={{ py: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {pct}%
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {value} {unit}
                    </Typography>
                  </Box>
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Popover>
    </>
  )
}
