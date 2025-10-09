// Função helper para ler variáveis de ambiente de forma segura
const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    // @ts-ignore - process.env é injetado pelo Webpack
    return typeof process !== 'undefined' && process.env && process.env[key]
      ? process.env[key]
      : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Configurações do projeto
export const AppConfig = {
  // URLs dos serviços
  API_BASE_URL: getEnvVar('REACT_APP_API_BASE_URL', 'http://localhost:3034'),
  UPLOAD_SERVICE_URL: getEnvVar('REACT_APP_UPLOAD_URL', 'http://localhost:3035'),

  // Configurações de upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ] as const,

  // Configurações de API
  API_TIMEOUT: 30000, // 30 segundos
  API_RETRIES: 3,

  // Configurações de interface
  ITEMS_PER_PAGE: 10,
  CURRENCY: 'BRL',
  LOCALE: 'pt-BR',

  // Configurações de desenvolvimento
  isDevelopment: () => typeof window !== 'undefined' && window.location.hostname === 'localhost',
  isProduction: () => !AppConfig.isDevelopment()
} as const;

// Tipo para as configurações
export type AppConfigType = typeof AppConfig;

// Helper para obter URLs baseadas no ambiente
export const getApiUrl = (endpoint: string = ''): string => {
  return `${AppConfig.API_BASE_URL}${endpoint}`;
};

export const getUploadUrl = (endpoint: string = ''): string => {
  return `${AppConfig.UPLOAD_SERVICE_URL}${endpoint}`;
};

// Validações de configuração
export const validateConfig = (): boolean => {
  try {
    // Verifica se as URLs são válidas
    new URL(AppConfig.API_BASE_URL);
    new URL(AppConfig.UPLOAD_SERVICE_URL);

    // Verifica se as configurações numéricas são válidas
    if (AppConfig.MAX_FILE_SIZE <= 0) return false;
    if (AppConfig.API_TIMEOUT <= 0) return false;
    if (AppConfig.API_RETRIES < 0) return false;

    return true;
  } catch {
    return false;
  }
};
