import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const ForbiddenPage = () => {
  return (
    <Container>
      <Box
        sx={{
          py: 12,
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          minHeight: '60vh',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" paragraph>
          Acesso Negado
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Você não tem permissão para acessar esta página.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration_forbidden.svg" // Adicione uma imagem 403 em public/assets se desejar
          sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
        />

        <Button to="/" size="large" variant="contained" component={RouterLink}>
          Voltar para o Dashboard
        </Button>
      </Box>
    </Container>
  );
};