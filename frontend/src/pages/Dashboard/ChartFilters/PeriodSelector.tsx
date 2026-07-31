import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { periodAtom } from '../atoms'

export const PERIOD_OPTIONS = [7, 14, 30, 90, 180, 365] as const
export type Period = (typeof PERIOD_OPTIONS)[number]

export default function PeriodSelector() {
  const { t } = useTranslation()
  const [value, setValue] = useAtom(periodAtom)

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="period-select-label">{t('dashboard.period.label')}</InputLabel>
      <Select
        labelId="period-select-label"
        value={value}
        label={t('dashboard.period.label')}
        onChange={(e) => setValue(e.target.value as Period)}
      >
        {PERIOD_OPTIONS.map((days) => (
          <MenuItem key={days} value={days}>
            {t(`dashboard.period.${days}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
