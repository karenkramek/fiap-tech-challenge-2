import { getMonthName, getCurrentDateFormatted, getMonthKey, formatDate, formatDateForInput } from '../utils';

describe('utils', () => {
  test('getMonthName should return correct month name', () => {
    expect(getMonthName(0)).toBe('Janeiro');
    expect(getMonthName(11)).toBe('Dezembro');
  });

  test('getCurrentDateFormatted should return a string', () => {
    expect(typeof getCurrentDateFormatted()).toBe('string');
  });

  test('getMonthKey should return correct key', () => {
    const date = new Date(2025, 8, 2); // Setembro (zero-based)
    expect(getMonthKey(date)).toBe('8-2025');
  });

  test('formatDate should format date as dd/mm/yyyy', () => {
    const date = new Date(2025, 8, 2); // Setembro (zero-based)
    expect(formatDate(date)).toBe('02/09/2025');
    expect(formatDate('2025-09-02')).toBe('02/09/2025');
  });

  test('formatDateForInput should format date as yyyy-mm-dd', () => {
    const date = new Date(2025, 8, 2); // Setembro (zero-based)
    expect(formatDateForInput(date)).toBe('2025-09-02');
  });
});
