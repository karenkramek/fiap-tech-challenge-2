import api from './api';

export interface GoalDTO {
  id: string;
  accountId: string;
  name: string;
  value: number;
  assigned: number;
  createdAt: string;
  deadline?: string;
}

export const GoalService = {
  async getAll(accountId: string): Promise<GoalDTO[]> {
    const res = await api.get(`/goals?accountId=${accountId}`);
    return res.data || [];
  },
  async getById(id: string): Promise<GoalDTO | null> {
    const res = await api.get(`/goals/${id}`);
    return res.data || null;
  },
  async update(id: string, data: Partial<GoalDTO>): Promise<GoalDTO> {
    const res = await api.patch(`/goals/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
  async create(goal: GoalDTO): Promise<GoalDTO> {
    const res = await api.post('/goals', goal);
    return res.data;
  },
};
