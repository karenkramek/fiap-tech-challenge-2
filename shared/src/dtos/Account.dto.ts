export interface AccountDTO {
  readonly id: string;
  name: string;
  balance: number;
}

export interface CreateAccountDTO {
  name: string;
}

export interface UpdateAccountDTO {
  name?: string;
  balance?: number;
}

// Type guards para validação em runtime
export function isAccountDTO(obj: any): obj is AccountDTO {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.balance === 'number' &&
    obj.id.length > 0 &&
    obj.name.trim().length > 0 &&
    !isNaN(obj.balance)
  );
}

export function isCreateAccountDTO(obj: any): obj is CreateAccountDTO {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    obj.name.trim().length > 0
  );
}
