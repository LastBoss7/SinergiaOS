import React, { useState } from 'react';
import { TrendingUp, Users, CheckCircle, DollarSign, Plus, Bell, Calendar, Target, Activity, ArrowRight, Clock, Star, Zap, BarChart3, AlertTriangle, Award } from 'lucide-react';
import { mockInsights, mockTasks, mockProjects } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const MobileDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showAllInsights, setShowAllInsights] = useState(false);

  const quickStats = [
    { label: 'Projetos', value: '4', icon: BarChart3, color: 'blue', change: '+2' },
    { label: 'Tarefas', value: '23', icon: CheckCircle, color: 'emerald', change: '+8' },
    { label: 'Receita', value: 'R$ 45k', icon: DollarSign, color: 'purple', change: '+23%' },
    { label: 'Equipe', value: '6', icon: Users, color: 'amber', change: '+1' },
  ];

  const quickActions = [
    { label: 'Nova Tarefa', icon: Plus, color: 'blue' },
    { label: 'Novo Projeto', icon: Target, color: 'emerald' },
    { label: 'Convidar', icon: Users, color: 'purple' },
    { label: 'Relatório', icon: BarChart3, color: 'amber' },
  ];

  const upcomingTasks = mockTasks.filter(task => task.status !== 'done').slice(0, 3);
  const recentInsights = mockInsights.slice(0, 2);

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      emerald: 'from-emerald-500 to-emerald-600',
      purple: 'from-purple-500 to-purple-600',
      amber: 'from-amber-500 to-amber-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'suggestion': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'success': return <Award className="w-4 h-4 text-emerald-500" />;
      default: return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="pb-20 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">
              Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋
            </h2>
            <p className="text-blue-100">
              Aqui está o resumo do seu dia
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-blue-100">Sistema Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="text-blue-100">Última sync: agora</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${getStatColor(stat.color)} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className={`p-4 bg-gradient-to-r ${getStatColor(action.color)} text-white rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span>Insights da IA</span>
          </h3>
          <button
            onClick={() => setShowAllInsights(!showAllInsights)}
            className="text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            {showAllInsights ? 'Ver menos' : 'Ver todos'}
          </button>
        </div>
        
        <div className="space-y-3">
          {(showAllInsights ? mockInsights : recentInsights).map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
              insight.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400' :
              insight.type === 'suggestion' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400' :
              insight.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400' :
              'bg-slate-50 dark:bg-slate-700/50 border-slate-400'
            }`}>
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {insight.description.slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      insight.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center space-x-1">
                      <span>Ver mais</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Próximas Tarefas</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Ver todas
          </button>
        </div>
        
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white pr-2">
                  {task.title}
                </h4>
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'urgent' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-amber-500' :
                  task.priority === 'medium' ? 'bg-blue-500' : 'bg-slate-400'
                }`}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    task.status === 'review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {task.status === 'in-progress' ? 'Em Andamento' :
                     task.status === 'review' ? 'Em Revisão' : 'Para Fazer'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">{task.project}</span>
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Projetos em Andamento</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Ver todos
          </button>
        </div>
        
        <div className="space-y-4">
          {mockProjects.slice(0, 3).map((project) => (
            <div key={project.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">{project.name}</h4>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {project.progress}%
                </span>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    project.progress >= 75 ? 'bg-emerald-500' :
                    project.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{project.team.length} membros</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    project.status === 'active' ? 'bg-emerald-400' :
                    project.status === 'paused' ? 'bg-amber-400' : 'bg-slate-400'
                  }`}></div>
                </div>
                {project.dueDate && (
                  <span>{new Date(project.dueDate).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;