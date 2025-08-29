import apiClient from './axiosConfig';
import type { Conselho } from './conselhoService'; // Supondo que você tenha um conselhoService

// Interface baseada no modelo Equipamento.java
export interface Equipamento {
  idequipamento: number;
  nome: string;
  descricao?: string;
  conselho: Conselho;
}

// Mapeado de @GetMapping | GET /equipamentos
export const getEquipamentos = async (): Promise<Equipamento[]> => {
  const response = await apiClient.get('/equipamentos');
  return response.data;
};

// Mapeado de @PostMapping | POST /equipamentos
// Usamos Omit para não enviar o 'idequipamento' na criação
export const createEquipamento = async (equipamentoData: Omit<Equipamento, 'idequipamento'>): Promise<Equipamento> => {
  const response = await apiClient.post('/equipamentos', equipamentoData);
  return response.data;
};