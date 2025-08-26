import React, { useState } from 'react';
import { Home, Users, MessageCircle, Settings, Zap, BarChart3, DollarSign, UserCheck, Package, Brain, FileText, Menu, X, Bell, Search, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onCommandOpen: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeView, onViewChange, onCommandOpen }) => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [notifications] = useState(3);

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'projects', label: 'Projetos', icon: BarChart3 },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'messages', label: 'Chat', icon: MessageCircle },
  ];

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'crm', label: 'CRM & Vendas', icon: Users },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'projects', label: 'Projetos', icon: BarChart3 },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'hr', label: 'RH', icon: UserCheck },
    { id: 'operations', label: 'Operações', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: Brain },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">InsightOS</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onCommandOpen}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-2 py-2 z-40 safe-area-pb">
        <div className="flex items-center justify-around">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setShowMenu(true)}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">Mais</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{user?.name || 'Usuário'}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email || 'email@empresa.com'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {allMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive
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

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <button
                  onClick={() => {
                    onCommandOpen();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Assistente IA</span>
                </button>
                
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;