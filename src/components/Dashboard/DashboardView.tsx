import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Clock, CheckCircle, AlertTriangle, Lightbulb, BarChart3, 
  Calendar, Target, DollarSign, Activity, Bell, Plus, Filter, RefreshCw,
  ArrowUp, ArrowDown, Zap, Star, Award, Timer, MessageSquare, FileText,
  PieChart, LineChart, BarChart, TrendingDown, Eye, EyeOff, Settings,
  Download, Share2, Maximize2, Minimize2, ChevronRight, PlayCircle
} from 'lucide-react';
import { mockInsights } from '../../data/mockData';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import TaskModal from '../Tasks/TaskModal';
import { Task } from '../../types';

const DashboardView: React.FC = () => {
  const { company } = useAuth();
  const [tasks, setTasks] = useState(mockTasks);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeWidgets, setActiveWidgets] = useState({
    stats: true,
    insights: true,
    projects: true,
    tasks: true,
    activity: true,
    analytics: true,
    calendar: true,
    team: true
  });
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [showNotifications, setShowNotifications] = useState(false);

  // Load dashboard data from Supabase
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!company?.id) return;

      try {
        // Load tasks
        const { data: tasksData } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:assignee_id(id, name, email),
            project:project_id(name)
          `)
          .eq('company_id', company.id)
          .limit(10);

        // Load projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('company_id', company.id);

        // Load users
        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .eq('company_id', company.id)
          .eq('is_active', true);

        if (tasksData) {
          const formattedTasks = tasksData.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignee: task.assignee,
            dueDate: task.due_date,
            project: task.project?.name || '',
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            companyId: task.company_id,
          }));
          setTasks(formattedTasks);
        }

        if (projectsData) {
          setProjects(projectsData);
        }

        if (usersData) {
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [company?.id]);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time notifications
      const newNotification = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'success' : 'info',
        title: Math.random() > 0.5 ? 'Nova tarefa concluída' : 'Reunião em 15 minutos',
        message: Math.random() > 0.5 ? 'João Costa finalizou "Implementar dashboard"' : 'Daily standup com a equipe de desenvolvimento',
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const overdueTasks = tasks.filter(task => task.status !== 'done' && task.dueDate && new Date(task.dueDate) < new Date()).length;
  const activeProjects = projects.filter(project => project.status === 'active').length;

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      setTasks(tasks.map(t => 
        t.id === selectedTask.id 
          ? { ...t, ...taskData }
          : t
      ));
    }
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const stats = [
    { 
      label: 'Projetos Ativos', 
      value: activeProjects, 
      icon: BarChart3, 
      color: 'blue',
      change: '+12%',
      trend: 'up',
      description: 'vs. mês anterior'
    },
    { 
      label: 'Tarefas Concluídas', 
      value: completedTasks, 
      icon: CheckCircle, 
      color: 'emerald',
      change: '+8%',
      trend: 'up',
      description: 'esta semana'
    },
    { 
      label: 'Receita Mensal', 
      value: 'R$ 45.2k', 
      icon: DollarSign, 
      color: 'purple',
      change: '+23%',
      trend: 'up',
      description: 'vs. mês anterior'
    },
    { 
      label: 'Equipe Ativa', 
      value: users.filter(u => u.status === 'online').length, 
      icon: Users, 
      color: 'amber',
      change: '100%',
      trend: 'stable',
      description: 'membros online'
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <TrendingUp className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      emerald: 'from-emerald-500 to-emerald-600',
      amber: 'from-amber-500 to-amber-600',
      purple: 'from-purple-500 to-purple-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-emerald-500" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-red-500" />;
      default: return <Activity className="w-3 h-3 text-slate-500" />;
    }
  };

  const quickActions = [
    { label: 'Nova Tarefa', icon: Plus, color: 'blue', action: () => setIsTaskModalOpen(true) },
    { label: 'Novo Projeto', icon: Target, color: 'emerald', action: () => {} },
    { label: 'Convidar Membro', icon: Users, color: 'purple', action: () => {} },
    { label: 'Relatório', icon: FileText, color: 'amber', action: () => {} },
  ];

  const recentActivity = [
    { user: 'João Costa', action: 'completou', target: 'Setup ambiente de produção', time: '2 min', type: 'task', avatar: 'JC' },
    { user: 'Maria Oliveira', action: 'criou', target: 'Wireframes da nova landing page', time: '15 min', type: 'design', avatar: 'MO' },
    { user: 'Carlos Santos', action: 'atualizou', target: 'Proposta comercial - Cliente X', time: '1 h', type: 'document', avatar: 'CS' },
    { user: 'Ana Silva', action: 'aprovou', target: 'Orçamento Q4 2024', time: '2 h', type: 'approval', avatar: 'AS' },
    { user: 'Pedro Almeida', action: 'comentou em', target: 'Reunião de planejamento', time: '3 h', type: 'comment', avatar: 'PA' },
  ];

  const upcomingEvents = [
    { title: 'Daily Standup', time: '09:00', type: 'meeting', attendees: 5 },
    { title: 'Review do Sprint', time: '14:00', type: 'review', attendees: 8 },
    { title: 'Apresentação para Cliente', time: '16:30', type: 'presentation', attendees: 3 },
    { title: 'One-on-One com Maria', time: '17:00', type: 'personal', attendees: 2 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
      {/* Header with Real-time Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-3">
            <span>Bom dia, Ana! 👋</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Sistema Online</span>
            </div>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 flex items-center space-x-4">
            <span>Aqui está o resumo das suas atividades de hoje.</span>
            <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
              {notifications.filter(n => !n.read).length} novas notificações
            </span>
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Hoje</option>
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
          </select>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-slide-up">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notificações</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                          <span className="text-xs text-slate-500 dark:text-slate-500 mt-2 block">
                            {notification.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 bg-gradient-to-r ${getStatColor(action.color)} text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 group`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{action.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${getStatColor(stat.color)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced AI Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Insights da IA
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Supabase Online</span>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            {mockInsights.map((insight, index) => (
              <div key={insight.id} className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                insight.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400' :
                insight.type === 'suggestion' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400' :
                insight.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400' :
                'bg-slate-50 dark:bg-slate-700/50 border-slate-400'
              }`}>
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                        {insight.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          insight.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(insight.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {insight.actionable && (
                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-1 hover:underline">
                          <PlayCircle className="w-3 h-3" />
                          <span>Executar Ação</span>
                        </button>
                      )}
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded transition-colors">
                          <Eye className="w-3 h-3 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded transition-colors">
                          <Share2 className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Agenda de Hoje</span>
            </h2>
            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
              {upcomingEvents.length} eventos
            </span>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold group-hover:scale-105 transition-transform">
                  {event.time.split(':')[0]}
                  <span className="text-xs">:{event.time.split(':')[1]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      event.type === 'review' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                      event.type === 'presentation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      {event.type === 'meeting' ? 'Reunião' :
                       event.type === 'review' ? 'Review' :
                       event.type === 'presentation' ? 'Apresentação' : 'Pessoal'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}</span>
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Project Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-500" />
              <span>Progresso dos Projetos</span>
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <BarChart className="w-4 h-4 text-slate-500" />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {projects.slice(0, 4).map((project, index) => (
              <div key={project.id} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'active' ? 'bg-emerald-400' :
                      project.status === 'paused' ? 'bg-amber-400' : 'bg-slate-400'
                    }`}></div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {project.progress}%
                    </span>
                    <div className="flex items-center space-x-1">
                      {project.progress >= 75 ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                      ) : project.progress >= 50 ? (
                        <Activity className="w-3 h-3 text-blue-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-amber-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      project.progress >= 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                      project.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      'bg-gradient-to-r from-amber-500 to-amber-600'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{project.team_members?.length || 0} membros</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(Math.random() * 30) + 1} dias restantes</span>
                    </div>
                  </div>
                  {project.dueDate && (
                    <span>Prazo: {new Date(project.dueDate).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Activity Feed */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <span>Atividade da Equipe</span>
            </h2>
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              Ver todas
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold group-hover:scale-105 transition-transform">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">{activity.action}</span>{' '}
                    <span className="font-medium text-blue-600 dark:text-blue-400">{activity.target}</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'task' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                      activity.type === 'design' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      activity.type === 'document' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      activity.type === 'approval' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {activity.type === 'task' ? 'Tarefa' :
                       activity.type === 'design' ? 'Design' :
                       activity.type === 'document' ? 'Documento' :
                       activity.type === 'approval' ? 'Aprovação' : 'Comentário'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time} atrás</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors">
                    <MessageSquare className="w-3 h-3 text-slate-500" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors">
                    <Star className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Recent Tasks */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <span>Tarefas Recentes</span>
          </h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Nova Tarefa</span>
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {tasks.slice(0, 6).map((task, index) => (
            <div 
              key={task.id} 
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer group hover:shadow-md"
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.status === 'done' ? 'bg-emerald-500 border-emerald-500' :
                  task.status === 'in-progress' ? 'bg-blue-500 border-blue-500' :
                  task.status === 'review' ? 'bg-amber-500 border-amber-500' : 
                  'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                }`}>
                  {task.status === 'done' && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">{task.project}</span>
                    {task.assignee && (
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                          {task.assignee.name.split(' ').map(n => n[0]).join('').slice(0, 1)}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{task.assignee.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  task.priority === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  task.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {task.priority === 'urgent' ? 'Urgente' :
                   task.priority === 'high' ? 'Alta' :
                   task.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
                
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.status === 'done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  task.status === 'review' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {task.status === 'done' ? 'Concluído' :
                   task.status === 'in-progress' ? 'Em Andamento' :
                   task.status === 'review' ? 'Em Revisão' : 'Para Fazer'}
                </span>
                
                {task.dueDate && (
                  <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                    <Timer className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
        </>
      )}
    </div>
  );
};

export default DashboardView;