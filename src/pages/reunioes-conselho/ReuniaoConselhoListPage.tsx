import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReunioesConselho, deleteReuniaoConselho } from '../../api/reuniaoConselhoService';
import type { ReuniaoConselho } from '../../api/reuniaoConselhoService';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const ReuniaoConselhoListPage = () => {
  const [reunioes, setReunioes] = useState<ReuniaoConselho[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { getReunioesConselho(searchTerm).then(setReunioes) }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async () => {
    if (selectedId) {
      await deleteReuniaoConselho(selectedId);
      setOpenDeleteDialog(false);
      getReunioesConselho(searchTerm).then(setReunioes);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Reuniões dos Conselhos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/reunioes-conselho/novo')}>Nova Reunião</Button>
      </Box>
      <TextField fullWidth label="Buscar por Pauta" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 2 }} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Pauta</TableCell><TableCell>Data</TableCell><TableCell>Conselho</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
          <TableBody>
            {reunioes.map((item) => (
              <TableRow key={item.idreuniao}>
                <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.pauta}</TableCell>
                <TableCell>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                <TableCell>{item.conselho.nome}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => navigate(`/reunioes-conselho/editar/${item.idreuniao}`)}><EditIcon /></IconButton>
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