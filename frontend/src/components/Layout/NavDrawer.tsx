import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react'
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
  Stack,
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
      <Box sx={{ width: 250 }} role="presentation">
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          <Show when="signed-in">
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center', justifyContent: 'center', py: 2, overflow: 'hidden', cursor: 'pointer' }}
              onClick={(e) => {
                const btn =
                  e.currentTarget.querySelector<HTMLButtonElement>('.cl-userButtonTrigger')
                btn?.click()
              }}
            >
              <Box sx={{ display: 'flex', pl: 2 }} onClick={(e) => e.stopPropagation()}>
                <UserButton />
              </Box>
              <Typography variant="subtitle1" noWrap>
                {user?.fullName ?? user?.firstName}
              </Typography>
            </Stack>
          </Show>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>

        <List>
          <Show when="signed-in">
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
          </Show>
          <ListItem disablePadding>
            <ListItemButton onClick={() => goTo(localePath('/timer'))}>
              <ListItemText primary={t('layout.nav.timer')} />
            </ListItemButton>
          </ListItem>
        </List>

        <Show when="signed-out">
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
        </Show>
      </Box>
    </Drawer>
  )
}
