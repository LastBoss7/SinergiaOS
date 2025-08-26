import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart, Calendar, Download, Filter, Search, ArrowUpRight, ArrowDownRight, Receipt, Wallet, Building, Target, X } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
    case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'vendas': return <TrendingUp className="w-4 h-4" />;
    case 'marketing': return <Target className="w-4 h-4" />;
    case 'salários': return <Building className="w-4 h-4" />;
    case 'operações': return <Receipt className="w-4 h-4" />;
    case 'tecnologia': return <CreditCard className="w-4 h-4" />;
    default: return <DollarSign className="w-4 h-4" />;
  }
};

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface Budget {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 15000,
      category: 'Vendas',
      description: 'Pagamento Cliente ABC',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'expense',
      amount: 3500,
      category: 'Marketing',
      description: 'Campanha Google Ads',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'expense',
      amount: 8500,
      category: 'Salários',
      description: 'Folha de Pagamento Janeiro',
      date: '2024-01-13',
      status: 'pending'
    }
  ]);

  const [budgets] = useState<Budget[]>([
    { category: 'Marketing', allocated: 10000, spent: 7500, remaining: 2500 },
    { category: 'Salários', allocated: 50000, spent: 45000, remaining: 5000 },
    { category: 'Operações', allocated: 15000, spent: 12000, remaining: 3000 },
    { category: 'Tecnologia', allocated: 8000, spent: 5500, remaining: 2500 }
  ]);

  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const handleAddTransaction = () => {
    // Aqui você adicionaria a lógica para salvar no Supabase
    console.log('Nova transação:', newTransaction);
    setShowAddModal(false);
    setNewTransaction({
      type: 'income',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Financeiro</h1>
          <p className="text-slate-600 dark:text-slate-400">Gestão financeira completa da empresa</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Receita Total</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-600">+12.5%</span>
            <span className="text-sm text-slate-500">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Despesas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">+8.2%</span>
            <span className="text-sm text-slate-500">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Lucro Líquido</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(netProfit)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-600">{profitMargin.toFixed(1)}%</span>
            <span className="text-sm text-slate-500">margem</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Fluxo de Caixa</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">R$ 45.2k</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-600">Positivo</span>
            <span className="text-sm text-slate-500">este mês</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Visão Geral', icon: PieChart },
            { id: 'transactions', name: 'Transações', icon: Receipt },
            { id: 'budgets', name: 'Orçamentos', icon: Target },
            { id: 'reports', name: 'Relatórios', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Receitas vs Despesas */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Receitas vs Despesas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Receitas</span>
                <span className="text-sm font-medium text-emerald-600">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Despesas</span>
                <span className="text-sm font-medium text-red-600">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          {/* Distribuição por Categoria */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Distribuição por Categoria</h3>
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div key={budget.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(budget.category)}
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{budget.category}</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {formatCurrency(budget.spent)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* Filtros */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar transações..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <select className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas as categorias</option>
                <option value="vendas">Vendas</option>
                <option value="marketing">Marketing</option>
                <option value="salarios">Salários</option>
                <option value="operacoes">Operações</option>
              </select>
              <select className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os status</option>
                <option value="completed">Concluído</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Lista de Transações */}
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/20' 
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{transaction.description}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'completed' ? 'Concluído' : 
                         transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                      <span className="text-xs text-slate-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'budgets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgets.map((budget) => (
            <div key={budget.category} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(budget.category)}
                  <h3 className="font-semibold text-slate-900 dark:text-white">{budget.category}</h3>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {((budget.spent / budget.allocated) * 100).toFixed(0)}% usado
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Orçado</span>
                  <span className="font-medium">{formatCurrency(budget.allocated)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Gasto</span>
                  <span className="font-medium text-red-600">{formatCurrency(budget.spent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Restante</span>
                  <span className="font-medium text-emerald-600">{formatCurrency(budget.remaining)}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      (budget.spent / budget.allocated) > 0.9 ? 'bg-red-500' :
                      (budget.spent / budget.allocated) > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Relatórios Financeiros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'DRE - Demonstração do Resultado', period: 'Janeiro 2024', icon: TrendingUp },
              { name: 'Fluxo de Caixa', period: 'Últimos 30 dias', icon: Wallet },
              { name: 'Balanço Patrimonial', period: 'Q4 2023', icon: Building },
              { name: 'Análise de Custos', period: 'Janeiro 2024', icon: PieChart },
              { name: 'Projeção de Receitas', period: 'Q1 2024', icon: Target },
              { name: 'Relatório de Impostos', period: 'Anual 2023', icon: Receipt }
            ].map((report, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <report.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-medium text-slate-900 dark:text-white">{report.name}</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{report.period}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">Baixar PDF</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Adicionar Transação */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Nova Transação</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tipo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income' }))}
                    className={`p-3 rounded-lg border transition-colors ${
                      newTransaction.type === 'income'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">Receita</span>
                  </button>
                  <button
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense' }))}
                    className={`p-3 rounded-lg border transition-colors ${
                      newTransaction.type === 'expense'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">Despesa</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Valor
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0,00"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Categoria
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecionar categoria</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Salários">Salários</option>
                  <option value="Operações">Operações</option>
                  <option value="Tecnologia">Tecnologia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da transação"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;