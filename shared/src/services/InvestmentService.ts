import { InvestmentDTO } from '../dtos/Investment.dto';
import type { AccountDTO } from '../dtos/Account.dto';
import api from './api';

/**
 * Service responsável por operações de investimentos.
 * Padrão: métodos assíncronos, comentários objetivos, tratamento de erros simples.
 */
export const InvestmentService = {
  /**
   * Busca todos os investimentos de uma conta.
   */
  async getAll(accountId: string): Promise<InvestmentDTO[]> {
    const res = await api.get(`/investments?accountId=${accountId}`);
    return res.data || [];
  },
  /**
   * Busca um investimento pelo ID.
   */
  async getById(id: string): Promise<InvestmentDTO | null> {
    const res = await api.get(`/investments/${id}`);
    return res.data || null;
  },
  /**
   * Cria um novo investimento.
   */
  async create(investment: InvestmentDTO): Promise<InvestmentDTO> {
    const res = await api.post('/investments', investment);
    return res.data;
  },
  /**
   * Atualiza um investimento existente.
   */
  async update(id: string, data: Partial<InvestmentDTO>): Promise<InvestmentDTO> {
    const res = await api.patch(`/investments/${id}`, data);
    return res.data;
  },
  /**
   * Remove um investimento pelo ID.
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/investments/${id}`);
  },
  /**
   * Busca uma conta pelo ID.
   */
  async getAccountById(accountId: string): Promise<AccountDTO | null> {
    const res = await api.get(`/accounts?id=${accountId}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data[0];
    }
    return null;
  },
  /**
   * Atualiza o saldo da conta, enviando todos os campos obrigatórios via PUT.
   */
  async updateAccountBalance(accountId: string, newBalance: number): Promise<AccountDTO> {
    const resGet = await api.get(`/accounts/${accountId}`);
    const account: AccountDTO = resGet.data;
    if (!account || !account.name) {
      throw new Error('Conta não encontrada ou sem nome');
    }
    const res = await api.put(`/accounts/${accountId}`, {
      id: account.id,
      name: account.name,
      balance: newBalance
    });
    return res.data;
  }
};
