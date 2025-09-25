import { Account } from '../models/Account';
import api from './api';

export class AccountService {
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

  static async getAccountByEmail(email: string): Promise<Account | null> {
    const response = await api.get('/accounts');
    const accounts = response.data;
    const account = accounts.find((acc: any) => acc.email === email);
    return account ? Account.fromJSON(account) : null;
  }

  static async createAccount(name: string, email: string, password: string): Promise<Account> {
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

    // Criar conta nova - não precisamos mais limpar transações globalmente
    // pois cada usuário terá suas próprias transações isoladas por accountId
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
  }

  static async login(email: string, password: string): Promise<Account> {
    // Buscar conta pelo email
    const account = await AccountService.getAccountByEmail(email);

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
