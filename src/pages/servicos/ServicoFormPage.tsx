import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { getServicoById, createServico, updateServico } from '../../api/servicoService';
import type { ServicoPayload } from '../../api/servicoService';

const servicoSchema = z.object({
  nome: z.string().min(3, 'O nome é obrigatório'),
  descricao: z.string().optional(),
});

export const ServicoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ServicoPayload>({
    resolver: zodResolver(servicoSchema),
    defaultValues: { nome: '', descricao: '' },
  });

  useEffect(() => {
    if (isEditMode) {
      getServicoById(Number(id)).then(data => reset(data));
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data: ServicoPayload) => {
    try {
      if (isEditMode) {
        await updateServico(Number(id), data);
      } else {
        await createServico(data);
      }
      navigate('/servicos');
    } catch (error) {
      console.error('Falha ao salvar serviço:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{isEditMode ? 'Editar Serviço' : 'Novo Serviço'}</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <Controller name="nome" control={control} render={({ field }) => ( <TextField {...field} label="Nome do Serviço" fullWidth required margin="normal" error={!!errors.nome} helperText={errors.nome?.message} /> )}/>
          <Controller name="descricao" control={control} render={({ field }) => ( <TextField {...field} label="Descrição" fullWidth margin="normal" multiline rows={3} /> )}/>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/servicos')} sx={{ mr: 1 }}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};