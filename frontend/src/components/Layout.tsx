import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
  UserButton,
} from '@clerk/clerk-react'
import { Close, FitnessCenter, Menu as MenuIcon } from '@mui/icons-material'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useUser()

  const handleNavigate = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleNavigate('/')}
          >
            <FitnessCenter sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ textWrap: 'nowrap' }}>
              Crossfit Logger
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
            <SignedIn>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden', cursor: 'pointer' }}
                onClick={(e) => {
                  const btn = e.currentTarget.querySelector<HTMLButtonElement>('.cl-userButtonTrigger')
                  btn?.click()
                }}
              >
                <UserButton />
                <Typography variant="subtitle1" noWrap>{user?.fullName ?? user?.firstName}</Typography>
              </Box>
            </SignedIn>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <SignedIn>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigate('/dashboard')}>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigate('/exercises')}>
                  <ListItemText primary="Exercises" />
                </ListItemButton>
              </ListItem>
            </List>
          </SignedIn>
          <SignedOut>
            <List>
              <ListItem>
                <SignInButton mode="modal">
                  <Button fullWidth variant="contained">
                    Sign In
                  </Button>
                </SignInButton>
              </ListItem>
              <ListItem>
                <SignUpButton mode="modal">
                  <Button fullWidth variant="outlined">
                    Sign Up
                  </Button>
                </SignUpButton>
              </ListItem>
            </List>
          </SignedOut>
        </Box>
      </Drawer>
      <Outlet />
    </>
  )
}
