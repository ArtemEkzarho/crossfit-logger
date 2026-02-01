import { Add } from '@mui/icons-material'
import { Container, Typography, Button, Box, Card, CardContent, Grid } from '@mui/material'
import { useState } from 'react'

export default function Dashboard() {
  const [workoutCount, setWorkoutCount] = useState(0)

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome back! Here's your workout summary.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Workouts
                </Typography>
                <Typography variant="h4">{workoutCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  This Week
                </Typography>
                <Typography variant="h4">0</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  This Month
                </Typography>
                <Typography variant="h4">0</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setWorkoutCount((count) => count + 1)}
                size="large"
                sx={{ mt: 2 }}
              >
                Log Workout
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}
