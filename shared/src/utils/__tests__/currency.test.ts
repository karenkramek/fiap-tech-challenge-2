import {
    createCurrencyInputHandler,
    formatCurrencyWithSymbol,
    formatCurrencyWithoutSymbol,
    formatUserCurrencyInput,
    parseCurrencyStringToNumber
} from '../currency';

describe('Currency Utils', () => {
  describe('formatCurrencyWithSymbol', () => {
    it('should format positive numbers with BRL symbol', () => {
      const result1234 = formatCurrencyWithSymbol(1234.56);
      const result0 = formatCurrencyWithSymbol(0);
      const result1000 = formatCurrencyWithSymbol(1000);

      // Check if it contains the expected components
      expect(result1234).toContain('1.234,56');
      expect(result1234).toContain('R$');
      expect(result0).toContain('0,00');
      expect(result0).toContain('R$');
      expect(result1000).toContain('1.000,00');
      expect(result1000).toContain('R$');
    });

    it('should format negative numbers with BRL symbol', () => {
      const resultNeg1234 = formatCurrencyWithSymbol(-1234.56);
      const resultNeg100 = formatCurrencyWithSymbol(-100);

      expect(resultNeg1234).toContain('-');
      expect(resultNeg1234).toContain('1.234,56');
      expect(resultNeg1234).toContain('R$');
      expect(resultNeg100).toContain('-');
      expect(resultNeg100).toContain('100,00');
      expect(resultNeg100).toContain('R$');
    });

    it('should handle decimal numbers correctly', () => {
      const result1_5 = formatCurrencyWithSymbol(1.5);
      const result0_01 = formatCurrencyWithSymbol(0.01);
      const result99_99 = formatCurrencyWithSymbol(99.99);

      expect(result1_5).toContain('1,50');
      expect(result1_5).toContain('R$');
      expect(result0_01).toContain('0,01');
      expect(result0_01).toContain('R$');
      expect(result99_99).toContain('99,99');
      expect(result99_99).toContain('R$');
    });
  });

  describe('formatCurrencyWithoutSymbol', () => {
    it('should format positive numbers without BRL symbol', () => {
      expect(formatCurrencyWithoutSymbol(1234.56)).toBe('1.234,56');
      expect(formatCurrencyWithoutSymbol(0)).toBe('0,00');
      expect(formatCurrencyWithoutSymbol(1000)).toBe('1.000,00');
    });

    it('should format negative numbers without BRL symbol', () => {
      expect(formatCurrencyWithoutSymbol(-1234.56)).toBe('-1.234,56');
      expect(formatCurrencyWithoutSymbol(-100)).toBe('-100,00');
    });

    it('should handle decimal numbers correctly', () => {
      expect(formatCurrencyWithoutSymbol(1.5)).toBe('1,50');
      expect(formatCurrencyWithoutSymbol(0.01)).toBe('0,01');
      expect(formatCurrencyWithoutSymbol(99.99)).toBe('99,99');
    });
  });

  describe('formatUserCurrencyInput', () => {
    it('should format user input to currency format', () => {
      expect(formatUserCurrencyInput('123456')).toBe('1.234,56');
      expect(formatUserCurrencyInput('100')).toBe('1,00');
      expect(formatUserCurrencyInput('1')).toBe('0,01');
      expect(formatUserCurrencyInput('0')).toBe('0,00');
    });

    it('should handle non-numeric characters by removing them', () => {
      expect(formatUserCurrencyInput('1a2b3c')).toBe('1,23');
      expect(formatUserCurrencyInput('abc')).toBe('');
      expect(formatUserCurrencyInput('12.34,56')).toBe('1.234,56');
    });

    it('should handle empty or invalid input', () => {
      expect(formatUserCurrencyInput('')).toBe('');
      expect(formatUserCurrencyInput('abc')).toBe('');
      expect(formatUserCurrencyInput('!@#$')).toBe('');
    });

    it('should handle large numbers', () => {
      expect(formatUserCurrencyInput('1234567890')).toBe('12.345.678,90');
    });
  });

  describe('parseCurrencyStringToNumber', () => {
    it('should parse formatted currency strings to numbers', () => {
      expect(parseCurrencyStringToNumber('1.234,56')).toBe(1234.56);
      expect(parseCurrencyStringToNumber('1.000,00')).toBe(1000);
      expect(parseCurrencyStringToNumber('0,01')).toBe(0.01);
      expect(parseCurrencyStringToNumber('99,99')).toBe(99.99);
    });

    it('should handle numbers without Brazilian formatting', () => {
      // For US format input, the function treats dots as thousand separators
      // and commas as decimal separators per Brazilian format
      expect(parseCurrencyStringToNumber('1234.56')).toBe(123456); // 1234 thousands + 56 cents
      expect(parseCurrencyStringToNumber('1000')).toBe(1000);
      expect(parseCurrencyStringToNumber('0')).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(parseCurrencyStringToNumber('0,00')).toBe(0);
      expect(parseCurrencyStringToNumber('1,00')).toBe(1);
    });
  });

  describe('createCurrencyInputHandler', () => {
    it('should create a function that handles input change events', () => {
      const mockSetAmount = jest.fn();
      const handler = createCurrencyInputHandler(mockSetAmount);

      // Mock event object
      const mockEvent = {
        target: { value: '123456' }
      } as React.ChangeEvent<HTMLInputElement>;

      handler(mockEvent);

      expect(mockSetAmount).toHaveBeenCalledWith('1.234,56');
    });

    it('should handle multiple calls correctly', () => {
      const mockSetAmount = jest.fn();
      const handler = createCurrencyInputHandler(mockSetAmount);

      const mockEvent1 = {
        target: { value: '123' }
      } as React.ChangeEvent<HTMLInputElement>;

      const mockEvent2 = {
        target: { value: '456789' }
      } as React.ChangeEvent<HTMLInputElement>;

      handler(mockEvent1);
      handler(mockEvent2);

      expect(mockSetAmount).toHaveBeenCalledTimes(2);
      expect(mockSetAmount).toHaveBeenNthCalledWith(1, '1,23');
      expect(mockSetAmount).toHaveBeenNthCalledWith(2, '4.567,89');
    });

    it('should handle empty input', () => {
      const mockSetAmount = jest.fn();
      const handler = createCurrencyInputHandler(mockSetAmount);

      const mockEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;

      handler(mockEvent);

      expect(mockSetAmount).toHaveBeenCalledWith('');
    });
  });
});
