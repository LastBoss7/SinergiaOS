import React, { useState } from 'react';
import { Plus, Calendar, Users, BarChart3, Target, Clock, ChevronRight, Filter, Search, CheckCircle, AlertTriangle, Timer, Star } from 'lucide-react';
import { mockProjects, mockTasks } from '../../data/mockData';

const MobileProjects: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const filteredTasks = selectedProject === 'all' 
    ? mockTasks 
    : mockTasks.filter(task => task.project === selectedProject);

  return (
    <div className="pb-20 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-xl font-bold mb-2">Projetos & Tarefas</h1>
        <p className="text-blue-100">Acompanhe o progresso da equipe</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'projects'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Projetos
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Tarefas
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    project.status === 'active' ? 'bg-emerald-400' :
                    project.status === 'paused' ? 'bg-amber-400' : 'bg-slate-400'
                  }`}></div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.name}</h3>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{project.progress}%</span>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
              
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    project.progress >= 75 ? 'bg-emerald-500' :
                    project.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{project.team.length} membros</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 30) + 1} dias</span>
                  </div>
                </div>
                {project.dueDate && (
                  <span>{new Date(project.dueDate).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Projetos</option>
              {mockProjects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
            <button className="p-2 bg-blue-600 text-white rounded-lg">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white pr-2 flex-1">
                    {task.title}
                  </h4>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0 mt-2`}></div>
                </div>
                
                {task.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                    {task.description.slice(0, 80)}...
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                      {task.status === 'in-progress' ? 'Em Andamento' :
                       task.status === 'review' ? 'Em Revisão' :
                       task.status === 'done' ? 'Concluído' : 'Para Fazer'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">{task.project}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {task.assignee && (
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                        {task.assignee.name.split(' ').map(n => n[0]).join('').slice(0, 1)}
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-500">
                        <Timer className="w-3 h-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProjects;