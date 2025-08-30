import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReunioesSecretaria, deleteReuniaoSecretaria } from '../../api/reuniaoSecretariaService';
import type { ReuniaoSecretaria } from '../../api/reuniaoSecretariaService';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const ReuniaoSecretariaListPage = () => {
  const [reunioes, setReunioes] = useState<ReuniaoSecretaria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { getReunioesSecretaria(searchTerm).then(setReunioes) }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async () => {
    if (selectedId) {
      await deleteReuniaoSecretaria(selectedId);
      setOpenDeleteDialog(false);
      getReunioesSecretaria(searchTerm).then(setReunioes);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Reuniões da Secretaria</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/reunioes-secretaria/novo')}>Nova Reunião</Button>
      </Box>
      <TextField fullWidth label="Buscar por Pauta" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 2 }} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Pauta</TableCell><TableCell>Data</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
          <TableBody>
            {reunioes.map((item) => (
              <TableRow key={item.idreuniao}>
                <TableCell sx={{ maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.pauta}</TableCell>
                <TableCell>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => navigate(`/reunioes-secretaria/editar/${item.idreuniao}`)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => { setSelectedId(item.idreuniao); setOpenDeleteDialog(true); }}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent><Typography>Tem certeza que deseja excluir esta reunião?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};