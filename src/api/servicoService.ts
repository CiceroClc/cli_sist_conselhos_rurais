import apiClient from './axiosConfig';

// Interface baseada no modelo Servico.java
export interface Servico {
  idservico: number;
  nome: string;
  descricao?: string;
}

// Mapeado de @GetMapping | GET /servicos
export const getServicos = async (): Promise<Servico[]> => {
  const response = await apiClient.get('/servicos');
  return response.data;
};

// Mapeado de @PostMapping | POST /servicos
export const createServico = async (servicoData: Omit<Servico, 'idservico'>): Promise<Servico> => {
  const response = await apiClient.post('/servicos', servicoData);
  return response.data;
};