import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { BaseService } from './BaseService';
import { AccountDTO } from '../dtos/Account.dto';
import { TransactionDTO, isTransactionDTO } from '../dtos/Transaction.dto';
import { Transaction } from '../models/Transaction';
import { TransactionType } from '../types/TransactionType';
import { FileUploadService } from './FileUploadService';
import { TransactionFilters } from '../types/api.types';
import { AccountService } from './AccountService';
import api from './api';

export class TransactionService extends BaseService {
  constructor() {
    super('');
  }

  static async getAllTransactions(accountId?: string, filters?: TransactionFilters): Promise<Transaction[]> {
    const service = new TransactionService();
    const queryParams = new URLSearchParams();

    // Add accountId if provided (for compatibility with legacy code)
    if (accountId) {
      queryParams.append('accountId', accountId);
    }

    // Add other filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';

    try {
      const transactionsData = await service.get<TransactionDTO[]>(endpoint);
      return transactionsData
        .filter(item => isTransactionDTO(item))
        .map(item => Transaction.fromJSON(item));
    } catch (error) {
      // Fallback to legacy API if new BaseService fails
      console.warn('Falling back to legacy API for getAllTransactions');
      let url = '/transactions';
      if (accountId) {
        url += `?accountId=${accountId}`;
      }
      const response = await api.get<TransactionDTO[]>(url);
      return response.data.map(item => Transaction.fromJSON(item));
    }
  }

  static async getTransactionById(id: string): Promise<Transaction> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID da transação é obrigatório');
    }

    const service = new TransactionService();
    const transactionData = await service.get<TransactionDTO>(`/transactions/${id}`);

    if (!isTransactionDTO(transactionData)) {
      throw new Error('Dados da transação inválidos recebidos da API');
    }

    return Transaction.fromJSON(transactionData);
  }

  static async addTransaction(
    accountId: string,
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string,
    attachmentFile?: File
  ): Promise<Transaction> {
    // Validações de entrada
    this.validateTransactionInput(type, amount, date);

    const transactionId = uuidv4();
    let attachmentPath: string | undefined;

    // Upload do arquivo se fornecido
    if (attachmentFile) {
      try {
        attachmentPath = await FileUploadService.uploadFile(attachmentFile, type);
      } catch (error) {
        console.error('Erro no upload do arquivo:', error);
        throw new Error('Falha no upload do arquivo. Transação não foi criada.');
      }
    }

    const newTransaction = new Transaction(transactionId, accountId, type, amount, date, description, attachmentPath);

    try {
      // Try new BaseService approach first
      const service = new TransactionService();
      const createdTransactionData = await service.post<TransactionDTO, TransactionDTO>('/transactions', newTransaction.toJSON());

      if (!isTransactionDTO(createdTransactionData)) {
        throw new Error('Dados da transação inválidos recebidos da API');
      }

      await this.applyTransactionToBalance(newTransaction);
      return Transaction.fromJSON(createdTransactionData);
    } catch (error) {
      // Fallback to legacy API
      console.warn('Falling back to legacy API for addTransaction');
      const response = await api.post('/transactions', newTransaction.toJSON());
      await this.applyTransactionToBalance(newTransaction);
      return Transaction.fromJSON(response.data);
    }
  }

  static async updateTransaction(
    id: string,
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string,
    attachmentFile?: File
  ): Promise<Transaction> {
    // Validações de entrada
    if (!id || id.trim().length === 0) {
      throw new Error('ID da transação é obrigatório');
    }
    this.validateTransactionInput(type, amount, date);

    const oldTransaction = await this.getTransactionById(id);
    let attachmentPath = oldTransaction.attachmentPath;

    // Gerenciar arquivo anexo
    if (attachmentFile) {
      try {
        attachmentPath = await FileUploadService.uploadFile(attachmentFile, type);

        // Remove arquivo antigo se existir
        if (oldTransaction.attachmentPath) {
          await FileUploadService.deleteFile(oldTransaction.attachmentPath);
        }
      } catch (error) {
        console.error('Erro no upload do arquivo:', error);
        throw new Error('Falha no upload do arquivo. Transação não foi atualizada.');
      }
    }

    const updatedTransaction = new Transaction(id, oldTransaction.accountId, type, amount, date, description, attachmentPath);

    try {
      // Try new BaseService approach first
      const service = new TransactionService();
      const updatedTransactionData = await service.put<TransactionDTO, TransactionDTO>(`/transactions/${id}`, updatedTransaction.toJSON());

      if (!isTransactionDTO(updatedTransactionData)) {
        throw new Error('Dados da transação inválidos recebidos da API');
      }

      // Update account balance based on the difference.
      const amountDifference = amount - oldTransaction.amount;
      const typeChanged = type !== oldTransaction.type;

      if (amountDifference !== 0 || typeChanged) {
        await this.applyBalanceUpdate(oldTransaction, updatedTransaction);
      }

      return Transaction.fromJSON(updatedTransactionData);
    } catch (error) {
      // Fallback to legacy API
      console.warn('Falling back to legacy API for updateTransaction');
      const response = await api.put(`/transactions/${id}`, updatedTransaction.toJSON());

      // Update account balance based on the difference.
      const amountDifference = amount - oldTransaction.amount;
      const typeChanged = type !== oldTransaction.type;

      if (amountDifference !== 0 || typeChanged) {
        await this.applyBalanceUpdate(oldTransaction, updatedTransaction);
      }

      return Transaction.fromJSON(response.data);
    }
  }

  static async deleteTransaction(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID da transação é obrigatório');
    }

    try {
      const transaction = await this.getTransactionById(id);

      const service = new TransactionService();
      await service.delete<void>(`/transactions/${id}`);

      // Remove arquivo anexado se existir
      if (transaction.attachmentPath) {
        await FileUploadService.deleteFile(transaction.attachmentPath);
      }

      // Update account balance.
      await this.applyTransactionToBalance(transaction, true);

      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }

  private static validateTransactionInput(type: TransactionType, amount: number, date: Date): void {
    if (!Object.values(TransactionType).includes(type)) {
      throw new Error('Tipo de transação inválido');
    }

    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new Error('Valor deve ser um número positivo');
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Data deve ser válida');
    }
  }

  /**
   * Método auxiliar para atualizar o balance considerando transação antiga e nova
   */
  private static async applyBalanceUpdate(oldTransaction: Transaction, newTransaction: Transaction): Promise<void> {
    // Calcular a diferença líquida entre as transações
    const oldEffect = oldTransaction.isIncome() ? oldTransaction.amount : -oldTransaction.amount;
    const newEffect = newTransaction.isIncome() ? newTransaction.amount : -newTransaction.amount;
    const netChange = newEffect - oldEffect;

    if (netChange !== 0) {
      await this.updateAccountBalance(oldTransaction.accountId, netChange);
    }
  }

  private static async applyTransactionToBalance(transaction: Transaction, reverse: boolean = false): Promise<void> {
    const transactionToProcess = transaction;
    const accountId = transactionToProcess.accountId;

    const amount = reverse ? -transactionToProcess.amount : transactionToProcess.amount;
    const balanceChange = transactionToProcess.isIncome() ? amount : -amount;

    await this.updateAccountBalance(accountId, balanceChange);
  }

  /**
   * Atualiza o saldo da conta com o valor especificado
   */
  private static async updateAccountBalance(accountId: string, balanceChange: number): Promise<void> {
    try {
      // Busca todas as contas e seleciona a correta
      const service = new TransactionService();
      const accountsData = await service.get<AccountDTO[]>('/accounts');
      const account = accountsData.find(acc => acc.id === accountId);
      if (!account) throw new Error('Conta não encontrada');

      const newBalance = account.balance + balanceChange;

      // Buscar a conta completa com todos os campos
      const fullAccount = await AccountService.getAccountById(accountId);

      // Preservar todos os campos da conta, incluindo email e password
      const updateData = {
        id: fullAccount.id,
        name: fullAccount.name,
        balance: newBalance,
        email: fullAccount.email,
        password: fullAccount.password
      };
      await service.put(`/accounts/${fullAccount.id}`, updateData);
    } catch (error) {
      // Fallback to legacy API with specific account ID
      console.warn('Falling back to legacy API for balance update');
      const account = await api.get<AccountDTO>(`/accounts/${accountId}`);
      const accountData = account.data;
      const newBalance = accountData.balance + balanceChange;

      await api.put(`/accounts/${accountId}`, {
        ...accountData,
        balance: newBalance
      });

      if (error instanceof AxiosError && error.response?.status === 409) {
        throw new Error('Account balance update conflict. Please retry.');
      }
    }
  }
}
