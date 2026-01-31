import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { FitnessCenter } from '@mui/icons-material'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <FitnessCenter sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Crossfit Logger
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SignedIn>
              <Button color="inherit" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button color="inherit">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button color="inherit" variant="outlined">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  )
}
