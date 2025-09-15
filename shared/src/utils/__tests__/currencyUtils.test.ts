import { formatCurrencyWithoutSymbol, formatCurrencyWithSymbol, formatUserCurrencyInput, parseCurrencyStringToNumber } from '../currencyUtils';

describe('formatCurrencyWithoutSymbol', () => {
    test('formatCurrency should format number as BRL', () => {
    expect(formatCurrencyWithSymbol(1234.56)).toBe('R$ 1.234,56');
  });
  test('formatCurrencyWithoutSymbol should format number to BRL string', () => {
    expect(formatCurrencyWithoutSymbol(1234.56)).toBe('1.234,56');
    expect(formatCurrencyWithoutSymbol(0)).toBe('0,00');
  });

  test('formatUserCurrencyInput should format input string to BRL string', () => {
    expect(formatUserCurrencyInput('123456')).toBe('1.234,56');
    expect(formatUserCurrencyInput('')).toBe('');
    expect(formatUserCurrencyInput('abc')).toBe('');
    expect(formatUserCurrencyInput('100')).toBe('1,00');
  });

  test('parseCurrencyStringToNumber should parse BRL string to number', () => {
    expect(parseCurrencyStringToNumber('1.234,56')).toBe(1234.56);
    expect(parseCurrencyStringToNumber('0,00')).toBe(0);
    expect(parseCurrencyStringToNumber('')).toBe(0);
  });
});
