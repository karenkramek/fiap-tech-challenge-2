import { BaseService } from './BaseService';
import { Account } from '../models/Account';
import { AccountDTO, CreateAccountDTO, UpdateAccountDTO, isAccountDTO } from '../dtos/Account.dto';

export class AccountService extends BaseService {
  constructor() {
    super('');
  }

  static async getAccount(): Promise<Account> {
    const service = new AccountService();
    const accountData = await service.get<AccountDTO>('/account');

    if (!isAccountDTO(accountData)) {
      throw new Error('Dados da conta inválidos recebidos da API');
    }

    return Account.fromJSON(accountData);
  }

  static async createAccount(accountData: CreateAccountDTO): Promise<Account> {
    const service = new AccountService();
    const newAccountData = await service.post<AccountDTO, CreateAccountDTO>('/account', accountData);

    if (!isAccountDTO(newAccountData)) {
      throw new Error('Dados da conta inválidos recebidos da API');
    }

    return Account.fromJSON(newAccountData);
  }

  static async updateAccount(accountId: string, updateData: UpdateAccountDTO): Promise<Account> {
    const service = new AccountService();
    const updatedAccountData = await service.put<AccountDTO, UpdateAccountDTO>(`/account/${accountId}`, updateData);

    if (!isAccountDTO(updatedAccountData)) {
      throw new Error('Dados da conta inválidos recebidos da API');
    }

    return Account.fromJSON(updatedAccountData);
  }

  static async updateAccountBalance(accountId: string, newBalance: number): Promise<Account> {
    if (typeof newBalance !== 'number' || isNaN(newBalance)) {
      throw new Error('Saldo deve ser um número válido');
    }

    const service = new AccountService();
    const updateData: UpdateAccountDTO = { balance: newBalance };
    const updatedAccountData = await service.put<AccountDTO, UpdateAccountDTO>(`/account/${accountId}`, updateData);

    if (!isAccountDTO(updatedAccountData)) {
      throw new Error('Dados da conta inválidos recebidos da API');
    }

    return Account.fromJSON(updatedAccountData);
  }

  static async deleteAccount(accountId: string): Promise<boolean> {
    const service = new AccountService();
    try {
      await service.delete<void>(`/account/${accountId}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      return false;
    }
  }
}
