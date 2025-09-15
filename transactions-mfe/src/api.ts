import axios from 'axios';

const API_BASE_URL = 'http://localhost:3034';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  date: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

class TransactionAPIService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await this.api.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const response = await this.api.post('/transactions', {
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
      await this.api.delete(`/transactions/${id}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async getAccount(): Promise<Account | null> {
    try {
      const response = await this.api.get('/account');
      return response.data;
    } catch (error) {
      console.error('Error fetching account:', error);
      return null;
    }
  }

  async updateAccountBalance(balance: number): Promise<void> {
    try {
      await this.api.patch('/account', { balance });
    } catch (error) {
      console.error('Error updating account balance:', error);
      throw error;
    }
  }
}

export const transactionAPI = new TransactionAPIService();