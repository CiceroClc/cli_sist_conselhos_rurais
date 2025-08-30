import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { getProdutoById, createProduto, updateProduto } from '../../api/produtoService';
import type { ProdutoPayload } from '../../api/produtoService';

const produtoSchema = z.object({
  nome: z.string().min(3, 'O nome é obrigatório'),
  descricao: z.string().optional(),
});

export const ProdutoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProdutoPayload>({
    resolver: zodResolver(produtoSchema),
    defaultValues: { nome: '', descricao: '' },
  });

  useEffect(() => {
    if (isEditMode) {
      getProdutoById(Number(id)).then(data => reset(data));
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data: ProdutoPayload) => {
    try {
      if (isEditMode) {
        await updateProduto(Number(id), data);
      } else {
        await createProduto(data);
      }
      navigate('/produtos');
    } catch (error) {
      console.error('Falha ao salvar produto:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{isEditMode ? 'Editar Produto' : 'Novo Produto'}</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <Controller name="nome" control={control} render={({ field }) => ( <TextField {...field} label="Nome do Produto" fullWidth required margin="normal" error={!!errors.nome} helperText={errors.nome?.message} /> )}/>
          <Controller name="descricao" control={control} render={({ field }) => ( <TextField {...field} label="Descrição" fullWidth margin="normal" multiline rows={3} /> )}/>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/produtos')} sx={{ mr: 1 }}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};