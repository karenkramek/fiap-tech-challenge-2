// Tipos globais para o projeto

// Utility types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Tipos para formulários
export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Tipos para loading states
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Tipos para paginação
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Tipos para filtros
export interface BaseFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Tipos para status de componentes
export type ComponentStatus = 'idle' | 'loading' | 'success' | 'error';

// Tipos para variantes de UI
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'active';
export type Size = 'sm' | 'md' | 'lg';
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Tipos para eventos
export interface BaseEvent {
  id: string;
  timestamp: Date;
  type: string;
}

// Tipos para configuração
export interface AppConfig {
  apiBaseUrl: string;
  uploadUrl: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  version: string;
}

// Tipos para ambiente
export type Environment = 'development' | 'staging' | 'production';

// Tipos para autenticação (futuro)
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user' | 'readonly';

// Tipos para logs e debugging
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}

// Utility function types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;
export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;

// Tipos para validação
export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Export para compatibilidade com React event types
export type {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  DragEvent,
  FocusEvent
} from 'react';
