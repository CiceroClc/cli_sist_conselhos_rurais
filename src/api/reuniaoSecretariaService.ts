import apiClient from './axiosConfig';
import type { Conselho } from './conselhoService';

// Interface para a presença, baseada em PresencaReuniaoSecretaria.java
export interface PresencaReuniaoSecretaria {
    presente: boolean;
    conselho: Conselho;
}

// Interface baseada no modelo ReuniaoSecretaria.java
export interface ReuniaoSecretaria {
  idreuniao: number;
  data: string; // LocalDate é melhor tratado como string no formato 'YYYY-MM-DD'
  pauta: string;
  presencas: PresencaReuniaoSecretaria[];
}

// Mapeado de @GetMapping | GET /reunioes/secretaria
export const getReunioesSecretaria = async (): Promise<ReuniaoSecretaria[]> => {
  const response = await apiClient.get('/reunioes/secretaria');
  return response.data;
};

// Mapeado de @PostMapping | POST /reunioes/secretaria
export const createReuniaoSecretaria = async (reuniaoData: Omit<ReuniaoSecretaria, 'idreuniao'>): Promise<ReuniaoSecretaria> => {
  const response = await apiClient.post('/reunioes/secretaria', reuniaoData);
  return response.data;
};