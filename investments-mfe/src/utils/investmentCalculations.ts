export const sumByType = (investments: any[], type: string) =>
  investments.filter(tx => tx.type === type).reduce((sum, tx) => sum + (tx.amount || 0), 0);

export const calculateInvestmentTotals = (allInvestments: any[]) => {
  const fundos = sumByType(allInvestments, 'FUNDOS');
  const tesouro = sumByType(allInvestments, 'TESOURO');
  const previdencia = sumByType(allInvestments, 'PREVIDENCIA');
  const bolsa = sumByType(allInvestments, 'BOLSA');
  
  return {
    fundos,
    tesouro,
    previdencia,
    bolsa,
    rendaFixa: fundos + tesouro + previdencia,
    rendaVariavel: bolsa,
    total: fundos + tesouro + previdencia + bolsa
  };
};

export const calculateTransactionTotals = (transactions: any[]) => {
  const sumTx = (type: string) =>
    transactions.filter(tx => tx.type === type).reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const entradas = transactions.filter(tx => tx.type === 'DEPOSIT').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const saidas = transactions.filter(tx => ['PAYMENT', 'TRANSFER', 'WITHDRAWAL'].includes(tx.type)).reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return {
    entradas,
    saidas,
    deposits: sumTx('DEPOSIT'),
    payments: sumTx('PAYMENT'),
    transfers: sumTx('TRANSFER'),
    withdrawals: sumTx('WITHDRAWAL')
  };
};