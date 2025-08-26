import React, { useState } from 'react';
import { Plus, Users, Calendar, Clock, Award, TrendingUp, Search, Filter, UserCheck, AlertCircle, Star, Target, BookOpen, Coffee } from 'lucide-react';

const HRView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const employees = [
    {
      id: '1',
      name: 'João Costa',
      position: 'Desenvolvedor Full-Stack',
      department: 'Desenvolvimento',
      hireDate: '2023-06-15',
      salary: 8500,
      performance: 92,
      status: 'active',
      vacationDays: 15,
      usedVacation: 5,
      benefits: ['Plano de Saúde', 'VR', 'Home Office']
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      position: 'UX Designer',
      department: 'Design',
      hireDate: '2023-03-10',
      salary: 7200,
      performance: 88,
      status: 'active',
      vacationDays: 20,
      usedVacation: 8,
      benefits: ['Plano de Saúde', 'VR', 'Auxílio Educação']
    },
    {
      id: '3',
      name: 'Carlos Santos',
      position: 'Gerente de Vendas',
      department: 'Vendas',
      hireDate: '2023-02-20',
      salary: 12000,
      performance: 95,
      status: 'active',
      vacationDays: 25,
      usedVacation: 12,
      benefits: ['Plano de Saúde', 'VR', 'Carro da Empresa']
    }
  ];

  const vacationRequests = [
    {
      id: '1',
      employee: 'João Costa',
      startDate: '2024-02-15',
      endDate: '2024-02-25',
      days: 8,
      reason: 'Férias familiares',
      status: 'pending',
      requestDate: '2024-01-15'
    },
    {
      id: '2',
      employee: 'Maria Oliveira',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
      days: 5,
      reason: 'Descanso pessoal',
      status: 'approved',
      requestDate: '2024-01-10'
    }
  ];

  const performanceReviews = [
    {
      id: '1',
      employee: 'João Costa',
      period: 'Q4 2023',
      score: 92,
      goals: 4,
      completedGoals: 4,
      feedback: 'Excelente performance técnica e colaboração em equipe',
      nextReview: '2024-04-01'
    },
    {
      id: '2',
      employee: 'Maria Oliveira',
      period: 'Q4 2023',
      score: 88,
      goals: 3,
      completedGoals: 3,
      feedback: 'Ótima criatividade e entrega de projetos no prazo',
      nextReview: '2024-04-01'
    }
  ];

  const totalEmployees = employees.length;
  const avgPerformance = employees.reduce((sum, emp) => sum + emp.performance, 0) / employees.length;
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const pendingRequests = vacationRequests.filter(req => req.status === 'pending').length;

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
            Recursos Humanos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gestão completa de pessoas e performance
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Novo Funcionário</span>
        </button>
      </div>

      {/* HR Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {totalEmployees}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Funcionários Ativos</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">+2 este mês</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {avgPerformance.toFixed(0)}%
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Performance Média</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">+5% vs trimestre anterior</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {pendingRequests}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Solicitações Pendentes</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Requer aprovação</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {formatCurrency(totalPayroll)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Folha de Pagamento</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Mensal</p>
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
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'employees'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Funcionários
        </button>
        <button
          onClick={() => setActiveTab('vacation')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'vacation'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Férias
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'performance'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Performance
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Distribuição por Departamento</h3>
            <div className="space-y-4">
              {['Desenvolvimento', 'Design', 'Vendas', 'Marketing'].map((dept, index) => {
                const count = employees.filter(emp => emp.department === dept).length;
                const percentage = (count / totalEmployees) * 100;
                return (
                  <div key={dept} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{dept}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{count} pessoas</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-emerald-500' :
                          index === 2 ? 'bg-purple-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Atividades Recentes</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Novo funcionário contratado</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Pedro Almeida - Gerente de Operações</p>
                </div>
                <span className="text-xs text-slate-500">2h atrás</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Solicitação de férias aprovada</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Maria Oliveira - 5 dias em março</p>
                </div>
                <span className="text-xs text-slate-500">1 dia atrás</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Avaliação de performance concluída</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">João Costa - Score: 92%</p>
                </div>
                <span className="text-xs text-slate-500">3 dias atrás</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar funcionários..."
                  className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                />
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filtros</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Funcionário</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Cargo</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Departamento</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Salário</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Performance</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Férias</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">{employee.name}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Desde {new Date(employee.hireDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-900 dark:text-white">{employee.position}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{employee.department}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {formatCurrency(employee.salary)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                employee.performance >= 90 ? 'bg-emerald-500' :
                                employee.performance >= 80 ? 'bg-blue-500' :
                                employee.performance >= 70 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${employee.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{employee.performance}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <span className="text-slate-900 dark:text-white">{employee.usedVacation}</span>
                          <span className="text-slate-600 dark:text-slate-400">/{employee.vacationDays} dias</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vacation Tab */}
      {activeTab === 'vacation' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Solicitações de Férias</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Funcionário</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Período</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Dias</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Motivo</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vacationRequests.map((request) => (
                    <tr key={request.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{request.employee}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(request.startDate).toLocaleDateString('pt-BR')} - {new Date(request.endDate).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-900 dark:text-white">{request.days} dias</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{request.reason}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : request.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {request.status === 'approved' ? 'Aprovado' :
                           request.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                        </span>
                      </td>
                      <td className="p-4">
                        {request.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded transition-colors">
                              Aprovar
                            </button>
                            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Avaliações de Performance</h3>
            </div>
            <div className="p-6 space-y-6">
              {performanceReviews.map((review) => (
                <div key={review.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {review.employee.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{review.employee}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{review.period}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="w-5 h-5 text-amber-400 fill-current" />
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{review.score}%</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Score Geral</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Metas Atingidas</h5>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${(review.completedGoals / review.goals) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {review.completedGoals}/{review.goals}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Próxima Avaliação</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(review.nextReview).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Feedback</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{review.feedback}</p>
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

export default HRView;