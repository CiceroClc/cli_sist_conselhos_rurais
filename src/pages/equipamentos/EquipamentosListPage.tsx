import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getEquipamentos, deleteEquipamento } from '../../api/equipamentoService';
import type { Equipamento } from '../../api/equipamentoService';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const EquipamentosListPage = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { getEquipamentos(searchTerm).then(setEquipamentos) }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenDeleteDialog = (id: number) => { setSelectedId(id); setOpenDeleteDialog(true); };
  const handleCloseDeleteDialog = () => { setSelectedId(null); setOpenDeleteDialog(false); };
  
  const handleDelete = async () => {
    if (selectedId) {
      await deleteEquipamento(selectedId);
      handleCloseDeleteDialog();
      getEquipamentos(searchTerm).then(setEquipamentos);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Gerenciar Equipamentos</Typography>
        {hasRole(['GESTOR', 'PRESIDENTE']) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/equipamentos/novo')}>Novo Equipamento</Button>
        )}
      </Box>

      <TextField fullWidth label="Buscar por Nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 2 }} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Conselho</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipamentos.map((item) => (
              <TableRow key={item.idequipamento}>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.conselho.nome}</TableCell>
                <TableCell align="right">
                  {hasRole(['GESTOR', 'PRESIDENTE']) && (
                    <>
                      <IconButton color="primary" onClick={() => navigate(`/equipamentos/editar/${item.idequipamento}`)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(item.idequipamento)}><DeleteIcon /></IconButton>
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
        <DialogContent><DialogContentText>Tem certeza que deseja excluir este equipamento?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};