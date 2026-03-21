import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './locales/i18n.ts'
import { lightTheme } from './theme/lightTheme.ts'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
)
