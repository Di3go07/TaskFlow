import { Box, Typography, Button, ThemeProvider } from '@mui/material';
import theme from '../theme/theme';

function Error({ codigo, subtitle, mensagem }) {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          bgcolor: 'background.main',
          px: 2,
        }}
      >
        <Typography variant="error404Title">-{codigo}-</Typography>

        <Typography variant="error404Subtitle">{subtitle}</Typography>

        <Typography variant="error404Text">{mensagem}</Typography>

        <Button variant="primary" href="/" sx={{fontWeight: 600, maxWidth: '300px', margin:'42px' }}> Voltar para Home </Button>
      </Box>
    </ThemeProvider>
  );
}

export default Error;