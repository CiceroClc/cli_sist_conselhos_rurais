import apiClient from './axiosConfig';

// Interfaces baseadas nos Records Java: LoginRequest.java e TokenResponse.java
export interface LoginRequest {
  login: string;
  senha?: string; // O nome do campo deve ser "senha" para bater com o backend
}

export interface TokenResponse {
  token: string;
}

export const loginUser = async (credentials: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

// Se você tiver uma tela de registro, pode adicionar a função aqui:
// export const registerUser = async (data: RegisterRequest) => { ... }