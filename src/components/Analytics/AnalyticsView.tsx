import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Activity, Target, Users, DollarSign, Clock, Award, Zap, Brain, LineChart, Calendar, Download, Filter, RefreshCw, Eye, Settings, Maximize2, Share2, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, Percent, Timer, Star, Building, Package, MessageSquare, X as XCircle } from 'lucide-react';

const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('line');

  const kpis = [
    {
      name: 'Receita Recorrente Mensal (MRR)',
      value: 'R$ 125.4k',
      change: '+23.5%',
      trend: 'up',
      target: 'R$ 150k',
      progress: 83.6,
      category: 'financial',
      description: 'Receita mensal recorrente de assinaturas'
    },
    {
      name: 'Customer Acquisition Cost (CAC)',
      value: 'R$ 450',
      change: '-12.3%',
      trend: 'down',
      target: 'R$ 400',
      progress: 88.9,
      category: 'sales',
      description: 'Custo médio para adquirir um novo cliente'
    },
    {
      name: 'Lifetime Value (LTV)',
      value: 'R$ 8.2k',
      change: '+18.7%',
      trend: 'up',
      target: 'R$ 10k',
      progress: 82.0,
      category: 'sales',
      description: 'Valor total que um cliente gera durante sua vida útil'
    },
    {
      name: 'Net Promoter Score (NPS)',
      value: '72',
      change: '+8.2%',
      trend: 'up',
      target: '80',
      progress: 90.0,
      category: 'satisfaction',
      description: 'Índice de satisfação e recomendação dos clientes'
    },
    {
      name: 'Employee Productivity Index',
      value: '94.2%',
      change: '+5.1%',
      trend: 'up',
      target: '95%',
      progress: 99.2,
      category: 'hr',
      description: 'Índice de produtividade da equipe baseado em entregas'
    },
    {
      name: 'Burn Rate',
      value: 'R$ 85k',
      change: '+3.2%',
      trend: 'up',
      target: 'R$ 80k',
      progress: 94.1,
      category: 'financial',
      description: 'Taxa de queima de capital mensal'
    },
    {
      name: 'Churn Rate',
      value: '2.1%',
      change: '-0.8%',
      trend: 'down',
      target: '2%',
      progress: 95.2,
      category: 'retention',
      description: 'Taxa de cancelamento de clientes mensais'
    },
    {
      name: 'Time to Market',
      value: '45 dias',
      change: '-15.2%',
      trend: 'down',
      target: '40 dias',
      progress: 88.9,
      category: 'product',
      description: 'Tempo médio para lançar novos produtos/features'
    }
  ];

  const businessMetrics = [
    {
      category: 'Vendas & Marketing',
      metrics: [
        { name: 'Conversão de Leads', value: '12.5%', change: '+2.1%', trend: 'up' },
        { name: 'Ticket Médio', value: 'R$ 2.8k', change: '+15.3%', trend: 'up' },
        { name: 'ROI Marketing', value: '340%', change: '+45.2%', trend: 'up' },
        { name: 'Custo por Lead', value: 'R$ 85', change: '-8.7%', trend: 'down' }
      ]
    },
    {
      category: 'Operações',
      metrics: [
        { name: 'Eficiência Operacional', value: '87.3%', change: '+4.2%', trend: 'up' },
        { name: 'Tempo Médio de Entrega', value: '3.2 dias', change: '-12.5%', trend: 'down' },
        { name: 'Taxa de Erro', value: '0.8%', change: '-25.0%', trend: 'down' },
        { name: 'Utilização de Recursos', value: '92.1%', change: '+6.8%', trend: 'up' }
      ]
    },
    {
      category: 'Recursos Humanos',
      metrics: [
        { name: 'Satisfação da Equipe', value: '8.7/10', change: '+0.3', trend: 'up' },
        { name: 'Turnover Rate', value: '5.2%', change: '-2.1%', trend: 'down' },
        { name: 'Tempo de Contratação', value: '18 dias', change: '-5 dias', trend: 'down' },
        { name: 'Horas de Treinamento', value: '24h/mês', change: '+8h', trend: 'up' }
      ]
    },
    {
      category: 'Tecnologia',
      metrics: [
        { name: 'Uptime do Sistema', value: '99.8%', change: '+0.1%', trend: 'up' },
        { name: 'Velocidade de Deploy', value: '12 min', change: '-3 min', trend: 'down' },
        { name: 'Bug Rate', value: '0.3%', change: '-0.2%', trend: 'down' },
        { name: 'Code Coverage', value: '94.5%', change: '+2.1%', trend: 'up' }
      ]
    }
  ];

  const predictiveInsights = [
    {
      id: '1',
      type: 'forecast',
      title: 'Previsão de Receita Q2 2024',
      description: 'Com base no crescimento atual de 23.5% ao mês, a receita do Q2 deve atingir R$ 485k, superando a meta em 12%.',
      confidence: 87,
      impact: 'high',
      timeframe: '90 dias',
      category: 'financial'
    },
    {
      id: '2',
      type: 'risk',
      title: 'Risco de Churn Identificado',
      description: '3 clientes enterprise mostram sinais de insatisfação. Probabilidade de churn de 65% nos próximos 30 dias.',
      confidence: 92,
      impact: 'high',
      timeframe: '30 dias',
      category: 'retention'
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Oportunidade de Upsell',
      description: '12 clientes atuais têm perfil ideal para upgrade para plano Enterprise. Potencial de +R$ 45k MRR.',
      confidence: 78,
      impact: 'medium',
      timeframe: '60 dias',
      category: 'sales'
    },
    {
      id: '4',
      type: 'optimization',
      title: 'Otimização de Processos',
      description: 'Automatização do processo de onboarding pode reduzir tempo em 40% e custo em R$ 2.3k por cliente.',
      confidence: 85,
      impact: 'medium',
      timeframe: '45 dias',
      category: 'operations'
    }
  ];

  const competitorAnalysis = [
    {
      competitor: 'Concorrente A',
      marketShare: 35,
      pricing: 'Premium',
      strengths: ['Brand Recognition', 'Enterprise Features'],
      weaknesses: ['High Price', 'Complex UI'],
      threat: 'medium'
    },
    {
      competitor: 'Concorrente B',
      marketShare: 28,
      pricing: 'Competitive',
      strengths: ['Good UX', 'Fast Support'],
      weaknesses: ['Limited Features', 'Scalability'],
      threat: 'high'
    },
    {
      competitor: 'Concorrente C',
      marketShare: 15,
      pricing: 'Low Cost',
      strengths: ['Price', 'Simple Setup'],
      weaknesses: ['Basic Features', 'Poor Support'],
      threat: 'low'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'from-emerald-500 to-emerald-600';
      case 'sales': return 'from-blue-500 to-blue-600';
      case 'hr': return 'from-purple-500 to-purple-600';
      case 'operations': return 'from-amber-500 to-amber-600';
      case 'satisfaction': return 'from-pink-500 to-pink-600';
      case 'retention': return 'from-indigo-500 to-indigo-600';
      case 'product': return 'from-cyan-500 to-cyan-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return DollarSign;
      case 'sales': return Target;
      case 'hr': return Users;
      case 'operations': return Package;
      case 'satisfaction': return Star;
      case 'retention': return Award;
      case 'product': return Zap;
      default: return Activity;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'forecast': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'opportunity': return Target;
      case 'optimization': return Zap;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'forecast': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'risk': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'opportunity': return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'optimization': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics Avançado
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Business Intelligence e análise preditiva com IA
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
            <Brain className="w-4 h-4" />
            <span>Gerar Insights</span>
          </button>
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
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'kpis'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          KPIs Empresariais
        </button>
        <button
          onClick={() => setActiveTab('predictive')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'predictive'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          IA Preditiva
        </button>
        <button
          onClick={() => setActiveTab('competitor')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'competitor'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Análise Competitiva
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Receita vs Despesas</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded-lg transition-colors ${
                      chartType === 'line' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <LineChart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`p-2 rounded-lg transition-colors ${
                      chartType === 'bar' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Gráfico Interativo</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Receita: +23.5% | Despesas: +8.2%</p>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Receita</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Despesas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance da Equipe</h3>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Maximize2 className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Produtividade da Equipe</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Média: 94.2% | Meta: 95%</p>
                  <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mx-auto mt-4">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessMetrics.map((category) => (
              <div key={category.category} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{category.category}</h4>
                <div className="space-y-4">
                  {category.metrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{metric.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{metric.value}</span>
                          <div className="flex items-center space-x-1">
                            {metric.trend === 'up' ? (
                              <ArrowUp className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-red-500" />
                            )}
                            <span className={`text-xs ${
                              metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPIs Tab */}
      {activeTab === 'kpis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = getCategoryIcon(kpi.category);
            return (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(kpi.category)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {kpi.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {kpi.value}
                    </h3>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">{kpi.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {kpi.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-500">Meta: {kpi.target}</span>
                      <span className="text-slate-900 dark:text-white font-medium">{kpi.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          kpi.progress >= 90 ? 'bg-emerald-500' :
                          kpi.progress >= 70 ? 'bg-blue-500' :
                          kpi.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Predictive Analytics Tab */}
      {activeTab === 'predictive' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">IA Preditiva InsightOS</h2>
                <p className="text-sm text-blue-700 dark:text-blue-300">Análises baseadas em machine learning e dados históricos</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">87%</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Precisão Média</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">24</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Insights Gerados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">R$ 2.3M</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Valor Identificado</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictiveInsights.map((insight) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <div key={insight.id} className={`rounded-xl p-6 border-2 ${getInsightColor(insight.type)} hover:shadow-lg transition-all duration-200 cursor-pointer group`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        insight.type === 'forecast' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        insight.type === 'risk' ? 'bg-red-100 dark:bg-red-900/30' :
                        insight.type === 'opportunity' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          insight.type === 'forecast' ? 'text-blue-600 dark:text-blue-400' :
                          insight.type === 'risk' ? 'text-red-600 dark:text-red-400' :
                          insight.type === 'opportunity' ? 'text-emerald-600 dark:text-emerald-400' :
                          'text-amber-600 dark:text-amber-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {insight.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            insight.impact === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                          }`}>
                            {insight.impact === 'high' ? 'Alto Impacto' : insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-500">{insight.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Brain className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{insight.confidence}%</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Confiança</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {insight.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          insight.confidence >= 90 ? 'bg-emerald-500' :
                          insight.confidence >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${insight.confidence}%` }}
                      ></div>
                    </div>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                      Ver Detalhes →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Competitor Analysis Tab */}
      {activeTab === 'competitor' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Análise Competitiva</h3>
            <div className="space-y-6">
              {competitorAnalysis.map((competitor, index) => (
                <div key={index} className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {competitor.competitor.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{competitor.competitor}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Market Share: {competitor.marketShare}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getThreatColor(competitor.threat)}`}>
                        Ameaça {competitor.threat === 'high' ? 'Alta' : competitor.threat === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Preços</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        competitor.pricing === 'Premium' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        competitor.pricing === 'Competitive' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }`}>
                        {competitor.pricing}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Pontos Fortes</p>
                      <div className="space-y-1">
                        {competitor.strengths.map((strength, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Pontos Fracos</p>
                      <div className="space-y-1">
                        {competitor.weaknesses.map((weakness, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <XCircle className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 dark:text-slate-500">Market Share</p>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{competitor.marketShare}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${competitor.marketShare}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;