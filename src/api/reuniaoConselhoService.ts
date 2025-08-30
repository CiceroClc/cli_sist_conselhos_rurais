import apiClient from './axiosConfig';
import type { Conselho } from './conselhoService';
import type { Associado } from './associadoService';

// Tipo para a presença COMO VEM DA API
export interface PresencaReuniaoConselho {
  id: {
    idreuniao: number;
    idassociado: number;
  };
  associado: Associado;
  presente: boolean;
}

// Tipo para a presença COMO O FORMULÁRIO MANIPULA E ENVIA
export interface PresencaPayload {
  id: {
    idreuniao: number;
    idassociado: number;
  };
  presente: boolean;
  // O objeto 'associado' completo não é necessário para o envio do payload de atualização
}

// Tipo completo da reunião COMO VEM DA API
export interface ReuniaoConselho {
  idreuniao: number;
  data: string; // 'YYYY-MM-DD'
  pauta: string;
  conselho: Conselho;
  presencas: PresencaReuniaoConselho[];
}

// Tipo do payload COMO É ENVIADO PARA A API
export interface ReuniaoConselhoPayload {
  data: string;
  pauta: string;
  conselho: { idconselho: number };
  presencas?: PresencaPayload[]; // Usamos o tipo de payload aqui
}

// ... (resto do serviço: get, create, update, delete)
export const getReunioesConselho = async (pauta?: string): Promise<ReuniaoConselho[]> => {
  const params = pauta ? { pauta } : {};
  const response = await apiClient.get('/reunioes/conselho', { params });
  return response.data;
};

export const getReuniaoConselhoById = async (id: number): Promise<ReuniaoConselho> => {
  const response = await apiClient.get(`/reunioes/conselho/${id}`);
  return response.data;
};

export const createReuniaoConselho = async (payload: Omit<ReuniaoConselhoPayload, 'presencas'>): Promise<ReuniaoConselho> => {
  const response = await apiClient.post('/reunioes/conselho', payload);
  return response.data;
};

export const updateReuniaoConselho = async (id: number, payload: ReuniaoConselhoPayload): Promise<ReuniaoConselho> => {
  const response = await apiClient.put(`/reunioes/conselho/${id}`, payload);
  return response.data;
};

export const deleteReuniaoConselho = async (id: number): Promise<void> => {
  await apiClient.delete(`/reunioes/conselho/${id}`);
};