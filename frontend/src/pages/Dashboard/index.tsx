import { Box, Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AnalyticsChart from './AnalyticsChart'
import ChartFilters from './ChartFilters'

export default function Dashboard() {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.subtitle')}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <ChartFilters />
          <AnalyticsChart />
        </Box>
      </Box>
    </Container>
  )
}
