import axios from 'axios';
import { InvestmentDTO } from '../dtos/Investment.dto';
import type { AccountDTO } from '../dtos/Account.dto';

const API_URL = 'http://localhost:3034/investments';
const ACCOUNT_API_URL = 'http://localhost:3034/accounts';

/**
 * Service responsável por operações de investimentos.
 * Padrão: métodos assíncronos, comentários objetivos, tratamento de erros simples.
 */
export const InvestmentService = {
  /**
   * Busca todos os investimentos de uma conta.
   */
  async getAll(accountId: string): Promise<InvestmentDTO[]> {
    const res = await axios.get(`${API_URL}?accountId=${accountId}`);
    return res.data || [];
  },
  /**
   * Busca um investimento pelo ID.
   */
  async getById(id: string): Promise<InvestmentDTO | null> {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data || null;
  },
  /**
   * Cria um novo investimento.
   */
  async create(investment: InvestmentDTO): Promise<InvestmentDTO> {
    const res = await axios.post(API_URL, investment);
    return res.data;
  },
  /**
   * Atualiza um investimento existente.
   */
  async update(id: string, data: Partial<InvestmentDTO>): Promise<InvestmentDTO> {
    const res = await axios.patch(`${API_URL}/${id}`, data);
    return res.data;
  },
  /**
   * Remove um investimento pelo ID.
   */
  async remove(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
  /**
   * Busca uma conta pelo ID.
   */
  async getAccountById(accountId: string): Promise<AccountDTO | null> {
    const res = await axios.get(`${ACCOUNT_API_URL}?id=${accountId}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data[0];
    }
    return null;
  },
  /**
   * Atualiza o saldo da conta, enviando todos os campos obrigatórios via PUT.
   */
  async updateAccountBalance(accountId: string, newBalance: number): Promise<AccountDTO> {
    const resGet = await axios.get(`${ACCOUNT_API_URL}/${accountId}`);
    const account: AccountDTO = resGet.data;
    if (!account || !account.name) {
      throw new Error('Conta não encontrada ou sem nome');
    }
    const res = await axios.put(`${ACCOUNT_API_URL}/${accountId}`, {
      id: account.id,
      name: account.name,
      balance: newBalance
    });
    return res.data;
  }
};
