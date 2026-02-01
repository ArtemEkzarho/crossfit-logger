import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material'
import { SignInButton, SignUpButton, SignedOut, SignedIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { FitnessCenter } from '@mui/icons-material'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <FitnessCenter sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Crossfit Logger
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Track your workouts, monitor your progress, and achieve your fitness goals.
        </Typography>

        <SignedOut>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <SignInButton mode="modal">
              <Button variant="contained" size="large">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="outlined" size="large">
                Sign Up
              </Button>
            </SignUpButton>
          </Box>
        </SignedOut>

        <SignedIn>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </Box>
        </SignedIn>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom>
            Features
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Card sx={{ flex: '1 1 300px', maxWidth: 350 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Track Workouts
                </Typography>
                <Typography color="text.secondary">
                  Log your CrossFit WODs, lifts, and cardio sessions with ease.
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 300px', maxWidth: 350 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monitor Progress
                </Typography>
                <Typography color="text.secondary">
                  View your improvement over time with charts and statistics.
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 300px', maxWidth: 350 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Set Goals
                </Typography>
                <Typography color="text.secondary">
                  Define and track your fitness goals to stay motivated.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
