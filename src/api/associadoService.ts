import apiClient from './axiosConfig';

export interface Associado {
  idassociado: number;
  cpf: string;
  nome: string;
  cdc?: string; 
  presidente_conselho: boolean;
  conselho: { idconselho: number, nome: string };
}

export interface AssociadoPayload {
  nome: string;
  cpf: string;
  cdc?: string;
  presidente_conselho: boolean;
  conselho: { idconselho: number };
}

export const getAssociados = async (): Promise<Associado[]> => {
  const response = await apiClient.get('/associados');
  return response.data;
};

export const getAssociadoById = async (id: number): Promise<Associado> => {
  const response = await apiClient.get(`/associados/${id}`);
  return response.data;
};

export const createAssociado = async (associado: AssociadoPayload): Promise<Associado> => {
  const response = await apiClient.post('/associados', associado);
  return response.data;
};

export const updateAssociado = async (id: number, associado: AssociadoPayload): Promise<Associado> => {
  const response = await apiClient.put(`/associados/${id}`, associado);
  return response.data;
};

export const deleteAssociado = async (id: number): Promise<void> => {
  await apiClient.delete(`/associados/${id}`);
};