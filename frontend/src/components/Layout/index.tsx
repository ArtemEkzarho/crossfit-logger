import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavDrawer from './NavDrawer'
import TopBar from './TopBar'

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Stack sx={{ height: '100dvh' }}>
      <TopBar onMenuClick={() => setDrawerOpen(true)} />
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Stack>
  )
}
