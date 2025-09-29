import { BaseService } from './BaseService';
import { Account } from '../models/Account';
import { AccountDTO, CreateAccountDTO, UpdateAccountDTO } from '../dtos/Account.dto';
import api from './api';

export class AccountService extends BaseService {
  constructor() {
    super('');
  }

  static async getAccount(): Promise<Account> {
    // Para manter compatibilidade, retorna a primeira conta se existir
    const response = await api.get('/accounts');
    const accounts = response.data;
    if (accounts && accounts.length > 0) {
      return Account.fromJSON(accounts[0]);
    }
    throw new Error('Nenhuma conta encontrada');
  }

  static async getAccountById(accountId: string): Promise<Account> {
    const response = await api.get(`/accounts/${accountId}`);
    return Account.fromJSON(response.data);
  }

  static async createAccount(name: string, email: string, password: string): Promise<Account>;
  static async createAccount(accountData: CreateAccountDTO): Promise<Account>;
  static async createAccount(nameOrData: string | CreateAccountDTO, email?: string, password?: string): Promise<Account> {
    if (typeof nameOrData === 'string') {
      // Método original com parâmetros separados
      const name = nameOrData;
      if (!email || !password) {
        throw new Error('Email e password são obrigatórios');
      }

      // Verificar se já existe uma conta com este email
      const existingAccount = await AccountService.getAccountByEmail(email);
      if (existingAccount) {
        throw new Error('Já existe uma conta com este email');
      }

      // Gerar um ID único para a nova conta
      const accountId = `acc${Date.now()}`;

      const newAccount = {
        id: accountId,
        name,
        email,
        password,
        balance: 0 // Saldo inicial zero
      };

      try {
        console.log('Criando conta nova...');
        console.log('Dados da conta a serem enviados:', newAccount);

        // Usar POST para adicionar uma nova conta ao array
        const response = await api.post('/accounts', newAccount);

        console.log('Conta criada com sucesso:', response.data);
        console.log('Status da resposta:', response.status);

        // Verificar se o email foi salvo
        const savedAccount = response.data;
        if (!savedAccount.email || !savedAccount.password) {
          console.warn('ATENÇÃO: Email ou senha não foram salvos na resposta da API!');
          console.log('Campo email na resposta:', savedAccount.email);
          console.log('Campo password na resposta:', savedAccount.password);
        }

        console.log('Nova conta criada com saldo zero - transações isoladas por usuário');

        return Account.fromJSON(response.data);
      } catch (error) {
        console.error('Erro ao criar conta:', error);
        throw new Error('Erro ao criar conta. Tente novamente.');
      }
    } else {
      // Novo método com DTO
      const service = new AccountService();
      const newAccountData = await service.post<AccountDTO, CreateAccountDTO>('/accounts', nameOrData);

      return Account.fromJSON(newAccountData);
    }
  }

  static async updateAccount(accountId: string, updateData: UpdateAccountDTO): Promise<Account> {
    const service = new AccountService();
    const updatedAccountData = await service.put<AccountDTO, UpdateAccountDTO>(`/accounts/${accountId}`, updateData);

    return Account.fromJSON(updatedAccountData);
  }

  static async updateAccountBalance(accountId: string, newBalance: number): Promise<Account> {
    if (typeof newBalance !== 'number' || isNaN(newBalance)) {
      throw new Error('Saldo deve ser um número válido');
    }

    const service = new AccountService();
    const updateData: UpdateAccountDTO = { balance: newBalance };
    const updatedAccountData = await service.put<AccountDTO, UpdateAccountDTO>(`/accounts/${accountId}`, updateData);

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

  static async getAccountByEmail(email: string): Promise<Account | null> {
    const response = await api.get('/accounts');
    const accounts = response.data;
    const account = accounts.find((acc: any) => acc.email === email);
    return account ? Account.fromJSON(account) : null;
  }

  static async login(email: string, password: string): Promise<Account> {
    // Buscar conta pelo email
    const account = await AccountService.getAccountByEmail(email);
    console.log('🔎 Conta retornada para login:', account);
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    // Verifica se as credenciais coincidem
    if (account.email === email && account.password === password) {
      // Salva os dados do usuário no localStorage para persistir login
      localStorage.setItem('currentUser', JSON.stringify({
        id: account.id,
        name: account.name,
        email: account.email,
        isAuthenticated: true
      }));
      return account;
    } else {
      throw new Error('Credenciais inválidas');
    }
  }

  static getCurrentUser(): { id: string; name: string; email: string; isAuthenticated: boolean } | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  static logout(): void {
    localStorage.removeItem('currentUser');
  }

  static isAuthenticated(): boolean {
    const user = AccountService.getCurrentUser();
    return user ? user.isAuthenticated : false;
  }
}

export default AccountService;
