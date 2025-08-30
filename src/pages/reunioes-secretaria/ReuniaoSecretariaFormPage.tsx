import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Checkbox, Container, Paper, TextField, Typography, List, ListItem, FormControlLabel, CircularProgress } from '@mui/material';
import { getReuniaoSecretariaById, createReuniaoSecretaria, updateReuniaoSecretaria } from '../../api/reuniaoSecretariaService';
import type { ReuniaoSecretariaPayload } from '../../api/reuniaoSecretariaService';

// Zod schema para o formulário completo, agora incluindo o 'id'
const reuniaoSecretariaSchema = z.object({
  data: z.string().min(1, 'A data é obrigatória'),
  pauta: z.string().min(3, 'A pauta é obrigatória'),
  presencas: z.array(z.object({
    id: z.object({
      idreuniao: z.number(),
      idconselho: z.number(),
    }),
    conselho: z.object({ 
        // Adicionamos os campos de conselho para consistência de tipo
        idconselho: z.number(),
        nome: z.string(),
        nro_membros: z.number().nullable(),
        presidente: z.string().nullable(),
    }),
    presente: z.boolean(),
  })).optional(),
});

// Tipo inferido a partir do schema para usar no useForm
type ReuniaoSecretariaFormData = z.infer<typeof reuniaoSecretariaSchema>;

export const ReuniaoSecretariaFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ReuniaoSecretariaFormData>({
    resolver: zodResolver(reuniaoSecretariaSchema),
    defaultValues: { data: '', pauta: '', presencas: [] },
  });

  const { fields, replace } = useFieldArray({ control, name: "presencas" });

  useEffect(() => {
    if (isEditMode) {
      getReuniaoSecretariaById(Number(id)).then(data => {
        // Zod é sensível a campos nulos, então garantimos que não sejam passados
        const presencasTratadas = data.presencas.map(p => ({
            ...p,
            conselho: {
                ...p.conselho,
                nro_membros: p.conselho.nro_membros ?? 0,
                presidente: p.conselho.presidente ?? ''
            }
        }));

        reset({
          ...data,
          data: data.data || '',
          presencas: presencasTratadas,
        });
        replace(presencasTratadas);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, navigate, reset, replace]);

  const onSubmit = async (formData: ReuniaoSecretariaFormData) => {
    // Transforma os dados do formulário para o payload da API
    const payload: ReuniaoSecretariaPayload = {
      data: formData.data,
      pauta: formData.pauta,
      presencas: formData.presencas?.map(p => ({
        id: p.id,
        presente: p.presente,
      })),
    };

    try {
      if (isEditMode) {
        await updateReuniaoSecretaria(Number(id), payload);
      } else {
        await createReuniaoSecretaria({
            data: payload.data,
            pauta: payload.pauta
        });
      }
      navigate('/reunioes-secretaria');
    } catch (error) {
      console.error('Falha ao salvar reunião:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{isEditMode ? 'Editar Reunião da Secretaria' : 'Nova Reunião da Secretaria'}</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Controller name="pauta" control={control} render={({ field }) => ( <TextField {...field} label="Pauta da Reunião" fullWidth required margin="normal" error={!!errors.pauta} helperText={errors.pauta?.message} multiline rows={4} /> )}/>
          <Controller name="data" control={control} render={({ field }) => ( <TextField {...field} label="Data da Reunião" type="date" fullWidth required margin="normal" InputLabelProps={{ shrink: true }} error={!!errors.data} helperText={errors.data?.message} /> )}/>

          {isEditMode && fields.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Lista de Presença (Presidentes de Conselho)</Typography>
              <List>
                {fields.map((item, index) => (
                  <ListItem key={item.id}>
                    <Controller name={`presencas.${index}.presente`} control={control} render={({ field }) => (
                        <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label={item.conselho.nome} />
                    )}/>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/reunioes-secretaria')} sx={{ mr: 1 }}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};