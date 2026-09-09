import { SignInButton, SignUpButton, Show, useAuth } from '@clerk/react'
import { FitnessCenter } from '@mui/icons-material'
import { Container, Typography, Box, Button, Stack, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { useAppNavigation } from '../hooks/useAppNavigation'

export default function Home() {
  const { t } = useTranslation()
  const { localePath } = useAppNavigation()
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isSignedIn) {
    return <Navigate to={localePath('/exercises')} replace />
  }

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
      </Box>
    </Container>
  )
}
