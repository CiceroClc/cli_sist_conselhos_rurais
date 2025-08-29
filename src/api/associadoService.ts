import apiClient from './axiosConfig';

export interface Associado {
  idassociado: number;
  cpf: string;
  nome: string;
  cdc: string;
  presidente_conselho: boolean;
  // Adicionar outros campos conforme o modelo Associado.java
}

export const getAssociados = async (): Promise<Associado[]> => {
  const response = await apiClient.get('/associados');
  return response.data;
};
