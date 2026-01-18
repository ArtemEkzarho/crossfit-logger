import { Container, Typography, Box, Card, CardContent } from '@mui/material'
import { SignIn } from '@clerk/clerk-react'

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In to Your Account
        </Typography>
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/signup"
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
