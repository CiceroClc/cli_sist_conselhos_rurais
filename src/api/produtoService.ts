import apiClient from './axiosConfig';

export interface Produto {
  idproduto: number;
  nome: string;
  descricao?: string;
}

export type ProdutoPayload = Omit<Produto, 'idproduto'>;

export const getProdutos = async (nome?: string): Promise<Produto[]> => {
  const params = nome ? { nome } : {};
  const response = await apiClient.get('/produtos', { params });
  return response.data;
};

export const getProdutoById = async (id: number): Promise<Produto> => {
  const response = await apiClient.get(`/produtos/${id}`);
  return response.data;
};

export const createProduto = async (payload: ProdutoPayload): Promise<Produto> => {
  const response = await apiClient.post('/produtos', payload);
  return response.data;
};

export const updateProduto = async (id: number, payload: ProdutoPayload): Promise<Produto> => {
  const response = await apiClient.put(`/produtos/${id}`, payload);
  return response.data;
};

export const deleteProduto = async (id: number): Promise<void> => {
  await apiClient.delete(`/produtos/${id}`);
};