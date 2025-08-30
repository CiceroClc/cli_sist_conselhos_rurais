import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getConselhos, deleteConselho } from '../../api/conselhoService';
import type { Conselho } from '../../api/conselhoService';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const ConselhosListPage = () => {
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const fetchConselhos = async () => {
    try {
      const data = await getConselhos(searchTerm);
      setConselhos(data);
    } catch (error) {
      console.error("Falha ao buscar conselhos:", error);
    }
  };

  useEffect(() => {
    // Busca inicial e busca ao digitar (com debounce)
    const delayDebounceFn = setTimeout(() => {
      fetchConselhos();
    }, 500); // Atraso de 500ms para evitar muitas requisições
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedId(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await deleteConselho(selectedId);
        fetchConselhos();
      } catch (error) {
        console.error("Falha ao deletar conselho:", error);
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Gerenciar Conselhos
        </Typography>
        {hasRole(['GESTOR']) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/conselhos/novo')}>
            Novo Conselho
          </Button>
        )}
      </Box>

      <TextField fullWidth label="Buscar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 2 }} />

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
                  {hasRole(['GESTOR']) && (
                    <>
                      <IconButton color="primary" onClick={() => navigate(`/conselhos/editar/${conselho.idconselho}`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(conselho.idconselho)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este conselho?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};