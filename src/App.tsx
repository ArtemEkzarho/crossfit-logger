import { Add } from '@mui/icons-material'
import { Container, Typography, Button, Box, Card, CardContent, AppBar, Toolbar } from '@mui/material'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Crossfit Logger
          </Typography>
          <Box>
            <SignedOut>
              <SignInButton mode="modal">
                <Button color="inherit" sx={{ mr: 1 }}>Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button color="inherit" variant="outlined">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Crossfit Logger
          </Typography>
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setCount((count) => count + 1)}
                size="large"
              >
                Count is {count}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  )
}

export default App
