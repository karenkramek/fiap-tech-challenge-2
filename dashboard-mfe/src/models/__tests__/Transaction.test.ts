import { Transaction, TransactionType } from '../Transaction';

describe('Transaction', () => {
  test('should create a valid Transaction', () => {
    const t = new Transaction('1', TransactionType.DEPOSIT, 100, new Date('2025-08-21'), 'Teste');
    expect(t.id).toBe('1');
    expect(t.type).toBe(TransactionType.DEPOSIT);
    expect(t.amount).toBe(100);
    expect(t.date).toEqual(new Date('2025-08-21'));
    expect(t.description).toBe('Teste');
  });

  test('should throw error for invalid data', () => {
    expect(() => new Transaction('', TransactionType.DEPOSIT, NaN, new Date('invalid'))).toThrow();
  });

  test('isIncome should return true for DEPOSIT', () => {
    const t = new Transaction('2', TransactionType.DEPOSIT, 50, new Date(), 'Depósito');
    expect(t.isIncome()).toBe(true);
  });

  test('isExpense should return true for WITHDRAWAL', () => {
    const t = new Transaction('3', TransactionType.WITHDRAWAL, 30, new Date(), 'Saque');
    expect(t.isExpense()).toBe(true);
  });

  test('fromJSON and toJSON should work correctly', () => {
    const json = {
      id: '4',
      type: TransactionType.TRANSFER,
      amount: 200,
      date: '2025-08-21T00:00:00.000Z',
      description: 'Transferência'
    };
    const t = Transaction.fromJSON(json);
    expect(t.id).toBe('4');
    expect(t.type).toBe(TransactionType.TRANSFER);
    expect(t.amount).toBe(200);
    expect(t.date).toEqual(new Date('2025-08-21T00:00:00.000Z'));
    expect(t.description).toBe('Transferência');
    expect(t.toJSON()).toMatchObject(json);
  });
});
