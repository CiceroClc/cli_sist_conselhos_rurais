import apiClient from './axiosConfig';

// Interface para os dados RECEBIDOS do backend
export interface Conselho {
  idconselho: number;
  nome: string;
  nro_membros: number;
  presidente: string;
}

// Interface para os dados ENVIADOS para o backend (sem o ID)
export interface ConselhoPayload {
  nome: string;
  nro_membros: number;
  presidente: string;
}

// GET /conselhos ou /conselhos?nome=...
export const getConselhos = async (nome?: string): Promise<Conselho[]> => {
  const params = nome ? { nome } : {};
  const response = await apiClient.get('/conselhos', { params });
  return response.data;
};

// GET /conselhos/{id}
export const getConselhoById = async (id: number): Promise<Conselho> => {
  const response = await apiClient.get(`/conselhos/${id}`);
  return response.data;
};

// POST /conselhos
export const createConselho = async (conselho: ConselhoPayload): Promise<Conselho> => {
  const response = await apiClient.post('/conselhos', conselho);
  return response.data;
};

// PUT /conselhos/{id}
export const updateConselho = async (id: number, conselho: ConselhoPayload): Promise<Conselho> => {
  const response = await apiClient.put(`/conselhos/${id}`, conselho);
  return response.data;
};

// DELETE /conselhos/{id}
export const deleteConselho = async (id: number): Promise<void> => {
  await apiClient.delete(`/conselhos/${id}`);
};