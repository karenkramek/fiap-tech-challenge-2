export const getMonthKey = (date: Date) => {
  return `${date.getMonth()}-${date.getFullYear()}`;
};

export const getMonthName = (month: string | number): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[Number(month)];
};

export const getCurrentDateFormatted = (): string => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const today = new Date();
  const dayName = days[today.getDay()];
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${dayName}, ${day}/${month}/${year}`;
};

export const formatDate = (date: Date | string): string => {
  const toLocalDate = (input: string | Date): Date => {
    if (input instanceof Date) return input;
    const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match
      ? new Date(+match[1], +match[2] - 1, +match[3]) // evita bug de fuso horário ao interpretar "yyyy-mm-dd" como UTC
      : new Date(input);
  };

  const d = toLocalDate(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
};

export const formatDateForInput = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};