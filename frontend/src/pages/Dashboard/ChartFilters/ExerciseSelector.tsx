import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { EXERCISE_NAMES, getExerciseMetric } from '../../../types/exercise'
import { selectedExerciseAtom } from '../atoms'

export default function ExerciseSelector() {
  const { t } = useTranslation()
  const [selected, setSelected] = useAtom(selectedExerciseAtom)
  const metric = getExerciseMetric(selected)
  const label = metric === 'reps' ? t('dashboard.metricReps') : t('dashboard.metricWeight')

  return (
    <FormControl size="small" sx={{ minWidth: 220 }}>
      <InputLabel id="exercise-select-label">{label}</InputLabel>
      <Select
        labelId="exercise-select-label"
        value={selected}
        label={label}
        onChange={(e) => setSelected(e.target.value as (typeof EXERCISE_NAMES)[number])}
      >
        {EXERCISE_NAMES.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
