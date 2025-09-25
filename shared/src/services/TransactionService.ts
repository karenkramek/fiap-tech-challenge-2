import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { BaseService } from './BaseService';
import { AccountDTO, isAccountDTO } from '../dtos/Account.dto';
import { TransactionDTO, isTransactionDTO } from '../dtos/Transaction.dto';
import { Transaction } from '../models/Transaction';
import { TransactionType } from '../types/TransactionType';
import { FileUploadService } from './FileUploadService';
import { TransactionFilters } from '../types/api.types';

export class TransactionService extends BaseService {
  constructor() {
    super('');
  }

  static async getAllTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    const service = new TransactionService();
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';

    const transactionsData = await service.get<TransactionDTO[]>(endpoint);

    return transactionsData
      .filter(item => isTransactionDTO(item))
      .map(item => Transaction.fromJSON(item));
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

    const newTransaction = new Transaction(transactionId, type, amount, date, description, attachmentPath);

    const service = new TransactionService();
    const createdTransactionData = await service.post<TransactionDTO, TransactionDTO>('/transactions', newTransaction.toJSON());

    if (!isTransactionDTO(createdTransactionData)) {
      throw new Error('Dados da transação inválidos recebidos da API');
    }

    await this.applyTransactionToBalance(newTransaction);
    return Transaction.fromJSON(createdTransactionData);
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

    const updatedTransaction = new Transaction(id, type, amount, date, description, attachmentPath);

    const service = new TransactionService();
    const updatedTransactionData = await service.put<TransactionDTO, TransactionDTO>(`/transactions/${id}`, updatedTransaction.toJSON());

    if (!isTransactionDTO(updatedTransactionData)) {
      throw new Error('Dados da transação inválidos recebidos da API');
    }

    // Update account balance based on the difference.
    const amountDifference = amount - oldTransaction.amount;
    const typeChanged = type !== oldTransaction.type;

    if (amountDifference !== 0 || typeChanged) {
      await this.applyTransactionToBalance(oldTransaction, true);
      await this.applyTransactionToBalance(updatedTransaction);
    }

    return Transaction.fromJSON(updatedTransactionData);
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

  private static async applyTransactionToBalance(transaction: Transaction, reverse: boolean = false): Promise<void> {
    const service = new TransactionService();

    // Fetch latest account data right before update
    const accountData = await service.get<AccountDTO>('/account');

    if (!isAccountDTO(accountData)) {
      throw new Error('Dados da conta inválidos recebidos da API');
    }

    const account = accountData;
    let newBalance = account.balance;

    const amount = reverse ? -transaction.amount : transaction.amount;
    if (transaction.isIncome()) {
      newBalance += amount;
    } else {
      newBalance -= amount;
    }

    try {
      // Envia o objeto completo da conta para evitar aninhamento
      const updateData: AccountDTO = {
        id: account.id,
        name: account.name,
        balance: newBalance
      };
      await service.put<AccountDTO, AccountDTO>('/account', updateData);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        throw new Error('Account balance update conflict. Please retry.');
      }
      throw error;
    }
  }
}
