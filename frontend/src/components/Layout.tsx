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
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useUser()
  const { t, i18n } = useTranslation()

  const handleNavigate = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <Stack height="100dvh">
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleNavigate('/')}
          >
            <FitnessCenter sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ textWrap: 'nowrap' }}>
              {t('layout.appName')}
            </Typography>
          </Box>
          <Box display="flex" gap={0.5}>
            {(['en', 'uk'] as const).map((lang) => (
              <Button
                key={lang}
                color="inherit"
                size="small"
                variant={i18n.language.startsWith(lang) ? 'outlined' : 'text'}
                onClick={() => i18n.changeLanguage(lang)}
                sx={{ minWidth: 36, px: 0.5 }}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box width={250} role="presentation">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            pr={1}
          >
            <SignedIn>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="row"
                gap={1.5}
                py={2}
                overflow="hidden"
                sx={{ cursor: 'pointer' }}
                onClick={(e) => {
                  const btn =
                    e.currentTarget.querySelector<HTMLButtonElement>('.cl-userButtonTrigger')
                  btn?.click()
                }}
              >
                <Box display="flex" pl={2} onClick={(e) => e.stopPropagation()}>
                  <UserButton />
                </Box>
                <Typography variant="subtitle1" noWrap>
                  {user?.fullName ?? user?.firstName}
                </Typography>
              </Box>
            </SignedIn>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <List>
            <SignedIn>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigate('/dashboard')}>
                  <ListItemText primary={t('layout.nav.dashboard')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigate('/exercises')}>
                  <ListItemText primary={t('layout.nav.exercises')} />
                </ListItemButton>
              </ListItem>
            </SignedIn>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate('/timer')}>
                <ListItemText primary={t('layout.nav.timer')} />
              </ListItemButton>
            </ListItem>
          </List>

          <SignedOut>
            <List>
              <ListItem>
                <SignInButton mode="modal">
                  <Button fullWidth variant="contained">
                    {t('auth.signIn')}
                  </Button>
                </SignInButton>
              </ListItem>
              <ListItem>
                <SignUpButton mode="modal">
                  <Button fullWidth variant="outlined">
                    {t('auth.signUp')}
                  </Button>
                </SignUpButton>
              </ListItem>
            </List>
          </SignedOut>
        </Box>
      </Drawer>
      <Box flex={1} overflow="auto">
        <Outlet />
      </Box>
    </Stack>
  )
}
