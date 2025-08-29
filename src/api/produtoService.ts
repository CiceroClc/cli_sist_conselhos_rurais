import apiClient from './axiosConfig';

// Interface baseada no modelo Produto.java
export interface Produto {
  idproduto: number;
  nome: string;
  descricao?: string;
}

// Mapeado de @GetMapping | GET /produtos
export const getProdutos = async (): Promise<Produto[]> => {
  const response = await apiClient.get('/produtos');
  return response.data;
};

// Mapeado de @PostMapping | POST /produtos
export const createProduto = async (produtoData: Omit<Produto, 'idproduto'>): Promise<Produto> => {
  const response = await apiClient.post('/produtos', produtoData);
  return response.data;
};