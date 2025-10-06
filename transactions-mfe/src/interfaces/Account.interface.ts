export interface IAccount {
  readonly id: string;
  name: string;
  balance: number;
}

export interface ICreateAccount {
  name: string;
}

export interface IUpdateAccount {
  name?: string;
  balance?: number;
}

// Type guard para validação em runtime
export function isIAccount(obj: any): obj is IAccount {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.id.length > 0 &&
    typeof obj.name === 'string' &&
    obj.name.trim().length > 0 &&
    typeof obj.balance === 'number' &&
    !isNaN(obj.balance)
  );
}

// Para compatibilidade com código existente
export interface Account extends IAccount {}
