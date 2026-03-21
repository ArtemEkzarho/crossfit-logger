import { FitnessCenter, Menu as MenuIcon } from '@mui/icons-material'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppNavigation } from '../../hooks/useAppNavigation'
import { SUPPORTED_LOCALES } from '../../locales/i18n'

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { t, i18n } = useTranslation()
  const { localePath, goTo, switchLocale } = useAppNavigation()

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton color="inherit" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => goTo(localePath(''))}
        >
          <FitnessCenter sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ textWrap: 'nowrap' }}>
            {t('layout.appName')}
          </Typography>
        </Box>
        <Box display="flex" gap={0.5}>
          {SUPPORTED_LOCALES.map((lang) => (
            <Button
              key={lang}
              color="inherit"
              size="small"
              variant={i18n.language.startsWith(lang) ? 'outlined' : 'text'}
              onClick={() => switchLocale(lang)}
              sx={{ minWidth: 36, px: 0.5 }}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
