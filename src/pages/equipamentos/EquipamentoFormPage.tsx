import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { getEquipamentoById, createEquipamento, updateEquipamento } from '../../api/equipamentoService';
import type { EquipamentoPayload } from '../../api/equipamentoService';
import { getConselhos } from '../../api/conselhoService';
import type { Conselho } from '../../api/conselhoService';

const equipamentoSchema = z.object({
  nome: z.string().min(3, 'O nome é obrigatório'),
  descricao: z.string().optional(),
  conselho: z.object({
    idconselho: z.number().min(1, 'Selecione um conselho'),
  }),
});

export const EquipamentoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [loading, setLoading] = useState(true); // 1. Estado de carregamento
  const [error, setError] = useState<string | null>(null); // 2. Estado de erro

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EquipamentoPayload>({
    resolver: zodResolver(equipamentoSchema),
    defaultValues: { nome: '', descricao: '', conselho: { idconselho: 0 } },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Sempre precisamos da lista de conselhos
        const conselhosData = await getConselhos();
        setConselhos(conselhosData);

        // Se estiver em modo de edição, busca os dados do equipamento
        if (isEditMode) {
          const equipamentoData = await getEquipamentoById(Number(id));
          // 3. Transforma os dados da API para o formato do formulário
          reset({
            nome: equipamentoData.nome,
            descricao: equipamentoData.descricao,
            conselho: { idconselho: equipamentoData.conselho.idconselho }
          });
        }
      } catch (err) {
        console.error("Falha ao carregar dados:", err);
        setError("Não foi possível carregar os dados necessários para o formulário.");
      } finally {
        setLoading(false); // 4. Finaliza o carregamento
      }
    };

    fetchData();
  }, [id, isEditMode, navigate, reset]);

  const onSubmit = async (data: EquipamentoPayload) => {
    try {
      if (isEditMode) {
        await updateEquipamento(Number(id), data);
      } else {
        await createEquipamento(data);
      }
      navigate('/equipamentos');
    } catch (error) {
      console.error('Falha ao salvar equipamento:', error);
      setError('Ocorreu um erro ao salvar o equipamento.');
    }
  };

  // 5. Renderização condicional baseada nos estados de carregamento e erro
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{isEditMode ? 'Editar Equipamento' : 'Novo Equipamento'}</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <Controller name="nome" control={control} render={({ field }) => ( <TextField {...field} label="Nome do Equipamento" fullWidth required margin="normal" error={!!errors.nome} helperText={errors.nome?.message} /> )} />
          <Controller name="descricao" control={control} render={({ field }) => ( <TextField {...field} label="Descrição" fullWidth margin="normal" multiline rows={3} /> )} />
          <Controller name="conselho.idconselho" control={control} render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.conselho?.idconselho}>
                <InputLabel>Conselho Responsável</InputLabel>
                <Select {...field} label="Conselho Responsável" value={field.value || 0} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <MenuItem value={0} disabled><em>Selecione um conselho</em></MenuItem>
                  {conselhos.map((c) => ( <MenuItem key={c.idconselho} value={c.idconselho}>{c.nome}</MenuItem> ))}
                </Select>
                 {errors.conselho?.idconselho && <Typography color="error" variant="caption">{errors.conselho.idconselho.message}</Typography>}
              </FormControl>
            )}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/equipamentos')} sx={{ mr: 1 }}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};