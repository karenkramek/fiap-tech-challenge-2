const { formatCurrencyWithSymbol, parseCurrencyStringToNumber } = require('./src/utils/currency.ts');

console.log('Testing formatCurrencyWithSymbol:');
console.log('1234.56:', JSON.stringify(formatCurrencyWithSymbol(1234.56)));
console.log('1000:', JSON.stringify(formatCurrencyWithSymbol(1000)));
console.log('-1234.56:', JSON.stringify(formatCurrencyWithSymbol(-1234.56)));

console.log('\nTesting parseCurrencyStringToNumber:');
console.log('1234.56:', parseCurrencyStringToNumber('1234.56'));
console.log('1000:', parseCurrencyStringToNumber('1000'));
