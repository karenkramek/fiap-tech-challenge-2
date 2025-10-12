import { Transaction } from '../models/Transaction';
import { formatDate } from './date';
import { formatCurrencyWithSymbol } from './currency';
import { TRANSACTION_TYPE_LABELS } from '../types/TransactionType';

// Remove acentos, pontuação, espaços, símbolos, barras, etc.
export function normalizeText(text: string = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]/gi, ""); // remove tudo que não for letra ou número
}

export function filterTransactions(transactions: Transaction[], search: string): Transaction[] {
  const normalizedSearch = normalizeText(search);
  if (normalizedSearch.length === 0) return transactions;
  return transactions.filter(t => {
    const typeLabel = TRANSACTION_TYPE_LABELS[t.type];
    const dateStr = formatDate(t.date);
    const dateStrNoSep = dateStr.replace(/[^0-9]/g, "");
    const description = t.description && t.description.trim() !== '' ? t.description : 'Sem descrição';
    const isIncome = t.isIncome && t.isIncome();
    const amountFormatted = formatCurrencyWithSymbol(t.amount);
    const amountWithSignal = isIncome ? amountFormatted : `- ${amountFormatted}`;
    const amountRaw = t.amount.toString();
    const amountNoSep = t.amount.toLocaleString('pt-BR', {useGrouping: false});
    const amountFormattedNoSymbol = amountFormatted.replace(/[^\d,]/g, "");
    const amountFormattedNoSep = amountFormatted.replace(/[^\d]/g, "");

    const fields = [
      typeLabel,
      dateStr,
      dateStrNoSep,
      description,
      amountFormatted,
      amountWithSignal,
      amountRaw,
      amountNoSep,
      amountFormattedNoSymbol,
      amountFormattedNoSep,
      'sem descricao'
    ];

    return fields.some(field => normalizeText(field).includes(normalizedSearch));
  });
}
