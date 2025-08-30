import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAssociados, deleteAssociado } from '../../api/associadoService';
import type { Associado } from '../../api/associadoService';
import { 
  Box, Button, Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, TextField, Dialog, 
  DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const AssociadosListPage = () => {
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAssociadoId, setSelectedAssociadoId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const fetchAssociados = async () => {
    try {
      const data = await getAssociados();
      setAssociados(data);
    } catch (error) {
      console.error("Falha ao buscar associados:", error);
    }
  };

  useEffect(() => {
    fetchAssociados();
  }, []);

  const handleOpenDeleteDialog = (id: number) => {
    setSelectedAssociadoId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedAssociadoId(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (selectedAssociadoId) {
      try {
        await deleteAssociado(selectedAssociadoId);
        fetchAssociados(); // Recarrega a lista após a exclusão
      } catch (error) {
        console.error("Falha ao deletar associado:", error);
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };
  
  const filteredAssociados = useMemo(() => 
    associados.filter(associado => 
      associado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associado.cpf.includes(searchTerm)
    ), [associados, searchTerm]);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Gerenciar Associados
        </Typography>
        {hasRole(['GESTOR', 'PRESIDENTE']) && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/associados/novo')}
          >
            Novo Associado
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Buscar por Nome ou CPF"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Conselho</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssociados.map((associado) => (
              <TableRow key={associado.idassociado}>
                <TableCell>{associado.nome}</TableCell>
                <TableCell>{associado.cpf}</TableCell>
                <TableCell>{associado.conselho.nome}</TableCell>
                <TableCell align="right">
                  {hasRole(['GESTOR', 'PRESIDENTE']) && (
                    <IconButton color="primary" onClick={() => navigate(`/associados/editar/${associado.idassociado}`)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {hasRole(['GESTOR']) && (
                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(associado.idassociado)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir este associado? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};