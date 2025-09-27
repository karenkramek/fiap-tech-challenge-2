import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import axios from 'axios';
import '../investments-styles.css';

// Registre os elementos necessários do Chart.js
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Investments() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [investmentType, setInvestmentType] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentDesc, setInvestmentDesc] = useState('');
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  // Defina o id da conta logada (ajuste conforme sua lógica de autenticação)
  const accountId = 'acc001';

  // Busca transações, conta e investimentos da conta
  const fetchInvestmentsAndTransactions = () => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:3034/transactions'),
      axios.get(`http://localhost:3034/accounts?id=${accountId}`)
    ]).then(([txRes, accRes]) => {
      setTransactions(txRes.data);
      const account = accRes.data && accRes.data[0];
      setInvestments(account?.investments || []);
      setAccountBalance(account?.balance ?? null);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvestmentsAndTransactions();
  }, []);

  // Atualiza saldo ao abrir modal
  useEffect(() => {
    if (showModal) {
      setAccountBalance(null);
      axios.get(`http://localhost:3034/accounts?id=${accountId}`)
        .then(res => {
          const account = res.data && res.data[0];
          setAccountBalance(account?.balance ?? null);
        })
        .catch(() => setAccountBalance(null));
    }
  }, [showModal]);

  // Junta investimentos da conta com transações antigas (se necessário)
  const allInvestments = [
    ...investments,
    ...transactions.filter(tx =>
      ['FUNDOS', 'TESOURO', 'PREVIDENCIA', 'BOLSA'].includes(tx.type)
    )
  ];

  // Cálculos dos gráficos
  const fundos = allInvestments.filter(tx => tx.type === 'FUNDOS').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const tesouro = allInvestments.filter(tx => tx.type === 'TESOURO').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const previdencia = allInvestments.filter(tx => tx.type === 'PREVIDENCIA').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const bolsa = allInvestments.filter(tx => tx.type === 'BOLSA').reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const rendaFixa = fundos + tesouro + previdencia;
  const rendaVariavel = bolsa;
  const total = rendaFixa + rendaVariavel;

  const data = {
    labels: [
      'Fundos de investimento',
      'Tesouro Direto',
      'Previdência Privada',
      'Bolsa de Valores',
    ],
    datasets: [
      {
        data: [fundos, tesouro, previdencia, bolsa],
        backgroundColor: [
          '#2563eb', // azul
          '#f59e42', // laranja
          '#a21caf', // roxo
          '#ef4444', // vermelho
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    cutout: '70%',
  };

  // Gráfico de transferências
  const transactionCount = transactions.length;
  const transferSum = transactions.filter(tx => tx.type === 'TRANSFER').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const paymentSum = transactions.filter(tx => tx.type === 'PAYMENT').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const depositSum = transactions.filter(tx => tx.type === 'DEPOSIT').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const withdrawalSum = transactions.filter(tx => tx.type === 'WITHDRAWAL').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const transferBarData = {
    labels: ['Depósitos', 'Pagamentos', 'Transferências', 'Saques'],
    datasets: [
      {
        label: 'Total (R$)',
        data: [depositSum, paymentSum, transferSum, withdrawalSum],
        backgroundColor: [
          '#2563eb', // azul
          '#f59e42', // laranja
          '#a21caf', // roxo
          '#ef4444', // vermelho
        ],
      },
    ],
  };

  const transferBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#fff' } },
      title: { display: true, text: 'Análise de Transações', color: '#fff' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#fff' } },
      x: { ticks: { color: '#fff' } },
    },
  };

  const hasInvestments = [fundos, tesouro, previdencia, bolsa].some(v => v > 0);

  // Cadastrar novo investimento no array da conta
  const handleInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Busca a conta atual
    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account) return;

    // Gera um id simples para o investimento
    const newInvestment = {
      id: Math.random().toString(36).substring(2, 9),
      type: investmentType,
      amount: Number(investmentAmount),
      description: investmentDesc,
      date: new Date().toISOString()
    };

    // Atualiza o array de investimentos da conta
    const updatedInvestments = [...(account.investments || []), newInvestment];

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments
    });

    setShowModal(false);
    setInvestmentType('');
    setInvestmentAmount('');
    setInvestmentDesc('');
    fetchInvestmentsAndTransactions();
  };

  return (
    <div className="pt-8 pl-8 pr-4 max-w-4xl w-full">
      <h1 className="text-2xl font-bold mb-6">Meu Portfólio de Investimentos</h1>
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="font-bold text-xl mb-2">Investimentos</h2>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <>
            <div className="text-lg mb-6">
              Total: <span className="font-bold text-primary-700">
                {hasInvestments
                  ? `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : 'R$ 0,00'}
              </span>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-primary-700 rounded-lg p-4 text-center text-white-50">
                <div className="font-medium mb-1">Renda Fixa</div>
                <div className="text-xl font-bold">
                  {hasInvestments
                    ? `R$ ${rendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : '--'}
                </div>
              </div>
              <div className="flex-1 bg-primary-700 rounded-lg p-4 text-center text-white-50">
                <div className="font-medium mb-1">Renda variável</div>
                <div className="text-xl font-bold">
                  {hasInvestments
                    ? `R$ ${rendaVariavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : '--'}
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-2 text-center text-2xl">Estatísticas</div>
              <div
                className="bg-primary-700 rounded-lg p-4 flex items-center justify-center relative"
                style={{
                  padding: '40px'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '180px',
                    height: '100%',
                    pointerEvents: 'none',
                    background: `url("data:image/svg+xml,%3Csvg%20width='800px'%20height='800px'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cpath%20d='M4%205V19C4%2019.5523%204.44772%2020%205%2020H19'%20stroke='%23d1d5db'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3Cpath%20d='M18%209L13%2013.9999L10.5%2011.4998L7%2014.9998'%20stroke='%23d1d5db'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat left center / 180px 180px`,
                  opacity: 0.2,
                  zIndex: 1,
                }}
              />
              <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
                {hasInvestments ? (
                  <div style={{ width: 160, height: 160, margin: '0 auto' }}>
                    <Doughnut data={data} options={options} />
                  </div>
                ) : (
                  <div className="text-white-50 text-center font-medium flex flex-col items-center justify-center w-full">
                    <h3 className="text-xl font-bold mb-2">
                      Você ainda não possui investimentos em seu portfólio
                    </h3>
                    <p className="text-sm font-normal text-white-50 opacity-80">
                      Explore nossas opções de Renda Fixa e Renda Variável para construir seu portfólio de investimentos.
                    </p>
                  </div>
                )}
                {/* Botão só aparece dentro da área se NÃO houver investimentos */}
                {!hasInvestments && (
                  <div className="flex justify-center w-full mt-6">
                    <button
                      className="px-6 py-2 rounded-lg font-semibold shadow transition border border-primary-700 bg-white-50 text-primary-700 hover:bg-gray-200"
                      onClick={() => setShowModal(true)}
                    >
                      Começar a investir agora!
                    </button>
                  </div>
                )}
                {hasInvestments && (
                  <div className="flex flex-col gap-2 text-sm mt-2 investment-legend-text items-center">
                    <div className="flex items-center gap-2">
                      <span style={{ background: '#2563eb', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                      Fundos de investimento
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ background: '#f59e42', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                      Tesouro Direto
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ background: '#a21caf', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                      Previdência Privada
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ background: '#ef4444', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                      Bolsa de Valores
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Botão fora da área de Estatísticas, entre Estatísticas e Análise de Transações */}
            {hasInvestments && (
              <div className="flex justify-center w-full my-8">
                <button
                  className="px-6 py-2 rounded-lg font-semibold shadow transition border border-primary-700 bg-white-50 text-primary-700 hover:bg-gray-200"
                  onClick={() => setShowModal(true)}
                >
                  Cadastrar novo Investimento
                </button>
              </div>
            )}
            <div className="mt-8">
              <div className="font-medium mb-2 text-center text-2xl">Análise de Transações</div>
              <div className="bg-primary-700 rounded-lg p-4 flex flex-col items-center">
                <Bar data={transferBarData} options={transferBarOptions} style={{ maxWidth: 400 }} />
                <div className="text-white-50 text-sm mt-4">
                  Total de transações: <span className="font-bold">{transactionCount}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
             
             
            </div>
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowModal(false)}
                aria-label="Fechar"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4 text-primary-700">Novo Investimento</h3>
              <div className="mb-4">
                <span className="block text-gray-600 text-sm mb-1">Saldo total da Conta:</span>
                <span className="text-lg font-bold text-primary-700">
                  {accountBalance !== null
                    ? `R$ ${accountBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : 'Carregando...'}
                </span>
              </div>
              <form onSubmit={handleInvestmentSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Tipo de investimento</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={investmentType}
                    onChange={e => setInvestmentType(e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="FUNDOS">Fundos de investimento</option>
                    <option value="TESOURO">Tesouro Direto</option>
                    <option value="PREVIDENCIA">Previdência Privada</option>
                    <option value="BOLSA">Bolsa de Valores</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={investmentAmount}
                    onChange={e => setInvestmentAmount(e.target.value)}
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={investmentDesc}
                    onChange={e => setInvestmentDesc(e.target.value)}
                    maxLength={100}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-700 text-white-50 px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-800 transition mt-2"
                >
                  Cadastrar investimento
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
