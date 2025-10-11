import { v4 as uuidv4 } from 'uuid';

import { BaseService } from './BaseService';
import { AccountDTO } from '../dtos/Account.dto';
import { TransactionDTO, isTransactionDTO } from '../dtos/Transaction.dto';
import { Transaction } from '../models/Transaction';
import { TransactionType } from '../types/TransactionType';
import { FileUploadService } from './FileUploadService';
import { TransactionFilters } from '../types/api.types';
import { GoalService } from './GoalService';
import api from './api';

/**
 * Service responsável por operações de transações financeiras.
 * Padrão: métodos estáticos, tratamento de fallback, comentários objetivos.
 */
export class TransactionService extends BaseService {
  constructor() {
    super('');
  }

  /**
   * Busca todas as transações da conta, com filtros opcionais.
   */
  static async getAllTransactions(accountId?: string, filters?: TransactionFilters): Promise<Transaction[]> {
    const service = new TransactionService();
    const queryParams = new URLSearchParams();
    if (accountId) queryParams.append('accountId', accountId);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) queryParams.append(key, value.toString());
      });
    }
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';
    try {
      const transactionsData = await service.get<TransactionDTO[]>(endpoint);
      return transactionsData.filter(isTransactionDTO).map(Transaction.fromJSON);
    } catch (error) {
      // Fallback para API legada
      let url = '/transactions';
      if (accountId) url += `?accountId=${accountId}`;
      const response = await api.get<TransactionDTO[]>(url);
      return response.data.map(Transaction.fromJSON);
    }
  }

  /**
   * Busca uma transação pelo ID.
   */
  static async getTransactionById(id: string): Promise<Transaction> {
    if (!id || id.trim().length === 0) throw new Error('ID da transação é obrigatório');
    const service = new TransactionService();
    const transactionData = await service.get<TransactionDTO>(`/transactions/${id}`);
    if (!isTransactionDTO(transactionData)) throw new Error('Dados da transação inválidos recebidos da API');
    return Transaction.fromJSON(transactionData);
  }

  /**
   * Cria uma nova transação e atualiza o saldo da conta.
   */
  static async addTransaction(
    accountId: string,
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string,
    attachmentFile?: File,
    goalId?: string,
    investmentId?: string
  ): Promise<Transaction> {
    this.validateTransactionInput(type, amount, date);
    const transactionId = uuidv4();
    let attachmentPath: string | undefined;
    if (attachmentFile) {
      try {
        attachmentPath = await FileUploadService.uploadFile(attachmentFile, type);
      } catch (error) {
        throw new Error('Falha no upload do arquivo. Transação não foi criada.');
      }
    }

    const newTransaction = new Transaction(transactionId, accountId, type, amount, date, description, attachmentPath, goalId, investmentId);
    try {
      const service = new TransactionService();
      const createdTransactionData = await service.post<TransactionDTO, TransactionDTO>('/transactions', newTransaction.toJSON());
      if (!isTransactionDTO(createdTransactionData)) throw new Error('Dados da transação inválidos recebidos da API');
      await this.applyTransactionToBalance(newTransaction);
      return Transaction.fromJSON(createdTransactionData);
    } catch (error) {
      // Fallback para API legada
      const response = await api.post('/transactions', newTransaction.toJSON());
      await this.applyTransactionToBalance(newTransaction);
      return Transaction.fromJSON(response.data);
    }
  }

  /**
   * Atualiza uma transação existente e ajusta o saldo da conta.
   */
  static async updateTransaction(
    id: string,
    type: TransactionType,
    amount: number,
    date: Date,
    description?: string,
    attachmentFile?: File,
    goalId?: string,
    investmentId?: string
  ): Promise<Transaction> {
    if (!id || id.trim().length === 0) throw new Error('ID da transação é obrigatório');
    this.validateTransactionInput(type, amount, date);
    const oldTransaction = await this.getTransactionById(id);
    let attachmentPath = oldTransaction.attachmentPath;
    if (attachmentFile) {
      try {
        attachmentPath = await FileUploadService.uploadFile(attachmentFile, type);
        if (oldTransaction.attachmentPath) await FileUploadService.deleteFile(oldTransaction.attachmentPath);
      } catch (error) {
        throw new Error('Falha no upload do arquivo. Transação não foi atualizada.');
      }
    }
    const updatedTransaction = new Transaction(
      id,
      oldTransaction.accountId,
      type,
      amount,
      date,
      description,
      attachmentPath,
      goalId !== undefined ? goalId : oldTransaction.goalId,
      investmentId !== undefined ? investmentId : oldTransaction.investmentId
    );
    try {
      const service = new TransactionService();
      const updatedTransactionData = await service.put<TransactionDTO, TransactionDTO>(`/transactions/${id}`, updatedTransaction.toJSON());
      if (!isTransactionDTO(updatedTransactionData)) throw new Error('Dados da transação inválidos recebidos da API');
      const amountDifference = amount - oldTransaction.amount;
      const typeChanged = type !== oldTransaction.type;
      if (amountDifference !== 0 || typeChanged) await this.applyBalanceUpdate(oldTransaction, updatedTransaction);
      return Transaction.fromJSON(updatedTransactionData);
    } catch (error) {
      // Fallback para API legada
      const response = await api.put(`/transactions/${id}`, updatedTransaction.toJSON());
      const amountDifference = amount - oldTransaction.amount;
      const typeChanged = type !== oldTransaction.type;
      if (amountDifference !== 0 || typeChanged) await this.applyBalanceUpdate(oldTransaction, updatedTransaction);
      return Transaction.fromJSON(response.data);
    }
  }

  /**
   * Exclui uma transação e ajusta o saldo e metas, se necessário.
   */
  static async deleteTransaction(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) throw new Error('ID da transação é obrigatório');
    try {
      const transaction = await this.getTransactionById(id);
      // Se for transação GOAL, desfaz atribuição à meta e credita saldo
      if (transaction.type === TransactionType.GOAL) {
        await this.updateAccountBalance(transaction.accountId, transaction.amount);
        if (transaction.goalId) {
          const goal = await GoalService.getById(transaction.goalId);
          if (goal) {
            await GoalService.update(goal.id, { assigned: Math.max(0, (goal.assigned || 0) - transaction.amount) });
          }
        }
      }
      const service = new TransactionService();
      await service.delete<void>(`/transactions/${id}`);
      if (transaction.attachmentPath) await FileUploadService.deleteFile(transaction.attachmentPath);
      if (transaction.type !== TransactionType.GOAL) await this.applyTransactionToBalance(transaction, true);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async deleteGoalAndTransactions(goalId: string, accountId: string): Promise<boolean> {
    if (!goalId) throw new Error('goalId é obrigatório');
    try {
      // 1. Busca a meta
      const goal = await GoalService.getById(goalId);
      if (!goal) throw new Error('Meta não encontrada');
      // 2. Remove todas as transações GOAL relacionadas à meta (isso já credita o saldo)
      await this.deleteGoalTransactions(goalId, accountId);
      // 3. Remove a meta do backend
      await GoalService.delete(goalId);
      return true;
    } catch (error) {
      return false;
    }
  }


  static async deleteGoalTransactions(goalId: string, accountId?: string): Promise<number> {
    if (!goalId) throw new Error('goalId é obrigatório');
    // Busca todas as transações GOAL associadas à meta
    const transactions = await this.getAllTransactions(accountId, { type: TransactionType.GOAL });
    const toDelete = transactions.filter(t => t.goalId === goalId);
    let deleted = 0;
    for (const tx of toDelete) {
      const ok = await this.deleteTransaction(tx.id);
      if (ok) deleted++;
    }
    return deleted;
  }

  /**
   * Deleta uma transação do tipo INVESTMENT, remove o investimento vinculado e credita o valor ao saldo.
   */
  static async deleteInvestmentTransaction(transactionId: string, loggedAccountId: string): Promise<boolean> {
    const transaction = await this.getTransactionById(transactionId);
    if (
      transaction.type === TransactionType.INVESTMENT &&
      transaction.investmentId &&
      transaction.accountId === loggedAccountId
    ) {
      // Remove investimento
      try {
        const { InvestmentService } = await import('./InvestmentService');
        await InvestmentService.remove(transaction.investmentId);
      } catch (e) {
        // Se não conseguir remover investimento, não prossegue
        return false;
      }
      // Credita valor ao saldo
      await this.updateAccountBalance(transaction.accountId, transaction.amount);
      // Remove transação
      const service = new TransactionService();
      await service.delete<void>(`/transactions/${transactionId}`);
      return true;
    }
    return false;
  }

  /**
   * Resgata todos os investimentos do usuário logado: remove transações e investimentos, credita saldo.
   */
  static async redeemAllInvestments(accountId: string): Promise<number> {
    // Busca todas as transações do tipo INVESTMENT do usuário
    const transactions = await this.getAllTransactions(accountId);
    const investmentTransactions = transactions.filter(
      t => t.type === TransactionType.INVESTMENT && t.investmentId && t.accountId === accountId
    );
    let total = 0;
    for (const tx of investmentTransactions) {
      const ok = await this.deleteInvestmentTransaction(tx.id, accountId);
      if (ok) total += tx.amount;
    }
    return total;
  }

  /**
   * Valida os dados de entrada de uma transação.
   */
  private static validateTransactionInput(type: TransactionType, amount: number, date: Date): void {
    if (!Object.values(TransactionType).includes(type)) throw new Error('Tipo de transação inválido');
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) throw new Error('Valor deve ser um número positivo');
    if (!(date instanceof Date) || isNaN(date.getTime())) throw new Error('Data deve ser válida');
  }

  /**
   * Atualiza o saldo da conta considerando diferença entre transações.
   */
  private static async applyBalanceUpdate(oldTransaction: Transaction, newTransaction: Transaction): Promise<void> {
    const oldEffect = oldTransaction.isIncome() ? oldTransaction.amount : -oldTransaction.amount;
    const newEffect = newTransaction.isIncome() ? newTransaction.amount : -newTransaction.amount;
    const netChange = newEffect - oldEffect;
    if (netChange !== 0) await this.updateAccountBalance(oldTransaction.accountId, netChange);
  }

  /**
   * Aplica o efeito da transação no saldo da conta.
   */
  private static async applyTransactionToBalance(transaction: Transaction, reverse: boolean = false): Promise<void> {
    const accountId = transaction.accountId;
    const amount = reverse ? -transaction.amount : transaction.amount;
    const balanceChange = transaction.isIncome() ? amount : -amount;
    await this.updateAccountBalance(accountId, balanceChange);
  }

  /**
   * Atualiza o saldo da conta, enviando todos os campos obrigatórios via PUT.
   */
  private static async updateAccountBalance(accountId: string, balanceChange: number): Promise<void> {
    try {
      const service = new TransactionService();
      const accountsData = await service.get<AccountDTO[]>('/accounts');
      const account = accountsData.find(acc => acc.id === accountId);
      if (!account) throw new Error('Conta não encontrada');
      const newBalance = account.balance + balanceChange;
      await service.put(`/accounts/${accountId}`, {
        id: account.id,
        name: account.name,
        balance: newBalance
      });
    } catch (error) {
      // Fallback usando fetch direto com PUT
      try {
        const accountResponse = await fetch(`http://localhost:3034/accounts/${accountId}`);
        if (!accountResponse.ok) throw new Error('Account not found');
        const accountData = await accountResponse.json();
        const newBalance = accountData.balance + balanceChange;
        await fetch(`http://localhost:3034/accounts/${accountId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: accountData.id,
            name: accountData.name,
            balance: newBalance
          })
        });
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  }
}
