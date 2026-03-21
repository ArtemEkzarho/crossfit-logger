import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react'
import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppNavigation } from '../../hooks/useAppNavigation'

interface NavDrawerProps {
  open: boolean
  onClose: () => void
}

export default function NavDrawer({ open, onClose }: NavDrawerProps) {
  const { t } = useTranslation()
  const { user } = useUser()
  const { localePath, goTo } = useAppNavigation(onClose)

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box width={250} role="presentation">
        <Box display="flex" alignItems="center" justifyContent="space-between" pr={1}>
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
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <List>
          <SignedIn>
            <ListItem disablePadding>
              <ListItemButton onClick={() => goTo(localePath('/dashboard'))}>
                <ListItemText primary={t('layout.nav.dashboard')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => goTo(localePath('/exercises'))}>
                <ListItemText primary={t('layout.nav.exercises')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => goTo(localePath('/wods'))}>
                <ListItemText primary={t('layout.nav.wods')} />
              </ListItemButton>
            </ListItem>
          </SignedIn>
          <ListItem disablePadding>
            <ListItemButton onClick={() => goTo(localePath('/timer'))}>
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
  )
}
