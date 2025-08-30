import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getServicos, deleteServico } from '../../api/servicoService';
import type { Servico } from '../../api/servicoService';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const ServicosListPage = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { getServicos(searchTerm).then(setServicos) }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenDeleteDialog = (id: number) => { setSelectedId(id); setOpenDeleteDialog(true); };
  const handleCloseDeleteDialog = () => { setSelectedId(null); setOpenDeleteDialog(false); };
  
  const handleDelete = async () => {
    if (selectedId) {
      await deleteServico(selectedId);
      handleCloseDeleteDialog();
      getServicos(searchTerm).then(setServicos);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Gerenciar Serviços</Typography>
        {hasRole(['GESTOR']) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/servicos/novo')}>Novo Serviço</Button>
        )}
      </Box>

      <TextField fullWidth label="Buscar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 2 }} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Nome</TableCell><TableCell>Descrição</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
          <TableBody>
            {servicos.map((item) => (
              <TableRow key={item.idservico}>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell align="right">
                  {hasRole(['GESTOR']) && (
                    <>
                      <IconButton color="primary" onClick={() => navigate(`/servicos/editar/${item.idservico}`)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(item.idservico)}><DeleteIcon /></IconButton>
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
        <DialogContent><DialogContentText>Tem certeza que deseja excluir este serviço?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};