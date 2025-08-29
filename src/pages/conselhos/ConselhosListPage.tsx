import { useState, useEffect } from 'react';
import { getConselhos } from '../../api/conselhoService';
import type { Conselho } from '../../api/conselhoService';
import { useAuth } from '../../hooks/useAuth';
import { Button, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const ConselhosListPage = () => {
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const { hasRole } = useAuth();

  useEffect(() => {
    const fetchConselhos = async () => {
      try {
        const data = await getConselhos();
        setConselhos(data);
      } catch (error) {
        console.error("Falha ao buscar conselhos:", error);
        // Adicionar tratamento de erro para o usuário (ex: snackbar)
      }
    };
    fetchConselhos();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Conselhos Comunitários
      </Typography>

      {/* O backend em SecurityConfig.java só permite GESTOR e PRESIDENTE em /conselhos */}
      {/* Portanto, a UI deve refletir isso */}
      {hasRole(['GESTOR']) && (
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          Novo Conselho
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome do Conselho</TableCell>
              <TableCell>Presidente</TableCell>
              <TableCell>Nº de Membros</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conselhos.map((conselho) => (
              <TableRow key={conselho.idconselho}>
                <TableCell>{conselho.nome}</TableCell>
                <TableCell>{conselho.presidente}</TableCell>
                <TableCell>{conselho.nro_membros}</TableCell>
                <TableCell align="right">
                  {hasRole(['GESTOR']) && <Button size="small">Editar</Button>}
                  {hasRole(['GESTOR']) && <Button size="small" color="secondary">Deletar</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};