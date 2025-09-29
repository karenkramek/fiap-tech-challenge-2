import React, { useEffect, useState, useRef } from 'react';
import { Doughnut, Bar, Scatter } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement } from 'chart.js';
import axios from 'axios';
import '../investments-styles.css';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement);

const accountId = 'acc001';

export default function Investments() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [investmentType, setInvestmentType] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentDesc, setInvestmentDesc] = useState('');
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);

  // Metas
  const [savingGoal, setSavingGoal] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goals, setGoals] = useState<{ name: string; value: number; deadline?: string; saved: number }[]>([]);
  const [widgetMessage, setWidgetMessage] = useState('');
  const [depositValues, setDepositValues] = useState<string[]>([]);
  const [withdrawValues, setWithdrawValues] = useState<string[]>([]);
  const depositInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<number | null>(null);

  // Resgate de investimento
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [investmentToRedeem, setInvestmentToRedeem] = useState<any>(null);

  // Fetch dados
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
      const cofrinhos = (account?.investments || [])
        .filter(inv => inv.type === 'COFRINHO')
        .map(inv => ({
          name: inv.description,
          value: inv.goalValue || 0,
          deadline: inv.deadline,
          saved: inv.amount || 0
        }));
      setGoals(cofrinhos);
    }).finally(() => setLoading(false));
  };

  useEffect(fetchInvestmentsAndTransactions, []);

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

  // Investimentos + transações antigas
  const allInvestments = [
    ...investments,
    ...transactions.filter(tx =>
      ['FUNDOS', 'TESOURO', 'PREVIDENCIA', 'BOLSA'].includes(tx.type)
    )
  ];

  // Gráficos
  const sumByType = (type: string) =>
    allInvestments.filter(tx => tx.type === type).reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const fundos = sumByType('FUNDOS');
  const tesouro = sumByType('TESOURO');
  const previdencia = sumByType('PREVIDENCIA');
  const bolsa = sumByType('BOLSA');
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
          '#2563eb',
          '#f59e42',
          '#a21caf',
          '#ef4444',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    cutout: '70%',
  };

  // Gráfico de barras de transações
  const transactionCount = transactions.length;
  const sumTx = (type: string) =>
    transactions.filter(tx => tx.type === type).reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const transferBarData = {
    labels: ['Depósitos', 'Pagamentos', 'Transferências', 'Saques'],
    datasets: [
      {
        label: 'Total (R$)',
        data: [sumTx('DEPOSIT'), sumTx('PAYMENT'), sumTx('TRANSFER'), sumTx('WITHDRAWAL')],
        backgroundColor: [
          '#2563eb',
          '#f59e42',
          '#a21caf',
          '#ef4444',
        ],
      },
    ],
  };

  const transferBarOptions = {
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

  // Gráfico Entradas vs Saídas
  const entradas = transactions.filter(tx => tx.type === 'DEPOSIT').reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const saidas = transactions.filter(tx => ['PAYMENT', 'TRANSFER', 'WITHDRAWAL'].includes(tx.type)).reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const entradaSaidaData = {
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
  };

  const entradaSaidaOptions = {
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
          label: (ctx) =>
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

  const hasInvestments = [fundos, tesouro, previdencia, bolsa].some(v => v > 0);

  // Novo investimento
  const handleInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const investmentValue = Number(investmentAmount);

    if (account.balance < investmentValue) {
      setShowInsufficientFunds(true);
      return;
    }

    const newInvestment = {
      id: Math.random().toString(36).substring(2, 9),
      type: investmentType,
      amount: investmentValue,
      description: investmentDesc,
      date: new Date().toISOString()
    };

    const updatedInvestments = [...(account.investments || []), newInvestment];
    const updatedBalance = account.balance - investmentValue;

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments,
      balance: updatedBalance
    });

    setShowModal(false);
    setInvestmentType('');
    setInvestmentAmount('');
    setInvestmentDesc('');
    fetchInvestmentsAndTransactions();
  };

  // Metas
  const handleSaveGoal = () => {
    if (!savingGoal || Number(savingGoal) <= 0) return;
    setShowGoalModal(true);
  };

  const handleConfirmGoal = async () => {
    const newCofrinho = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'COFRINHO',
      amount: 0,
      description: goalName || 'Meta sem nome',
      deadline: goalDeadline,
      goalValue: Number(savingGoal),
      date: new Date().toISOString()
    };

    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const updatedInvestments = [...(account.investments || []), newCofrinho];

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments
    });

    setGoals([
      ...goals,
      {
        name: goalName || 'Meta sem nome',
        value: Number(savingGoal),
        deadline: goalDeadline,
        saved: 0
      }
    ]);
    setShowGoalModal(false);
    setGoalName('');
    setGoalDeadline('');
    setSavingGoal('');
    setWidgetMessage('Meta criada com sucesso!');
    setTimeout(() => setWidgetMessage(''), 3000);
    fetchInvestmentsAndTransactions();
  };

  const handleDeposit = async (idx: number) => {
    const value = depositValues[idx];
    if (!value || Number(value) <= 0) return;
    const depositAmount = Number(value);

    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account || account.balance < depositAmount) {
      setWidgetMessage('Saldo insuficiente para depósito!');
      setTimeout(() => setWidgetMessage(''), 3000);
      return;
    }

    const cofrinhoDesc = goals[idx].name;
    const investmentsAtualizados = (account.investments || []).map(inv =>
      inv.type === 'COFRINHO' && inv.description === cofrinhoDesc
        ? { ...inv, amount: (inv.amount || 0) + depositAmount }
        : inv
    );

    const novoSaldo = account.balance - depositAmount;

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: investmentsAtualizados,
      balance: novoSaldo
    });

    setGoals(goals =>
      goals.map((g, i) =>
        i === idx
          ? { ...g, saved: Math.min(g.saved + depositAmount, g.value) }
          : g
      )
    );
    setDepositValues(values => {
      const arr = [...values];
      arr[idx] = '';
      return arr;
    });
    depositInputRef.current?.focus();
    fetchInvestmentsAndTransactions();
  };

  const handleWithdraw = async (idx: number) => {
    const value = withdrawValues[idx];
    if (!value || Number(value) <= 0) return;
    const withdrawAmount = Number(value);

    if (withdrawAmount > goals[idx].saved) {
      setWidgetMessage('Você não pode sacar mais do que o valor poupado na meta!');
      setTimeout(() => setWidgetMessage(''), 3000);
      return;
    }

    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const cofrinhoDesc = goals[idx].name;
    const investmentsAtualizados = (account.investments || []).map(inv =>
      inv.type === 'COFRINHO' && inv.description === cofrinhoDesc
        ? { ...inv, amount: Math.max((inv.amount || 0) - withdrawAmount, 0) }
        : inv
    );

    const novoSaldo = account.balance + withdrawAmount;

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: investmentsAtualizados,
      balance: novoSaldo
    });

    setGoals(goals =>
      goals.map((g, i) =>
        i === idx
          ? { ...g, saved: Math.max(g.saved - withdrawAmount, 0) }
          : g
      )
    );
    setWithdrawValues(values => {
      const arr = [...values];
      arr[idx] = '';
      return arr;
    });
    depositInputRef.current?.focus();
    fetchInvestmentsAndTransactions();
  };

  // Exclusão de meta
  const handleDeleteGoal = async (idx: number) => {
    const goal = goals[idx];
    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const updatedInvestments = (account.investments || []).filter(
      inv => !(inv.type === 'COFRINHO' && inv.description === goal.name)
    );
    const novoSaldo = account.balance + (goal.saved || 0);

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments,
      balance: novoSaldo
    });

    setGoals(goals => goals.filter((_, i) => i !== idx));
    setWidgetMessage('Meta excluída e valor devolvido ao saldo!');
    setTimeout(() => setWidgetMessage(''), 3000);
    fetchInvestmentsAndTransactions();
  };

  const openDeleteGoalModal = (idx: number) => {
    setGoalToDelete(idx);
    setShowDeleteModal(true);
  };

  const closeDeleteGoalModal = () => {
    setShowDeleteModal(false);
    setGoalToDelete(null);
  };

  const confirmDeleteGoal = async () => {
    if (goalToDelete === null) return;
    await handleDeleteGoal(goalToDelete);
    setShowDeleteModal(false);
    setGoalToDelete(null);
  };

  // Resgate de investimento
  const openRedeemModal = (inv: any) => {
    setInvestmentToRedeem(inv);
    setShowRedeemModal(true);
  };

  const closeRedeemModal = () => {
    setShowRedeemModal(false);
    setInvestmentToRedeem(null);
  };

  const handleRedeemInvestment = async () => {
    if (!investmentToRedeem) return;
    const res = await axios.get(`http://localhost:3034/accounts?id=${accountId}`);
    const account = res.data && res.data[0];
    if (!account) return;

    const updatedInvestments = (account.investments || []).filter(
      inv => inv.id !== investmentToRedeem.id
    );
    const novoSaldo = account.balance + (investmentToRedeem.amount || 0);

    await axios.patch(`http://localhost:3034/accounts/${account.id}`, {
      investments: updatedInvestments,
      balance: novoSaldo
    });

    setWidgetMessage('Investimento resgatado com sucesso!');
    setTimeout(() => setWidgetMessage(''), 3000);
    closeRedeemModal();
    fetchInvestmentsAndTransactions();
  };

  // Gráfico risco x retorno
  const riskReturnData = [
    { label: 'Fundos de investimento', risk: 2, return: 6, color: '#2563eb' },
    { label: 'Tesouro Direto', risk: 1, return: 4, color: '#f59e42' },
    { label: 'Previdência Privada', risk: 1.5, return: 5, color: '#a21caf' },
    { label: 'Bolsa de Valores', risk: 5, return: 12, color: '#ef4444' },
  ];

  const scatterData = {
    datasets: riskReturnData.map(item => ({
      label: item.label,
      data: [{ x: item.risk, y: item.return }],
      backgroundColor: item.color,
      pointRadius: 8,
    })),
  };

  const scatterOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (ctx) => ctx[0].dataset.label,
          label: (ctx) => [
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

  return (
    <div className="flex flex-col gap-8 px-2 sm:px-4 py-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-700 mb-1">Investimentos</h1>
          <p className="text-gray-500 text-base">Gerencie e acompanhe seus investimentos de forma simples e visual.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-lg text-gray-500">Carregando...</span>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Resumo */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
              <h2 className="text-xl font-bold text-primary-700 mb-4">Resumo</h2>
              {!hasInvestments ? (
                <>
                  <div className="flex flex-col items-center mt-6">
                    <h3 className="text-lg font-bold text-primary-700 mb-2">
                      Você ainda não possui investimentos
                    </h3>
                    <div className="my-4" aria-hidden="true">
                      <svg height="120" width="120" viewBox="0 0 511.883 511.883" xmlns="http://www.w3.org/2000/svg">
                        <path style={{ fill: "#A0D468" }} d="M460.049,186.582c0,0-77.545-42.006-133.203-22.276c-34.117,12.091-51.988,49.535-39.944,83.668l0,0
                          c12.138,34.086,49.599,51.91,83.731,39.819C426.276,268.063,460.049,186.582,460.049,186.582z"/>
                        <path style={{ fill: "#8CC153" }} d="M383.145,200.61c-1.249-0.219-2.483-0.203-3.654,0l0,0c-1.406,0.234-34.586,6.045-71.141,25.76
                          c-15.715,8.451-29.696,18.245-41.74,29.165v-80.466h-21.331v103.632c-13.778,18.105-23.252,38.476-28.189,60.736l20.823,4.608
                          c4.452-20.059,13.177-38.382,25.978-54.565h2.719v-3.327c0.906-1.078,1.828-2.141,2.772-3.203
                          c12.833-14.387,29.173-27.009,48.544-37.522c33.539-18.199,64.844-23.744,65.156-23.807l0,0c4.312-0.75,7.889-4.093,8.701-8.639
                          C392.815,207.17,388.941,201.64,383.145,200.61z"/>
                        <path style={{ fill: "#434A54" }} d="M108.225,406.218c0,0,77.811-128.236,147.716-128.954c69.905-0.734,147.716,128.954,147.716,128.954
                          L108.225,406.218L108.225,406.218z"/>
                        <path style={{ fill: "#EAC6BB" }} d="M450.786,367.571c-3.342-0.266-7.014-0.391-11.043-0.391c-26.244,0-67.11,5.593-123.113,15.466
                          c-6.967-19.871-51.238-28.588-51.238-28.588s-95.548-5.201-156.534-8.528c-3.89-0.219-7.655-0.312-11.279-0.312
                          C16.793,345.202,0,395.628,0,395.628v52.238c0.031,29.945,92.33,44.63,92.643,44.677c73.319,14.481,163.432,19.34,163.432,19.34
                          s246.935-97.025,253.418-102.695C515.975,403.532,513.131,372.57,450.786,367.571z"/>
                        <path style={{ fill: "#DBADA2" }} d="M385.833,371.664c-19.402,2.578-42.021,6.202-67.875,10.748c-3.297,1.469-6.686,2.968-10.17,4.452
                          c-67.765,28.915-115.691,34.977-143.958,34.977c-5.889,0-10.662,4.779-10.662,10.669s4.772,10.654,10.662,10.654
                          c44.099,0,95.462-12.388,152.66-36.82C351.075,391.55,376.881,376.928,385.833,371.664z"/>
                        <path style={{ fill: "#F6BB42" }} d="M323.393,74.638c-11.98-25.213-37.678-42.646-67.452-42.646s-55.479,17.434-67.461,42.646h-7.186
                          v31.993c0,41.225,33.422,74.654,74.647,74.654c41.224,0,74.654-33.43,74.654-74.654V74.638H323.393z"/>
                        <path style={{ fill: "#FFCE54" }} d="M330.595,74.638c0,41.225-33.431,74.655-74.654,74.655c-41.225,0-74.647-33.431-74.647-74.655
                          S214.716,0,255.941,0C297.165,0,330.595,33.414,330.595,74.638z"/>
                        <path style={{ fill: "#E8AA3D" }} d="M266.61,53.315h-0.016c0-5.78-4.601-10.528-10.403-10.669c-5.89-0.125-10.771,4.53-10.912,10.419
                          c0,0.078,0.008,0.156,0.008,0.25h-0.008v42.662h0.008c0,5.765,4.601,10.514,10.404,10.654c5.889,0.141,10.771-4.53,10.911-10.42
                          c0-0.078-0.008-0.156-0.008-0.234h0.016V53.315z"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Comece agora mesmo a investir e acompanhe seus resultados por aqui!
                    </p>
                  </div>
                  <button
                    className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-tertiary-300 px-4 text-base w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md mt-10"
                    onClick={() => setShowModal(true)}
                  >
                    Novo Investimento
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-6 mb-6 w-full justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-gray-500 text-sm">Total</span>
                      <span className="text-2xl font-bold text-primary-700">
                        {`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-gray-500 text-sm">Renda Fixa</span>
                      <span className="text-lg font-semibold text-primary-700">
                        {`R$ ${rendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-gray-500 text-sm">Renda Variável</span>
                      <span className="text-lg font-semibold text-primary-700">
                        {`R$ ${rendaVariavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <span className="text-lg font-medium mb-2 text-center">Distribuição</span>
                    <div className="flex flex-col md:flex-row items-center justify-center w-full">
                      <div className="flex justify-center items-center w-full md:w-auto">
                        <div style={{ width: 180, height: 180 }}>
                          <Doughnut data={data} options={options} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-sm mt-4 md:mt-0 md:ml-8 items-start">
                        <div className="flex items-center gap-2 text-gray-800">
                          <span style={{ background: '#2563eb', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                          Fundos de investimento
                        </div>
                        <div className="flex items-center gap-2 text-gray-800">
                          <span style={{ background: '#f59e42', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                          Tesouro Direto
                        </div>
                        <div className="flex items-center gap-2 text-gray-800">
                          <span style={{ background: '#a21caf', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                          Previdência Privada
                        </div>
                        <div className="flex items-center gap-2 text-gray-800">
                          <span style={{ background: '#ef4444', width: 12, height: 12, borderRadius: 6, display: 'inline-block' }} />
                          Bolsa de Valores
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-tertiary-300 px-4 text-base w-full py-3 bg-tertiary-600 hover:bg-tertiary-700 text-white-50 font-medium rounded-lg shadow-md mt-10"
                    onClick={() => setShowModal(true)}
                  >
                    Novo Investimento
                  </button>
                </>
              )}
            </div>

            {/* Card Risco vs Retorno */}
            <div className="bg-primary-700 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
              <h2 className="text-lg font-semibold text-white mb-2 w-full text-center">Risco vs Retorno</h2>
              <div className="w-full flex flex-col items-center" style={{ minHeight: 220 }}>
                <div style={{ width: 320, height: 220 }}>
                  <Scatter data={scatterData} options={scatterOptions} />
                </div>
              </div>
              <div className="w-full mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {riskReturnData.map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-white text-base">
                      <span
                        style={{
                          background: item.color,
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          display: 'inline-block'
                        }}
                      />
                      {item.label}
                      <span className="ml-2 text-xs text-white">
                        (Risco: {item.risk}, Retorno: {item.return}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {hasInvestments && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
              <h2 className="text-lg font-bold text-primary-700 mb-4">Meus Investimentos</h2>
              <div className="flex flex-col gap-3">
                {investments
                  .filter(inv => inv.type !== 'COFRINHO')
                  .map(inv => (
                    <div key={inv.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-2 gap-2">
                      <div>
                        <span className="font-semibold">{inv.description || inv.type}</span>
                        <span className="ml-2 text-gray-500 text-xs">
                          {inv.date ? new Date(inv.date).toLocaleDateString('pt-BR') : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary-700">
                          R$ {inv.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs font-semibold"
                          onClick={() => openRedeemModal(inv)}
                          aria-label={`Resgatar investimento ${inv.description || inv.type}`}
                        >
                          Resgatar
                        </button>
                      </div>
                    </div>
                  ))}
                {investments.filter(inv => inv.type !== 'COFRINHO').length === 0 && (
                  <span className="text-gray-500 text-sm">Nenhum investimento disponível para resgate.</span>
                )}
              </div>
            </div>
          )}

          <div className="w-full mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card Análise de Transações */}
              <div className="bg-primary-700 rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
                <h2 className="text-xl font-bold text-white mb-4">Análise de Transações</h2>
                <div className="w-full flex flex-col items-center">
                  <Bar data={transferBarData} options={transferBarOptions} style={{ maxWidth: 400 }} />
                  <div className="text-white text-sm mt-4">
                    Total de transações: <span className="font-bold text-white">{transactionCount}</span>
                  </div>
                </div>
              </div>

              {/* Card Entradas vs Saídas */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px]">
                <h2 className="text-lg font-bold text-primary-700 mb-4 text-center">Entradas vs Saídas</h2>
                <div className="w-full flex flex-col items-center" style={{ height: 220 }}>
                  <Bar data={entradaSaidaData} options={entradaSaidaOptions} />
                </div>
                <div className="flex flex-col sm:flex-row justify-between w-full mt-4 text-base font-semibold gap-2">
                  <span className="flex items-center gap-2 text-green-700">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                    Entradas: R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="flex items-center gap-2 text-red-700">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                    Saídas: R$ {saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Card de Metas ocupando toda a largura */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center min-h-[420px] mt-8 w-full">
              <h2 className="text-lg font-bold text-primary-700 mb-4 text-center">Metas</h2>
              <div className="w-full flex flex-col gap-4">
                <form
                  className="bg-green-50 rounded p-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-end"
                  onSubmit={e => { e.preventDefault(); handleSaveGoal(); }}
                  aria-label="Nova Meta de Economia"
                >
                  <div className="flex-1 flex flex-col">
                    <label htmlFor="meta-valor" className="text-green-800 font-semibold mb-1">Valor da Meta</label>
                    <input
                      id="meta-valor"
                      type="number"
                      className="border rounded px-2 py-2 w-full text-base"
                      placeholder="Defina sua meta (R$)"
                      value={savingGoal}
                      onChange={e => setSavingGoal(e.target.value)}
                      min={1}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white rounded px-4 py-2 font-semibold mt-2 sm:mt-0 sm:ml-2 hover:bg-green-700 transition"
                  >
                    Salvar Meta
                  </button>
                </form>
              </div>
              {goals.length > 0 && (
                <div className="w-full mt-6 flex flex-col gap-4">
                  {goals.map((goal, idx) => {
                    const percent = Math.min(100, (goal.saved / goal.value) * 100);
                    let progressColor = 'bg-red-500';
                    if (percent >= 80) progressColor = 'bg-green-500';
                    else if (percent >= 40) progressColor = 'bg-yellow-400';

                    return (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col gap-3 shadow transition">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 gap-2">
                          <span className="font-semibold text-green-800">{goal.name}</span>
                          <div className="flex items-center gap-2">
                            {goal.deadline && (
                              <span className="text-xs text-gray-500">Prazo: {goal.deadline}</span>
                            )}
                            <button
                              className="text-red-600 hover:text-red-800 text-xs font-bold ml-2"
                              title="Excluir meta"
                              onClick={() => openDeleteGoalModal(idx)}
                              aria-label={`Excluir meta ${goal.name}`}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-700 mb-1 gap-2">
                          <span>Poupado: R$ {goal.saved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          <span>Meta: R$ {goal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="relative w-full bg-gray-100 rounded h-8 overflow-hidden mb-1">
                          <div
                            className={`${progressColor} h-8 rounded transition-all duration-500 flex items-center`}
                            style={{ width: `${percent}%`, minWidth: percent > 0 ? '2.5rem' : 0 }}
                          >
                            <span
                              className="text-xs font-bold text-white pl-2"
                              style={{
                                position: 'absolute',
                                left: percent > 10 ? `${percent / 2}%` : '8px',
                                color: percent > 10 ? '#fff' : '#333',
                                transition: 'left 0.3s'
                              }}
                            >
                              {percent.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          <input
                            ref={depositInputRef}
                            type="number"
                            min={1}
                            className="border rounded px-2 py-2 w-full sm:w-1/2 text-base"
                            placeholder="Depositar"
                            value={depositValues[idx] || ''}
                            onChange={e => setDepositValues(values => {
                              const arr = [...values];
                              arr[idx] = e.target.value;
                              return arr;
                            })}
                            aria-label={`Depositar na meta ${goal.name}`}
                          />
                          <button
                            className="bg-green-600 text-white rounded px-3 py-2 hover:bg-green-700 transition w-full sm:w-auto"
                            onClick={() => handleDeposit(idx)}
                            aria-label={`Depositar na meta ${goal.name}`}
                          >
                            Depositar
                          </button>
                          <input
                            type="number"
                            min={1}
                            className="border rounded px-2 py-2 w-full sm:w-1/2 text-base"
                            placeholder="Sacar"
                            value={withdrawValues[idx] || ''}
                            onChange={e => setWithdrawValues(values => {
                              const arr = [...values];
                              arr[idx] = e.target.value;
                              return arr;
                            })}
                            aria-label={`Sacar da meta ${goal.name}`}
                          />
                          <button
                            className="bg-yellow-500 text-white rounded px-3 py-2 hover:bg-yellow-600 transition w-full sm:w-auto"
                            onClick={() => handleWithdraw(idx)}
                            aria-label={`Sacar da meta ${goal.name}`}
                          >
                            Sacar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {widgetMessage && (
                <span className="text-xs text-green-700 mt-4 text-center">{widgetMessage}</span>
              )}
              <span className="text-xs text-gray-400 mt-4 text-center">
                Adicione e acompanhe suas metas de economia.
              </span>
              {showGoalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs relative">
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                      onClick={() => setShowGoalModal(false)}
                      aria-label="Fechar"
                    >
                      &times;
                    </button>
                    <h3 className="text-lg font-bold mb-4 text-primary-700">Nova Meta</h3>
                    <label className="block text-gray-700 mb-1" htmlFor="goalName">Nome da Meta</label>
                    <input
                      id="goalName"
                      className="w-full border rounded px-3 py-2 mb-3"
                      value={goalName}
                      onChange={e => setGoalName(e.target.value)}
                      placeholder="Ex: Viagem, Reserva, etc."
                      required
                    />
                    <label className="block text-gray-700 mb-1" htmlFor="goalDeadline">Prazo (opcional)</label>
                    <input
                      id="goalDeadline"
                      className="w-full border rounded px-3 py-2 mb-4"
                      value={goalDeadline}
                      onChange={e => setGoalDeadline(e.target.value)}
                      placeholder="Ex: 12/2024"
                    />
                    <button
                      className="bg-primary-700 text-white-50 px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-800 transition w-full"
                      onClick={handleConfirmGoal}
                    >
                      Criar Meta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
              <span className="block text-gray-600 text-sm mb-1">Saldo disponível:</span>
              <span className="text-lg font-bold text-primary-700">
                {accountBalance !== null
                  ? `R$ ${accountBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : 'Carregando...'}
              </span>
            </div>
            <form onSubmit={handleInvestmentSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="investmentType">Tipo de investimento</label>
                <select
                  id="investmentType"
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
                <label className="block text-gray-700 mb-1" htmlFor="investmentAmount">Valor</label>
                <input
                  id="investmentAmount"
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={investmentAmount}
                  onChange={e => setInvestmentAmount(e.target.value)}
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="investmentDesc">Descrição</label>
                <input
                  id="investmentDesc"
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

      {showInsufficientFunds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowInsufficientFunds(false)}
              aria-label="Fechar"
            >
              &times;
            </button>
            <div className="text-3xl mb-2 text-red-500">!</div>
            <h3 className="text-xl font-bold mb-2 text-primary-700">Saldo insuficiente</h3>
            <p className="text-gray-700 text-center mb-4">
              Você não possui saldo suficiente para realizar este investimento.
            </p>
            <button
              className="bg-primary-700 text-white-50 px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-800 transition"
              onClick={() => setShowInsufficientFunds(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && goalToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={closeDeleteGoalModal}
              aria-label="Fechar"
            >
              &times;
            </button>
            <div className="text-3xl mb-2 text-red-500">!</div>
            <h3 className="text-lg font-bold mb-2 text-primary-700">Excluir Meta?</h3>
            <p className="text-gray-700 text-center mb-4">
              Tem certeza que deseja excluir esta meta?<br />
              <span className="font-semibold">Todo o valor poupado será devolvido ao saldo da conta.</span>
            </p>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
                onClick={closeDeleteGoalModal}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition"
                onClick={confirmDeleteGoal}
              >
                Excluir Meta
              </button>
            </div>
          </div>
        </div>
      )}

      {showRedeemModal && investmentToRedeem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={closeRedeemModal}
              aria-label="Fechar"
            >
              &times;
            </button>
            <div className="text-3xl mb-2 text-yellow-500">!</div>
            <h3 className="text-lg font-bold mb-2 text-primary-700">Resgatar Investimento?</h3>
            <p className="text-gray-700 text-center mb-4">
              Tem certeza que deseja resgatar este investimento?<br />
              <span className="font-semibold">
                Valor a ser devolvido ao saldo: R$ {investmentToRedeem.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </p>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
                onClick={closeRedeemModal}
              >
                Cancelar
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition"
                onClick={handleRedeemInvestment}
              >
                Resgatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
