import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart, Calendar, Download, Filter, Search, ArrowUpRight, ArrowDownRight, Receipt, Wallet, Building, Target } from 'lucide-react';

const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const transactions = [
    {
      id: '1',
      type: 'income',
      description: 'Pagamento Cliente Alpha',
      amount: 25000,
      date: '2024-01-15',
      category: 'Vendas',
      status: 'completed',
      reference: 'INV-2024-001'
    },
    {
      id: '2',
      type: 'expense',
      description: 'Salários Janeiro',
      amount: 45000,
      date: '2024-01-15',
      category: 'Folha de Pagamento',
      status: 'completed',
      reference: 'PAY-2024-001'
    },
    {
      id: '3',
      type: 'income',
      description: 'Pagamento Cliente Beta',
      amount: 18000,
      date: '2024-01-14',
      category: 'Vendas',
      status: 'completed',
      reference: 'INV-2024-002'
    },
    {
      id: '4',
      type: 'expense',
      description: 'Aluguel Escritório',
      amount: 8500,
      date: '2024-01-10',
      category: 'Infraestrutura',
      status: 'completed',
      reference: 'RENT-2024-001'
    },
    {
      id: '5',
      type: 'expense',
      description: 'Software Licenses',
      amount: 3200,
      date: '2024-01-08',
      category: 'Tecnologia',
      status: 'pending',
      reference: 'SOFT-2024-001'
    }
  ];

  const budgets = [
    {
      category: 'Vendas & Marketing',
      allocated: 50000,
      spent: 32000,
      remaining: 18000,
      percentage: 64
    },
    {
      category: 'Folha de Pagamento',
      allocated: 120000,
      spent: 95000,
      remaining: 25000,
      percentage: 79
    },
    {
      category: 'Infraestrutura',
      allocated: 25000,
      spent: 18500,
      remaining: 6500,
      percentage: 74
    },
    {
      category: 'Tecnologia',
      allocated: 15000,
      spent: 8200,
      remaining: 6800,
      percentage: 55
    }
  ];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Gestão Financeira
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Controle completo das finanças da empresa
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
            <option value="1y">1 ano</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span onClick={() => setShowAddTransaction(true)}>Nova Transação</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Receita Total</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">+15% vs mês anterior</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Despesas Totais</p>
            <p className="text-xs text-red-600 dark:text-red-400">+8% vs mês anterior</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-amber-500 to-amber-600'} rounded-lg flex items-center justify-center`}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            {netProfit >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {formatCurrency(netProfit)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Lucro Líquido</p>
            <p className={`text-xs ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {profitMargin.toFixed(1)}% margem
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {formatCurrency(125000)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Caixa Atual</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Posição saudável</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Transações
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'budgets'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Orçamentos
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart Placeholder */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Receita vs Despesas</h3>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Download className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="h-64 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Gráfico de Receita vs Despesas</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Dados dos últimos 30 dias</p>
              </div>
            </div>
          </div>

          {/* Cash Flow */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Fluxo de Caixa</h3>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Download className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Entradas</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Este mês</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalIncome)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <ArrowDownRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Saídas</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Este mês</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Saldo Líquido</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Este mês</p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                />
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filtros</span>
              </button>
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Exportar</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Data</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Descrição</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Categoria</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Valor</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Referência</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            transaction.type === 'income' 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-semibold ${
                          transaction.type === 'income' 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {transaction.reference}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map((budget, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{budget.category}</h3>
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Orçado</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatCurrency(budget.allocated)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Gasto</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(budget.spent)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Restante</span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(budget.remaining)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-500">Utilização</span>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">
                        {budget.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          budget.percentage > 90 ? 'bg-red-500' :
                          budget.percentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${budget.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nova Transação</h2>
              <button
                onClick={() => setShowAddTransaction(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Descrição</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição da transação"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Valor</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categoria</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecionar categoria</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Folha de Pagamento">Folha de Pagamento</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Tecnologia">Tecnologia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Data</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowAddTransaction(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  console.log('Nova transação:', newTransaction);
                  setShowAddTransaction(false);
                  setNewTransaction({
                    type: 'income',
                    description: '',
                    amount: '',
                    category: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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