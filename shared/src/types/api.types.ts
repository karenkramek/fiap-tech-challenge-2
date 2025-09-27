// Tipos base para respostas de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para validação de dados
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiValidationError extends ApiError {
  validationErrors: ValidationError[];
}

// Tipos para upload de arquivos
export interface FileUploadResponse {
  fileName: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// Tipos para parâmetros de query
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Tipos de filtros para transações
export interface TransactionFilters extends QueryParams {
  startDate?: string;
  endDate?: string;
  type?: string;
  minAmount?: number;
  maxAmount?: number;
}
