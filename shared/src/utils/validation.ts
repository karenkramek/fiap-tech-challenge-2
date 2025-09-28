import { TransactionType } from '../types/TransactionType';
import { ValidationRule, ValidationSchema } from '../types/global.types';

// Utility functions para validação
export class ValidationUtils {
  // Validações básicas
  static isRequired<T>(value: T): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value);
    return true;
  }

  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPositiveNumber(value: number): boolean {
    return typeof value === 'number' && !isNaN(value) && value > 0;
  }

  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isValidTransactionType(type: string): type is TransactionType {
    return Object.values(TransactionType).includes(type as TransactionType);
  }

  static minLength(min: number) {
    return (value: string): boolean => value.length >= min;
  }

  static maxLength(max: number) {
    return (value: string): boolean => value.length <= max;
  }

  static minValue(min: number) {
    return (value: number): boolean => value >= min;
  }

  static maxValue(max: number) {
    return (value: number): boolean => value <= max;
  }

  // Validações específicas para o domínio
  static isValidAmount(amount: number): boolean {
    return this.isPositiveNumber(amount) && amount <= 999999.99;
  }

  static isValidAccountName(name: string): boolean {
    return this.isRequired(name) && name.trim().length >= 2 && name.trim().length <= 100;
  }

  static isValidDescription(description?: string): boolean {
    if (!description) return true; // opcional
    return description.trim().length <= 500;
  }

  // Rules factory
  static createRules = {
    required: <T>(message = 'Campo obrigatório'): ValidationRule<T> => ({
      validate: ValidationUtils.isRequired,
      message
    }),

    email: (message = 'Email inválido'): ValidationRule<string> => ({
      validate: ValidationUtils.isEmail,
      message
    }),

    positiveNumber: (message = 'Deve ser um número positivo'): ValidationRule<number> => ({
      validate: ValidationUtils.isPositiveNumber,
      message
    }),

    validDate: (message = 'Data inválida'): ValidationRule<Date> => ({
      validate: ValidationUtils.isValidDate,
      message
    }),

    minLength: (min: number, message?: string): ValidationRule<string> => ({
      validate: ValidationUtils.minLength(min),
      message: message || `Deve ter pelo menos ${min} caracteres`
    }),

    maxLength: (max: number, message?: string): ValidationRule<string> => ({
      validate: ValidationUtils.maxLength(max),
      message: message || `Deve ter no máximo ${max} caracteres`
    }),

    validAmount: (message = 'Valor inválido'): ValidationRule<number> => ({
      validate: ValidationUtils.isValidAmount,
      message
    }),

    validAccountName: (message = 'Nome da conta inválido'): ValidationRule<string> => ({
      validate: ValidationUtils.isValidAccountName,
      message
    }),

    validDescription: (message = 'Descrição muito longa'): ValidationRule<string | undefined> => ({
      validate: ValidationUtils.isValidDescription,
      message
    })
  };
}

// Schemas de validação pré-definidos
export const ValidationSchemas = {
  transaction: {
    amount: [
      ValidationUtils.createRules.required('Valor é obrigatório'),
      ValidationUtils.createRules.validAmount('Valor deve ser positivo e no máximo R$ 999.999,99')
    ],
    type: [
      ValidationUtils.createRules.required('Tipo de transação é obrigatório')
    ],
    date: [
      ValidationUtils.createRules.required('Data é obrigatória'),
      ValidationUtils.createRules.validDate('Data deve ser válida')
    ],
    description: [
      ValidationUtils.createRules.validDescription('Descrição deve ter no máximo 500 caracteres')
    ]
  },

  account: {
    name: [
      ValidationUtils.createRules.required('Nome é obrigatório'),
      ValidationUtils.createRules.validAccountName('Nome deve ter entre 2 e 100 caracteres')
    ],
    balance: [
      ValidationUtils.createRules.required('Saldo é obrigatório'),
      ValidationUtils.createRules.positiveNumber('Saldo deve ser um número positivo')
    ]
  }
} satisfies {
  transaction: ValidationSchema<{
    amount: number;
    type: TransactionType;
    date: Date;
    description?: string;
  }>;
  account: ValidationSchema<{
    name: string;
    balance: number;
  }>;
};

// Função helper para validar um objeto
export function validateObject<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema<T>
): { isValid: boolean; errors: Record<keyof T, string> } {
  const errors = {} as Record<keyof T, string>;
  let isValid = true;

  for (const key in schema) {
    const rules = schema[key];
    if (!rules) continue;

    const value = data[key];

    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors[key] = rule.message;
        isValid = false;
        break; // Para na primeira regra que falha
      }
    }
  }

  return { isValid, errors };
}
