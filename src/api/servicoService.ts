import apiClient from './axiosConfig';

export interface Servico {
  idservico: number;
  nome: string;
  descricao?: string;
}

export type ServicoPayload = Omit<Servico, 'idservico'>;

export const getServicos = async (nome?: string): Promise<Servico[]> => {
  const params = nome ? { nome } : {};
  const response = await apiClient.get('/servicos', { params });
  return response.data;
};

export const getServicoById = async (id: number): Promise<Servico> => {
  const response = await apiClient.get(`/servicos/${id}`);
  return response.data;
};

export const createServico = async (payload: ServicoPayload): Promise<Servico> => {
  const response = await apiClient.post('/servicos', payload);
  return response.data;
};

export const updateServico = async (id: number, payload: ServicoPayload): Promise<Servico> => {
  const response = await apiClient.put(`/servicos/${id}`, payload);
  return response.data;
};

export const deleteServico = async (id: number): Promise<void> => {
  await apiClient.delete(`/servicos/${id}`);
};