export const createDoughnutData = (fundos: number, tesouro: number, previdencia: number, bolsa: number) => ({
  labels: [
    'Fundos de investimento',
    'Tesouro Direto',
    'Previdência Privada',
    'Bolsa de Valores',
  ],
  datasets: [
    {
      data: [fundos, tesouro, previdencia, bolsa],
      backgroundColor: ['#2563eb', '#f59e42', '#a21caf', '#ef4444'],
      borderWidth: 0,
    },
  ],
});

export const doughnutOptions = {
  plugins: { legend: { display: false } },
  cutout: '70%',
};

export const createTransferBarData = (deposits: number, payments: number, transfers: number, withdrawals: number) => ({
  labels: ['Depósitos', 'Pagamentos', 'Transferências', 'Saques'],
  datasets: [
    {
      label: 'Total (R$)',
      data: [deposits, payments, transfers, withdrawals],
      backgroundColor: ['#2563eb', '#f59e42', '#a21caf', '#ef4444'],
    },
  ],
});

export const transferBarOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top', labels: { color: '#fff' } },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true, ticks: { color: '#fff' } },
    x: { ticks: { color: '#fff' } },
  },
};

export const createEntradaSaidaData = (entradas: number, saidas: number) => ({
  labels: ['Entradas', 'Saídas'],
  datasets: [
    {
      label: 'Entradas',
      data: [entradas, 0],
      backgroundColor: ['#22c55e', 'rgba(34,197,94,0.08)'],
      borderRadius: 12,
      barPercentage: 0.5,
      categoryPercentage: 0.6,
    },
    {
      label: 'Saídas',
      data: [0, saidas],
      backgroundColor: ['rgba(239,68,68,0.08)', '#ef4444'],
      borderRadius: 12,
      barPercentage: 0.5,
      categoryPercentage: 0.6,
    },
  ],
});

export const entradaSaidaOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#0f172a',
      bodyColor: '#0f172a',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (ctx: any) =>
          `${ctx.dataset.label}: R$ ${ctx.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#334155', font: { weight: 'bold', size: 14 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#e5e7eb', borderDash: [4, 4] },
      ticks: {
        color: '#64748b',
        font: { size: 13 },
        callback: (value: number) => `R$ ${value.toLocaleString('pt-BR')}`,
      },
    },
  },
  animation: {
    duration: 900,
    easing: 'easeOutQuart',
  },
  maintainAspectRatio: false,
};

export const riskReturnData = [
  { label: 'Fundos de investimento', risk: 2, return: 6, color: '#2563eb' },
  { label: 'Tesouro Direto', risk: 1, return: 4, color: '#f59e42' },
  { label: 'Previdência Privada', risk: 1.5, return: 5, color: '#a21caf' },
  { label: 'Bolsa de Valores', risk: 5, return: 12, color: '#ef4444' },
];

export const createScatterData = () => ({
  datasets: riskReturnData.map(item => ({
    label: item.label,
    data: [{ x: item.risk, y: item.return }],
    backgroundColor: item.color,
    pointRadius: 8,
  })),
});

export const scatterOptions = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (ctx: any) => ctx[0].dataset.label,
        label: (ctx: any) => [
          `Risco: ${ctx.parsed.x}`,
          `Retorno: ${ctx.parsed.y}%`,
          'Este ponto representa o risco (desvio padrão) e o retorno (%) deste investimento.'
        ]
      }
    },
    title: { display: false }
  },
  scales: {
    x: {
      title: { display: true, text: 'Risco (Desvio Padrão)', color: '#fff' },
      min: 0,
      max: 6,
      grid: { color: '#fff' },
      ticks: { color: '#fff'}
    },
    y: {
      title: { display: true, text: 'Retorno (%)', color: '#fff' },
      min: 0,
      max: 14,
      grid: { color: '#fff' },
      ticks: { color: '#fff' }
    },
  },
  maintainAspectRatio: false,
};