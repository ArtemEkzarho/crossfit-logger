import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'

interface ExerciseDetailHeaderProps {
  name: string
  maxWeight: number | undefined
  onBack: () => void
  onLogWeight: () => void
}

export default function ExerciseDetailHeader({
  name,
  maxWeight,
  onBack,
  onLogWeight,
}: ExerciseDetailHeaderProps) {
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
          {maxWeight != null && (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
              <Typography variant="h2" color="primary" fontWeight={700}>
                {maxWeight}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                kg
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                personal best
              </Typography>
            </Box>
          )}
        </Box>
        <Button variant="contained" onClick={onLogWeight}>
          Log Weight
        </Button>
      </Box>
    </>
  )
}
