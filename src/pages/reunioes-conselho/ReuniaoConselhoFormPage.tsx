import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Checkbox, Container, Paper, TextField, Typography, FormControl, InputLabel, Select, MenuItem, List, ListItem, FormControlLabel, CircularProgress } from '@mui/material';
import { getReuniaoConselhoById, createReuniaoConselho, updateReuniaoConselho } from '../../api/reuniaoConselhoService';
import type { ReuniaoConselhoPayload } from '../../api/reuniaoConselhoService';
import type{ Conselho } from '../../api/conselhoService';
import { getConselhos} from '../../api/conselhoService';

// Zod schema para o formulário completo
const reuniaoConselhoSchema = z.object({
  data: z.string().min(1, 'A data é obrigatória'),
  pauta: z.string().min(3, 'A pauta é obrigatória'),
  conselho: z.object({ idconselho: z.number().min(1, 'Selecione um conselho') }),
  presencas: z.array(z.object({
    id: z.object({
        idreuniao: z.number(),
        idassociado: z.number(),
    }),
    associado: z.object({ 
        // Adicionamos todos os campos de Associado para consistência de tipo
        idassociado: z.number(),
        nome: z.string(),
        cpf: z.string(),
        cdc: z.string().nullable().optional(),
        presidente_conselho: z.boolean(),
        conselho: z.object({ idconselho: z.number(), nome: z.string() })
    }),
    presente: z.boolean(),
  })).optional(),
});

type ReuniaoConselhoFormData = z.infer<typeof reuniaoConselhoSchema>;

export const ReuniaoConselhoFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ReuniaoConselhoFormData>({
    resolver: zodResolver(reuniaoConselhoSchema),
    defaultValues: { data: '', pauta: '', conselho: { idconselho: 0 }, presencas: [] },
  });

  const { fields, replace } = useFieldArray({ control, name: "presencas" });

  useEffect(() => {
    getConselhos().then(setConselhos);
    if (isEditMode) {
      getReuniaoConselhoById(Number(id)).then(data => {
        // Zod é sensível a campos nulos, então garantimos que não sejam passados
        const presencasTratadas = data.presencas.map(p => ({
            ...p,
            associado: {
                ...p.associado,
                cdc: p.associado.cdc ?? '' // Trata cdc nulo
            }
        }));

        reset({
          ...data,
          data: data.data || '',
          presencas: presencasTratadas
        });
        replace(presencasTratadas);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, navigate, reset, replace]);

  const onSubmit = async (formData: ReuniaoConselhoFormData) => {
    // Transforma os dados do formulário para o payload da API
    const payload: ReuniaoConselhoPayload = {
        data: formData.data,
        pauta: formData.pauta,
        conselho: formData.conselho,
        presencas: formData.presencas?.map(p => ({
            id: p.id,
            presente: p.presente
        }))
    };
    
    try {
      if (isEditMode) {
        await updateReuniaoConselho(Number(id), payload);
      } else {
        // Para criar, não enviamos a lista de presença, o backend a gera
        await createReuniaoConselho({
            data: payload.data,
            pauta: payload.pauta,
            conselho: payload.conselho
        });
      }
      navigate('/reunioes-conselho');
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
        <Typography variant="h4" gutterBottom>{isEditMode ? 'Editar Reunião do Conselho' : 'Nova Reunião do Conselho'}</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Controller name="pauta" control={control} render={({ field }) => ( <TextField {...field} label="Pauta da Reunião" fullWidth required margin="normal" error={!!errors.pauta} helperText={errors.pauta?.message} multiline rows={4} /> )}/>
          <Controller name="data" control={control} render={({ field }) => ( <TextField {...field} label="Data da Reunião" type="date" fullWidth required margin="normal" InputLabelProps={{ shrink: true }} error={!!errors.data} helperText={errors.data?.message} /> )}/>
          <Controller name="conselho.idconselho" control={control} render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.conselho?.idconselho}>
              <InputLabel>Conselho</InputLabel>
              <Select {...field} label="Conselho" disabled={isEditMode} onChange={(e) => field.onChange(Number(e.target.value))}>
                {conselhos.map((c) => ( <MenuItem key={c.idconselho} value={c.idconselho}>{c.nome}</MenuItem> ))}
              </Select>
            </FormControl>
          )}/>

          {isEditMode && fields.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Lista de Presença</Typography>
              <List>
                {fields.map((item, index) => (
                  <ListItem key={item.id}>
                    <Controller name={`presencas.${index}.presente`} control={control} render={({ field }) => (
                        <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label={item.associado.nome} />
                    )}/>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/reunioes-conselho')} sx={{ mr: 1 }}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};