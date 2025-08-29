import apiClient from './axiosConfig';
import type { Conselho } from './conselhoService';
import type { Associado } from './associadoService';

// Interface para a presença, baseada em PresencaReuniaoConselho.java
export interface PresencaReuniaoConselho {
  presente: boolean;
  associado: Associado;
}

// Interface baseada no modelo ReuniaoConselho.java
export interface ReuniaoConselho {
  idreuniao: number;
  data: string; // LocalDate é melhor tratado como string no formato 'YYYY-MM-DD'
  pauta: string;
  conselho: Conselho;
  presencas: PresencaReuniaoConselho[];
}

// Mapeado de @GetMapping | GET /reunioes/conselho
export const getReunioesConselho = async (): Promise<ReuniaoConselho[]> => {
  const response = await apiClient.get('/reunioes/conselho');
  return response.data;
};

// Mapeado de @PostMapping | POST /reunioes/conselho
export const createReuniaoConselho = async (reuniaoData: Omit<ReuniaoConselho, 'idreuniao'>): Promise<ReuniaoConselho> => {
  const response = await apiClient.post('/reunioes/conselho', reuniaoData);
  return response.data;
};