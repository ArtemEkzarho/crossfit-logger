import { SignInButton, SignUpButton, Show } from '@clerk/react'
import { FitnessCenter } from '@mui/icons-material'
import { Container, Typography, Box, Button, Card, CardContent, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppNavigation } from '../hooks/useAppNavigation'

export default function Home() {
  const { t } = useTranslation()
  const { goTo, localePath } = useAppNavigation()

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <FitnessCenter sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          {t('home.title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          {t('home.subtitle')}
        </Typography>

        <Show when="signed-out">
          <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
            <SignInButton mode="modal">
              <Button variant="contained" size="large">
                {t('auth.signIn')}
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="outlined" size="large">
                {t('auth.signUp')}
              </Button>
            </SignUpButton>
          </Stack>
        </Show>

        <Show when="signed-in">
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" size="large" onClick={() => goTo(localePath('/dashboard'))}>
              {t('home.goDashboard')}
            </Button>
          </Box>
        </Show>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom>
            {t('home.features')}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            sx={{ mt: 3, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Card sx={{ flex: '1 1 300px', maxWidth: 350 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('home.feature.trackWorkouts')}
                </Typography>
                <Typography color="text.secondary">
                  {t('home.feature.trackWorkoutsDesc')}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 300px', maxWidth: 350 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('home.feature.monitorProgress')}
                </Typography>
                <Typography color="text.secondary">
                  {t('home.feature.monitorProgressDesc')}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 300px', maxWidth: 350 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('home.feature.setGoals')}
                </Typography>
                <Typography color="text.secondary">{t('home.feature.setGoalsDesc')}</Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}
