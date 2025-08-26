import React from 'react';
import { Home, Users, MessageCircle, Settings, Zap, BarChart3, DollarSign, UserCheck, Package, ChevronRight, FileText } from 'lucide-react';
import { mockModules } from '../../data/mockData';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const coreMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'crm', label: 'CRM & Vendas', icon: Users },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'projects', label: 'Projetos', icon: BarChart3 },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'hr', label: 'Recursos Humanos', icon: UserCheck },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
  ];

  const getModuleIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Home, Users, DollarSign, UserCheck, Package, BarChart3
    };
    return icons[iconName] || Home;
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">InsightOS</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Business Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {coreMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Módulos Disponíveis
          </h3>
          <div className="space-y-2">
            {mockModules.filter(module => module.id !== 'core').map((module) => {
              const Icon = getModuleIcon(module.icon);
              const isActive = module.status === 'active';
              const isComingSoon = module.status === 'coming-soon';
              
              return (
                <div
                  key={module.id}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-900/30' 
                      : isComingSoon 
                      ? 'opacity-50' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${
                      isActive 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`} />
                    <span className={`text-sm ${
                      isActive 
                        ? 'text-emerald-700 dark:text-emerald-300 font-medium' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {module.name}
                    </span>
                  </div>
                  {!isActive && !isComingSoon && (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                  {isComingSoon && (
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      Em Breve
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activeView === 'settings'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;