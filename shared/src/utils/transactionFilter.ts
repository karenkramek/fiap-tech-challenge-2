import { Transaction } from '../models/Transaction';
import { formatDate } from './date';
import { getTransactionTypeLabel } from '../types/TransactionType';

export function normalizeText(text: string = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterTransactions(transactions: Transaction[], search: string): Transaction[] {
  const normalizedSearch = normalizeText(search.trim().replace(/[.]/g, ','));
  if (normalizedSearch.length === 0) return transactions;
  return transactions.filter(t => {
    const amountStr = t.amount?.toString().replace(/[.]/g, ',');
    const typeLabel = getTransactionTypeLabel(t.type);
    return [
      typeLabel,
      formatDate(t.date),
      amountStr,
      t.description,
      t.attachmentPath
    ].some(field => normalizeText(field).includes(normalizedSearch));
  });
}
