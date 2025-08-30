import apiClient from './axiosConfig';
import type { Conselho } from './conselhoService';

export interface Equipamento {
  idequipamento: number;
  nome: string;
  descricao?: string;
  conselho: Conselho;
}

export interface EquipamentoPayload {
  nome: string;
  descricao?: string;
  conselho: { idconselho: number };
}

export const getEquipamentos = async (nome?: string): Promise<Equipamento[]> => {
  const params = nome ? { nome } : {};
  const response = await apiClient.get('/equipamentos', { params });
  return response.data;
};

export const getEquipamentoById = async (id: number): Promise<Equipamento> => {
  const response = await apiClient.get(`/equipamentos/${id}`);
  return response.data;
};

export const createEquipamento = async (payload: EquipamentoPayload): Promise<Equipamento> => {
  const response = await apiClient.post('/equipamentos', payload);
  return response.data;
};

export const updateEquipamento = async (id: number, payload: EquipamentoPayload): Promise<Equipamento> => {
  const response = await apiClient.put(`/equipamentos/${id}`, payload);
  return response.data;
};

export const deleteEquipamento = async (id: number): Promise<void> => {
  await apiClient.delete(`/equipamentos/${id}`);
};