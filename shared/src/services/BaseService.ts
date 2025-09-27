import { AxiosResponse } from 'axios';
import api from './api';
import { ApiError } from '../types/api.types';

// Classe base para serviços com métodos tipados
export abstract class BaseService {
  protected baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  protected async handleApiCall<T>(
    apiCall: () => Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await apiCall();
      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error; // TypeScript necessita do throw após handleApiError
    }
  }

  protected handleApiError(error: any): never {
    if (error.response) {
      // Erro da resposta do servidor
      const apiError: ApiError = {
        error: error.response.data?.error || 'Erro na API',
        message: error.response.data?.message || error.message,
        statusCode: error.response.status
      };
      throw new Error(`${apiError.statusCode}: ${apiError.message}`);
    } else if (error.request) {
      // Erro de rede
      throw new Error('Erro de conexão com o servidor');
    } else {
      // Outro tipo de erro
      throw new Error(error.message || 'Erro desconhecido');
    }
  }

  protected async get<T>(endpoint: string): Promise<T> {
    return this.handleApiCall(() => api.get<T>(`${this.baseURL}${endpoint}`));
  }

  protected async post<T, U = any>(endpoint: string, data?: U): Promise<T> {
    return this.handleApiCall(() => api.post<T>(`${this.baseURL}${endpoint}`, data));
  }

  protected async put<T, U = any>(endpoint: string, data?: U): Promise<T> {
    return this.handleApiCall(() => api.put<T>(`${this.baseURL}${endpoint}`, data));
  }

  protected async patch<T, U = any>(endpoint: string, data?: U): Promise<T> {
    return this.handleApiCall(() => api.patch<T>(`${this.baseURL}${endpoint}`, data));
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.handleApiCall(() => api.delete<T>(`${this.baseURL}${endpoint}`));
  }
}
