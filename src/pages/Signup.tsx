import { Container, Typography, Box, Card, CardContent } from '@mui/material'
import { SignUp } from '@clerk/clerk-react'

export default function Signup() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your Account
        </Typography>
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <SignUp
              routing="path"
              path="/signup"
              signInUrl="/login"
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
