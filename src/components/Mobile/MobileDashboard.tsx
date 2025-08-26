import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Bell,
  Calendar,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

export default function MobileDashboard() {
  const [notifications] = useState(3);

  const stats = [
    {
      title: 'Receita Mensal',
      value: 'R$ 45.2K',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Projetos Ativos',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Tarefas Pendentes',
      value: '23',
      change: '-5',
      trend: 'down',
      icon: CheckCircle,
      color: 'text-orange-600'
    },
    {
      title: 'Equipe Online',
      value: '12/15',
      change: '80%',
      trend: 'stable',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const quickActions = [
    { icon: Plus, label: 'Nova Tarefa', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Agendar', color: 'bg-green-500' },
    { icon: BarChart3, label: 'Relatório', color: 'bg-purple-500' },
    { icon: Bell, label: 'Notificações', color: 'bg-orange-500', badge: notifications }
  ];

  const recentTasks = [
    {
      id: 1,
      title: 'Revisar proposta comercial',
      project: 'Cliente ABC',
      priority: 'high',
      dueDate: 'Hoje',
      status: 'in_progress'
    },
    {
      id: 2,
      title: 'Atualizar dashboard financeiro',
      project: 'Sistema Interno',
      priority: 'medium',
      dueDate: 'Amanhã',
      status: 'todo'
    },
    {
      id: 3,
      title: 'Reunião com equipe de vendas',
      project: 'Estratégia Q1',
      priority: 'high',
      dueDate: '2 dias',
      status: 'scheduled'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunião de Planejamento',
      time: '14:00',
      attendees: 5,
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Apresentação para Cliente',
      time: '16:30',
      attendees: 3,
      type: 'presentation'
    },
    {
      id: 3,
      title: 'Review Semanal',
      time: '18:00',
      attendees: 8,
      type: 'review'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'todo': return 'text-gray-600';
      case 'scheduled': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Olá, João! 👋</h1>
            <p className="text-blue-100">Aqui está o resumo do seu dia</p>
          </div>
          <div className="relative">
            <Bell className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-yellow-300" />
            <div>
              <p className="font-semibold">Produtividade Hoje</p>
              <p className="text-sm text-blue-100">85% - Excelente performance!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' :
                  stat.trend === 'down' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' :
                  'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="relative flex flex-col items-center p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
                {action.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Agenda de Hoje</h3>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white text-sm">{event.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{event.time} • {event.attendees} participantes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tarefas Recentes</h3>
          <CheckCircle className="w-5 h-5 text-slate-400" />
        </div>
        <div className="space-y-3">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white text-sm">{task.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">{task.project}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600 dark:text-slate-400">{task.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Insights de Performance</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm font-medium">Tarefas Concluídas Esta Semana</p>
            <p className="text-2xl font-bold">47</p>
            <p className="text-xs text-green-100">+23% vs semana anterior</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm font-medium">Tempo Médio por Tarefa</p>
            <p className="text-2xl font-bold">2.3h</p>
            <p className="text-xs text-green-100">-15 min vs média mensal</p>
          </div>
        </div>
      </div>
    </div>
  );
}