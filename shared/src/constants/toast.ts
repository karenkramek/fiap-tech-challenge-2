// Constantes de duração para toasts
export const TOAST_DURATION = {
  SHORT: 2000,   // 2 segundos
  NORMAL: 3000,  // 3 segundos
  LONG: 5000     // 5 segundos
} as const;

// Mensagens padrão para toasts
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  REGISTER_SUCCESS: 'Conta criada com sucesso!',
  REGISTER_ERROR: 'Erro ao criar conta. Tente novamente.',
  AUTH_REQUIRED: 'Por favor, faça login para acessar esta página.',
  TRANSACTION_SUCCESS: 'Transação adicionada com sucesso!',
  TRANSACTION_ERROR: 'Erro ao adicionar transação.',
  INVALID_AMOUNT: 'Por favor, insira um valor válido.'
} as const;
