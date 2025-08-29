import apiClient from './axiosConfig';

// A interface deve espelhar o model `Conselho.java`
export interface Conselho {
  idconselho: number;
  nome: string;
  nro_membros: number;
  presidente: string;
}

// GET /conselhos - Mapeado do `ConselhoController.listar()`
export const getConselhos = async (): Promise<Conselho[]> => {
  const response = await apiClient.get('/conselhos');
  return response.data;
};

// POST /conselhos - Mapeado do `ConselhoController.criar()`
export const createConselho = async (conselhoData: Omit<Conselho, 'idconselho'>): Promise<Conselho> => {
  const response = await apiClient.post('/conselhos', conselhoData);
  return response.data;
};

// ... implementar getById, update, delete, se existirem no controller