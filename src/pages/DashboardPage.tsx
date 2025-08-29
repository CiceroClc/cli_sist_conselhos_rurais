import { Container, Typography, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">
          Bem-vindo, {user?.sub || 'Usuário'}!
        </Typography>
        <Typography color="text.secondary">
          Seu perfil de acesso é: <strong>{user?.role}</strong>
        </Typography>
      </Paper>
    </Container>
  );
};