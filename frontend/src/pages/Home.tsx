import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material'
import { SignInButton, SignUpButton, SignedOut, SignedIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { FitnessCenter } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Container maxWidth="md">
      <Box my={8} textAlign="center">
        <FitnessCenter sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          {t('home.title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t('home.subtitle')}
        </Typography>

        <SignedOut>
          <Box mt={4} display="flex" gap={2} justifyContent="center">
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
          </Box>
        </SignedOut>

        <SignedIn>
          <Box mt={4}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              {t('home.goDashboard')}
            </Button>
          </Box>
        </SignedIn>

        <Box mt={6}>
          <Typography variant="h4" gutterBottom>
            {t('home.features')}
          </Typography>
          <Box display="flex" gap={2} mt={3} flexWrap="wrap" justifyContent="center">
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
                <Typography color="text.secondary">
                  {t('home.feature.setGoalsDesc')}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
