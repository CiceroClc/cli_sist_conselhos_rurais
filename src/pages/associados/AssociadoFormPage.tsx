import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';

import { getAssociadoById, createAssociado, updateAssociado } from '../../api/associadoService';
import type { AssociadoPayload } from '../../api/associadoService';
import { getConselhos } from '../../api/conselhoService';
import type { Conselho } from '../../api/conselhoService';

// Esquema de validação com Zod
const associadoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().length(11, 'O CPF deve ter 11 dígitos'),
  cdc: z.string().optional(),
  presidente_conselho: z.boolean(),
  conselho: z.object({
    idconselho: z.number().min(1, 'Selecione um conselho'),
  }),
});

export const AssociadoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<AssociadoPayload>({
    resolver: zodResolver(associadoSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      cdc: '',
      presidente_conselho: false,
      conselho: { idconselho: 0 },
    },
  });

  useEffect(() => {
    // Carrega a lista de conselhos para o dropdown
    const fetchConselhos = async () => {
      try {
        const data = await getConselhos();
        setConselhos(data);
      } catch (error) {
        console.error("Falha ao buscar conselhos:", error);
      }
    };

    fetchConselhos();

    // Se estiver em modo de edição, busca os dados do associado
    if (isEditMode) {
      const fetchAssociado = async () => {
        try {
          const associadoData = await getAssociadoById(Number(id));
          reset(associadoData); // Popula o formulário com os dados
        } catch (error) {
          console.error("Falha ao buscar associado:", error);
          navigate('/associados'); // Redireciona se o associado não for encontrado
        }
      };
      fetchAssociado();
    }
  }, [id, isEditMode, navigate, reset]);

  const onSubmit = async (data: AssociadoPayload) => {
    try {
      if (isEditMode) {
        await updateAssociado(Number(id), data);
      } else {
        await createAssociado(data);
      }
      navigate('/associados'); // Redireciona para a lista após o sucesso
    } catch (error) {
      console.error('Falha ao salvar associado:', error);
      // Aqui você pode adicionar um feedback de erro para o usuário (ex: Snackbar)
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Editar Associado' : 'Novo Associado'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome Completo"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            )}
          />
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="CPF"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                error={!!errors.cpf}
                helperText={errors.cpf?.message}
              />
            )}
          />
          <Controller
            name="cdc"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="CDC"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="conselho.idconselho"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.conselho?.idconselho}>
                <InputLabel>Conselho</InputLabel>
                <Select
                  {...field}
                  label="Conselho"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value={0} disabled><em>Selecione um conselho</em></MenuItem>
                  {conselhos.map((conselho) => (
                    <MenuItem key={conselho.idconselho} value={conselho.idconselho}>
                      {conselho.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.conselho?.idconselho && <Typography color="error" variant="caption">{errors.conselho.idconselho.message}</Typography>}
              </FormControl>
            )}
          />
          <Controller
            name="presidente_conselho"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="É Presidente do Conselho?"
              />
            )}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/associados')} sx={{ mr: 1 }}>
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