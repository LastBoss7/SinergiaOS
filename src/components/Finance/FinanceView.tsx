import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart, Calendar, Download, Filter, Search, ArrowUpRight, ArrowDownRight, Receipt, Wallet, Building, Target, X } from 'lucide-react';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestão financeira completa da empresa</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(totalIncome / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+12.5%</span>
            <span className="text-sm text-gray-500">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Despesas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(totalExpenses / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">+8.2%</span>
            <span className="text-sm text-gray-500">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lucro Líquido</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(netProfit / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">{profitMargin.toFixed(1)}%</span>
            <span className="text-sm text-gray-500">margem</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fluxo de Caixa</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 45.2k</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">Positivo</span>
            <span className="text-sm text-gray-500">este mês</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receitas vs Despesas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Receitas</span>
                <span className="text-sm font-medium text-green-600">R$ {(totalIncome / 1000).toFixed(1)}k</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Despesas</span>
                <span className="text-sm font-medium text-red-600">R$ {(totalExpenses / 1000).toFixed(1)}k</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          {/* Distribuição por Categoria */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição por Categoria</h3>
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div key={budget.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(budget.category)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{budget.category}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    R$ {(budget.spent / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {/* Filtros */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar transações..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todas as categorias</option>
                <option value="vendas">Vendas</option>
                <option value="marketing">Marketing</option>
                <option value="salarios">Salários</option>
                <option value="operacoes">Operações</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Todos os status</option>
                <option value="completed">Concluído</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Lista de Transações */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 dark:bg-green-900/20' 
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'completed' ? 'Concluído' : 
                         transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                      <span className="text-xs text-gray-500">{transaction.date}</span>
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
            <div key={budget.category} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(budget.category)}
                  <h3 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {((budget.spent / budget.allocated) * 100).toFixed(0)}% usado
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Orçado</span>
                  <span className="font-medium">R$ {budget.allocated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Gasto</span>
                  <span className="font-medium text-red-600">R$ {budget.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Restante</span>
                  <span className="font-medium text-green-600">R$ {budget.remaining.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (budget.spent / budget.allocated) > 0.9 ? 'bg-red-500' :
                      (budget.spent / budget.allocated) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Relatórios Financeiros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'DRE - Demonstração do Resultado', period: 'Janeiro 2024', icon: TrendingUp },
              { name: 'Fluxo de Caixa', period: 'Últimos 30 dias', icon: Wallet },
              { name: 'Balanço Patrimonial', period: 'Q4 2023', icon: Building },
              { name: 'Análise de Custos', period: 'Janeiro 2024', icon: PieChart },
              { name: 'Projeção de Receitas', period: 'Q1 2024', icon: Target },
              { name: 'Relatório de Impostos', period: 'Anual 2023', icon: Receipt }
            ].map((report, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <report.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{report.period}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Download className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Baixar PDF</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Adicionar Transação */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nova Transação</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income' }))}
                    className={`p-3 rounded-lg border transition-colors ${
                      newTransaction.type === 'income'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">Despesa</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0,00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da transação"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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