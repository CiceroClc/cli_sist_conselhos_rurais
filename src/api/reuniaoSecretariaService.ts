import apiClient from './axiosConfig';
import type { Conselho } from './conselhoService';

// Tipo para a presença COMO VEM DA API
export interface PresencaReuniaoSecretaria {
  id: {
    idreuniao: number;
    idconselho: number;
  };
  conselho: Conselho;
  presente: boolean;
}

// Tipo para a presença COMO O FORMULÁRIO ENVIA
export interface PresencaSecretariaPayload {
  id: {
    idreuniao: number;
    idconselho: number;
  };
  presente: boolean;
}

// Tipo completo da reunião COMO VEM DA API
export interface ReuniaoSecretaria {
  idreuniao: number;
  data: string; // 'YYYY-MM-DD'
  pauta: string;
  presencas: PresencaReuniaoSecretaria[];
}

// Tipo do payload COMO É ENVIADO PARA A API
export interface ReuniaoSecretariaPayload {
  data: string;
  pauta: string;
  presencas?: PresencaSecretariaPayload[];
}

export const getReunioesSecretaria = async (pauta?: string): Promise<ReuniaoSecretaria[]> => {
    const params = pauta ? { pauta } : {};
    const response = await apiClient.get('/reunioes/secretaria', { params });
    return response.data;
};
  
export const getReuniaoSecretariaById = async (id: number): Promise<ReuniaoSecretaria> => {
    const response = await apiClient.get(`/reunioes/secretaria/${id}`);
    return response.data;
};
  
export const createReuniaoSecretaria = async (payload: Omit<ReuniaoSecretariaPayload, 'presencas'>): Promise<ReuniaoSecretaria> => {
    const response = await apiClient.post('/reunioes/secretaria', payload);
    return response.data;
};
  
export const updateReuniaoSecretaria = async (id: number, payload: ReuniaoSecretariaPayload): Promise<ReuniaoSecretaria> => {
    const response = await apiClient.put(`/reunioes/secretaria/${id}`, payload);
    return response.data;
};
  
export const deleteReuniaoSecretaria = async (id: number): Promise<void> => {
    await apiClient.delete(`/reunioes/secretaria/${id}`);
};