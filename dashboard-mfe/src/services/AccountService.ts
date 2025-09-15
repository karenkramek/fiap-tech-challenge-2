import api from './api';
import { Account } from '../models/Account';

export class AccountService {
  static async getAccount(): Promise<Account> {
    const response = await api.get('/account');
    return Account.fromJSON(response.data);
  }
}
