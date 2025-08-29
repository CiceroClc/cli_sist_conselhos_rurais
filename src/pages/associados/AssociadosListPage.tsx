import { useState, useEffect } from 'react';
import { getAssociados} from '../../api/associadoService';
import type { Associado } from '../../api/associadoService';
import { useAuth } from '../../hooks/useAuth';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Container, Typography } from '@mui/material';

export const AssociadosListPage = () => {
  const [associados, setAssociados] = useState<Associado[]>([]);
  const { hasRole } = useAuth();

  useEffect(() => {
    const fetchAssociados = async () => {
      try {
        const data = await getAssociados();
        setAssociados(data);
      } catch (error) {
        console.error("Falha ao buscar associados:", error);
      }
    };

    fetchAssociados();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Associados
      </Typography>

      {/* Botão de criar só aparece para GESTOR ou PRESIDENTE */}
      {hasRole(['GESTOR', 'PRESIDENTE']) && (
        <Button variant="contained" color="primary" style={{ marginBottom: 16 }}>
          Novo Associado
        </Button>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {associados.map((associado) => (
            <TableRow key={associado.idassociado}>
              <TableCell>{associado.nome}</TableCell>
              <TableCell>{associado.cpf}</TableCell>
              <TableCell>
                {/* Botões de editar/deletar com base no perfil */}
                {hasRole(['GESTOR', 'PRESIDENTE']) && <Button>Editar</Button>}
                {hasRole(['GESTOR']) && <Button color="secondary">Deletar</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};