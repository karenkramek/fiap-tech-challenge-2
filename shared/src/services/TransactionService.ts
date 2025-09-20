import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import api from './api';

import { TransactionDTO } from '../dtos/Transaction.dto';
import { AccountDTO } from '../dtos/Account.dto';
import { Transaction } from '../models/Transaction';
import { TransactionType } from '../types/TransactionType';
import { Account } from '../models/Account';

export class TransactionService {
  static async getAllTransactions(): Promise<Transaction[]> {
    const response = await api.get<TransactionDTO[]>('/transactions');
    return response.data.map(item => Transaction.fromJSON(item));
  }

  static async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get<TransactionDTO>(`/transactions/${id}`);
    return Transaction.fromJSON(response.data);
  }

  static async addTransaction(type: TransactionType, amount: number, date: Date, description?: string): Promise<Transaction> {
    const newTransaction = new Transaction(uuidv4(), type, amount, date, description);
    const response = await api.post('/transactions', newTransaction.toJSON());
    await this.applyTransactionToBalance(newTransaction);
    return Transaction.fromJSON(response.data);
  }

  static async updateTransaction(id: string, type: TransactionType, amount: number, date: Date, description?: string): Promise<Transaction> {
    const oldTransaction = await this.getTransactionById(id);
    const updatedTransaction = new Transaction(id, type, amount, date, description);
    const response = await api.put(`/transactions/${id}`, updatedTransaction.toJSON());

    // Update account balance based on the difference.
    const amountDifference = amount - oldTransaction.amount;
    const typeChanged = type !== oldTransaction.type;

    if (amountDifference !== 0 || typeChanged) {
      await this.applyTransactionToBalance(oldTransaction, true);
      await this.applyTransactionToBalance(updatedTransaction);
    }

    return Transaction.fromJSON(response.data);
  }

  static async deleteTransaction(id: string): Promise<boolean> {
    try {
      const transaction = await this.getTransactionById(id);
      await api.delete(`/transactions/${id}`);

      // Update account balance.
      await this.applyTransactionToBalance(transaction, true);

      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }

  private static async applyTransactionToBalance(transaction: Transaction, reverse: boolean = false): Promise<void> {
    // Fetch latest account data right before update
    const accountResponse = await api.get<AccountDTO>('/account');
    const account = accountResponse.data;
    let newBalance = account.balance;

    const amount = reverse ? -transaction.amount : transaction.amount;
    if (transaction.isIncome()) {
      newBalance += amount;
    } else {
      newBalance -= amount;
    }

    try {
      // Envia o objeto completo da conta para evitar aninhamento
      await api.put('/account', { id: account.id, name: account.name, balance: newBalance });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        throw new Error('Account balance update conflict. Please retry.');
      }
      throw error;
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const response = await api.post('/transactions', {
        ...transaction,
        id: Date.now().toString(), // Simple ID generation
      });
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      await api.delete(`/transactions/${id}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async getAccount(): Promise<Account | null> {
    try {
      const response = await api.get('/account');
      return response.data;
    } catch (error) {
      console.error('Error fetching account:', error);
      return null;
    }
  }

  async updateAccountBalance(balance: number): Promise<void> {
    try {
      await api.patch('/account', { balance });
    } catch (error) {
      console.error('Error updating account balance:', error);
      throw error;
    }
  }
}