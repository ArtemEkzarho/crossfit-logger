import { Add } from '@mui/icons-material'
import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Crossfit Logger
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
  )
}

export default App
