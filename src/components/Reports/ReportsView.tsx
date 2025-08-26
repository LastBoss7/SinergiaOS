import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter, FileText, DollarSign, Users, Target, Clock, Award, Building, Activity } from 'lucide-react';

const ReportsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('financial');
  const [timeRange, setTimeRange] = useState('30d');

  const reportCategories = [
    { id: 'financial', name: 'Financeiro', icon: DollarSign, color: 'emerald' },
    { id: 'sales', name: 'Vendas', icon: Target, color: 'blue' },
    { id: 'hr', name: 'Recursos Humanos', icon: Users, color: 'purple' },
    { id: 'projects', name: 'Projetos', icon: BarChart3, color: 'amber' },
    { id: 'performance', name: 'Performance', icon: Award, color: 'red' }
  ];

  const financialReports = [
    {
      id: '1',
      name: 'Demonstrativo de Resultados',
      description: 'Receitas, despesas e lucro líquido detalhado',
      type: 'DRE',
      lastGenerated: '2024-01-15',
      format: 'PDF',
      size: '2.3 MB'
    },
    {
      id: '2',
      name: 'Fluxo de Caixa',
      description: 'Entradas e saídas de caixa por período',
      type: 'Cash Flow',
      lastGenerated: '2024-01-14',
      format: 'Excel',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Análise de Custos',
      description: 'Breakdown detalhado de custos por categoria',
      type: 'Cost Analysis',
      lastGenerated: '2024-01-13',
      format: 'PDF',
      size: '3.1 MB'
    }
  ];

  const salesReports = [
    {
      id: '4',
      name: 'Pipeline de Vendas',
      description: 'Status de todas as oportunidades em andamento',
      type: 'Sales Pipeline',
      lastGenerated: '2024-01-15',
      format: 'PDF',
      size: '1.9 MB'
    },
    {
      id: '5',
      name: 'Performance de Vendedores',
      description: 'Métricas individuais da equipe de vendas',
      type: 'Sales Performance',
      lastGenerated: '2024-01-14',
      format: 'Excel',
      size: '2.2 MB'
    }
  ];

  const hrReports = [
    {
      id: '6',
      name: 'Relatório de Folha de Pagamento',
      description: 'Detalhamento completo da folha mensal',
      type: 'Payroll',
      lastGenerated: '2024-01-15',
      format: 'PDF',
      size: '4.5 MB'
    },
    {
      id: '7',
      name: 'Análise de Performance',
      description: 'Avaliações e métricas de desempenho',
      type: 'Performance Review',
      lastGenerated: '2024-01-12',
      format: 'Excel',
      size: '1.7 MB'
    }
  ];

  const projectReports = [
    {
      id: '8',
      name: 'Status de Projetos',
      description: 'Progresso e timeline de todos os projetos',
      type: 'Project Status',
      lastGenerated: '2024-01-15',
      format: 'PDF',
      size: '3.8 MB'
    },
    {
      id: '9',
      name: 'Controle de Horas',
      description: 'Horas trabalhadas por projeto e funcionário',
      type: 'Time Tracking',
      lastGenerated: '2024-01-14',
      format: 'Excel',
      size: '2.1 MB'
    }
  ];

  const performanceReports = [
    {
      id: '10',
      name: 'KPIs Empresariais',
      description: 'Principais indicadores de performance',
      type: 'KPI Dashboard',
      lastGenerated: '2024-01-15',
      format: 'PDF',
      size: '2.7 MB'
    },
    {
      id: '11',
      name: 'Análise de Produtividade',
      description: 'Métricas de produtividade por equipe',
      type: 'Productivity Analysis',
      lastGenerated: '2024-01-13',
      format: 'Excel',
      size: '1.9 MB'
    }
  ];

  const getReportsByCategory = (category: string) => {
    switch (category) {
      case 'financial': return financialReports;
      case 'sales': return salesReports;
      case 'hr': return hrReports;
      case 'projects': return projectReports;
      case 'performance': return performanceReports;
      default: return financialReports;
    }
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      emerald: 'from-emerald-500 to-emerald-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      amber: 'from-amber-500 to-amber-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const quickStats = [
    { label: 'Relatórios Gerados', value: '47', change: '+12%', icon: FileText, color: 'blue' },
    { label: 'Downloads Este Mês', value: '156', change: '+23%', icon: Download, color: 'emerald' },
    { label: 'Relatórios Agendados', value: '8', change: '+2', icon: Calendar, color: 'purple' },
    { label: 'Tempo Médio de Geração', value: '2.3s', change: '-15%', icon: Clock, color: 'amber' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Relatórios & Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Relatórios detalhados e análises de negócio
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
            <FileText className="w-4 h-4" />
            <span>Novo Relatório</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(stat.color)} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{stat.change} vs mês anterior</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getReportsByCategory(activeCategory).map((report) => (
          <div key={report.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(reportCategories.find(c => c.id === activeCategory)?.color || 'blue')} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {report.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{report.type}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <Download className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              {report.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3" />
                  <span>Última geração: {new Date(report.lastGenerated).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>{report.format}</span>
                  <span>•</span>
                  <span>{report.size}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                  <Activity className="w-4 h-4" />
                  <span>Visualizar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Relatórios Agendados
          </h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            Gerenciar Agendamentos
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'DRE Mensal', frequency: 'Mensal', nextRun: '2024-02-01', status: 'active' },
            { name: 'Relatório de Vendas', frequency: 'Semanal', nextRun: '2024-01-22', status: 'active' },
            { name: 'Performance da Equipe', frequency: 'Quinzenal', nextRun: '2024-01-30', status: 'paused' }
          ].map((scheduled, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">{scheduled.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {scheduled.frequency} • Próxima execução: {new Date(scheduled.nextRun).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  scheduled.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                }`}>
                  {scheduled.status === 'active' ? 'Ativo' : 'Pausado'}
                </span>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors">
                  <Filter className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;