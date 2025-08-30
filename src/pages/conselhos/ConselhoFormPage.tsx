import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { getConselhoById, createConselho, updateConselho } from '../../api/conselhoService';
import type { ConselhoPayload } from '../../api/conselhoService';

// Esquema de validação com Zod (CORRIGIDO)
// Validamos o campo como uma string que deve conter apenas números positivos.
const conselhoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  presidente: z.string().min(3, 'O nome do presidente é obrigatório'),
  nro_membros: z.string()
    .min(1, "O número de membros é obrigatório")
    .regex(/^[1-9]\d*$/, "Deve ser um número inteiro e positivo"),
});

// Criamos um tipo inferido a partir do schema para usar no useForm
type ConselhoFormData = z.infer<typeof conselhoSchema>;

export const ConselhoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Usamos o novo tipo ConselhoFormData no useForm
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ConselhoFormData>({
    resolver: zodResolver(conselhoSchema),
    defaultValues: {
      nome: '',
      presidente: '',
      nro_membros: '0', // O valor padrão agora é uma string
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchConselho = async () => {
        try {
          const data = await getConselhoById(Number(id));
          // Convertemos o número recebido para string para popular o formulário
          reset({
            ...data,
            nro_membros: String(data.nro_membros),
          });
        } catch (error) {
          console.error("Falha ao buscar conselho:", error);
          navigate('/conselhos');
        }
      };
      fetchConselho();
    }
  }, [id, isEditMode, navigate, reset]);

  // A função onSubmit agora recebe o tipo do formulário (com nro_membros como string)
  const onSubmit = async (formData: ConselhoFormData) => {
    
    // Convertemos os dados para o formato que a API espera (ConselhoPayload)
    const payload: ConselhoPayload = {
      ...formData,
      nro_membros: Number(formData.nro_membros), // Conversão explícita para número
    };

    try {
      if (isEditMode) {
        await updateConselho(Number(id), payload);
      } else {
        await createConselho(payload);
      }
      navigate('/conselhos');
    } catch (error) {
      console.error('Falha ao salvar conselho:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Editar Conselho' : 'Novo Conselho'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome do Conselho"
                fullWidth
                required
                margin="normal"
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            )}
          />
          <Controller
            name="presidente"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome do Presidente"
                fullWidth
                required
                margin="normal"
                error={!!errors.presidente}
                helperText={errors.presidente?.message}
              />
            )}
          />
          <Controller
            name="nro_membros"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número de Membros"
                type="number"
                fullWidth
                required
                margin="normal"
                error={!!errors.nro_membros}
                helperText={errors.nro_membros?.message}
              />
            )}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/conselhos')} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};