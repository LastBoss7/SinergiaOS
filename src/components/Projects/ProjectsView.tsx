import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus, Filter, Search, Calendar, Users, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import ProjectModal from './ProjectModal';
import TaskModal from '../Tasks/TaskModal';
import { Project, Task } from '../../types';

const ProjectsView: React.FC = () => {
  const { company } = useAuth();
  const [activeTab, setActiveTab] = useState<'board' | 'list'>('board');
  const [selectedProject, setSelectedProject] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  const columns = [
    { id: 'todo', title: 'Para Fazer', color: 'slate' },
    { id: 'in-progress', title: 'Em Andamento', color: 'blue' },
    { id: 'review', title: 'Em Revisão', color: 'amber' },
    { id: 'done', title: 'Concluído', color: 'emerald' },
  ];

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!company?.id) return;

      try {
        // Load projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            manager:manager_id(id, name, email)
          `)
          .eq('company_id', company.id);

        if (projectsError) throw projectsError;

        // Load tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:assignee_id(id, name, email),
            reporter:reporter_id(id, name, email),
            project:project_id(name)
          `)
          .eq('company_id', company.id);

        if (tasksError) throw tasksError;

        // Format projects data
        const formattedProjects: Project[] = projectsData.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description || '',
          status: project.status as any,
          progress: project.progress,
          team: [], // Will be populated from team_members array
          manager: project.manager as any,
          budget: project.budget,
          spent: project.spent,
          createdAt: project.created_at,
          dueDate: project.due_date,
          companyId: project.company_id,
          client: project.client,
          tags: project.tags || [],
        }));

        // Format tasks data
        const formattedTasks: Task[] = tasksData.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status as any,
          priority: task.priority as any,
          assignee: task.assignee as any,
          reporter: task.reporter as any,
          dueDate: task.due_date,
          project: task.project?.name || '',
          tags: task.tags || [],
          timeTracked: task.time_tracked,
          estimatedTime: task.estimated_time,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
          companyId: task.company_id,
        }));

        setProjects(formattedProjects);
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [company?.id]);

  const getColumnColor = (color: string) => {
    const colors = {
      slate: 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800',
      blue: 'border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30',
      amber: 'border-amber-200 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30',
      emerald: 'border-emerald-200 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30',
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(task => task.project === selectedProject);

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (selectedProjectForEdit) {
      // Edit existing project
      setProjects(projects.map(p => 
        p.id === selectedProjectForEdit.id 
          ? { ...p, ...projectData }
          : p
      ));
    } else {
      // Create new project
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: projectData.name!,
        description: projectData.description!,
        status: projectData.status as any,
        progress: 0,
        team: projectData.team || [],
        manager: projectData.manager || null,
        budget: projectData.budget,
        spent: projectData.spent || 0,
        createdAt: new Date().toISOString(),
        dueDate: projectData.dueDate,
        companyId: projectData.companyId || '',
        client: projectData.client,
        tags: projectData.tags || [],
      };
      setProjects([...projects, newProject]);
    }
    setSelectedProjectForEdit(null);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    // Also remove tasks from deleted project
    setTasks(tasks.filter(t => t.project !== projects.find(p => p.id === projectId)?.name));
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTaskForEdit) {
      // Edit existing task
      setTasks(tasks.map(t => 
        t.id === selectedTaskForEdit.id 
          ? { ...t, ...taskData }
          : t
      ));
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title!,
        description: taskData.description,
        status: taskData.status as any,
        priority: taskData.priority as any,
        assignee: taskData.assignee,
        reporter: taskData.reporter || null,
        dueDate: taskData.dueDate,
        project: taskData.project!,
        tags: taskData.tags || [],
        timeTracked: taskData.timeTracked || 0,
        estimatedTime: taskData.estimatedTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyId: taskData.companyId || '',
      };
      setTasks([...tasks, newTask]);
    }
    setSelectedTaskForEdit(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleEditProject = (project: Project) => {
    setSelectedProjectForEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTaskForEdit(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Gestão de Projetos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acompanhe o progresso e organize suas tarefas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setSelectedProjectForEdit(null);
              setIsProjectModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
          <button 
            onClick={() => {
              setSelectedTaskForEdit(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handleEditProject(project)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">{project.name}</h3>
              <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                <span className="text-slate-900 dark:text-white font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{project.team.length} membros</span>
                </div>
                {project.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'board'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Quadro Kanban
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'list'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Lista
            </button>
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Projetos</option>
            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filtros</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className={`rounded-xl border-2 border-dashed p-4 min-h-96 ${getColumnColor(column.color)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">{column.title}</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                  {filteredTasks.filter(task => task.status === column.id).length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredTasks
                  .filter(task => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleEditTask(task)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white pr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {task.title}
                        </h4>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {task.assignee && (
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                              {task.assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                          )}
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {task.project}
                          </span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {activeTab === 'list' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Tarefa</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Prioridade</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Responsável</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Prazo</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Projeto</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr 
                    key={task.id} 
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                    onClick={() => handleEditTask(task)}
                  >
                    <td className="p-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'done' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        task.status === 'review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {task.status === 'done' ? 'Concluído' :
                         task.status === 'in-progress' ? 'Em Andamento' :
                         task.status === 'review' ? 'Em Revisão' : 'Para Fazer'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                          {task.priority === 'urgent' ? 'Urgente' :
                           task.priority === 'high' ? 'Alta' :
                           task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {task.assignee ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                            {task.assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm text-slate-900 dark:text-white">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500 dark:text-slate-400">Não atribuído</span>
                      )}
                    </td>
                    <td className="p-4">
                      {task.dueDate ? (
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-500 dark:text-slate-400">Sem prazo</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{task.project}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setSelectedProjectForEdit(null);
        }}
        project={selectedProjectForEdit}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTaskForEdit(null);
        }}
        task={selectedTaskForEdit}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
        </>
      )}
    </div>
  );
};

export default ProjectsView;