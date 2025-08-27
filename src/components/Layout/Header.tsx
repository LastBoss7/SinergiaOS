import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Bot, Command, Settings, User, LogOut, HelpCircle, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onCommandOpen: () => void;
  onProfileOpen?: () => void;
  onSupportOpen?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCommandOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifications] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleProfileClick = () => {
    setShowUserMenu(false);
    if (onProfileOpen) {
      onProfileOpen();
    }
  };

  const handleSupportClick = () => {
    setShowUserMenu(false);
    if (onSupportOpen) {
      onSupportOpen();
    }
  };
  return (
    <header className="hidden lg:flex h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <button
          onClick={onCommandOpen}
          className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-4 py-2 rounded-lg transition-all duration-200 border border-slate-200 dark:border-slate-600 hover:shadow-md group"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Pergunte à IA...</span>
          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-500">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Enhanced Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar projetos, tarefas..."
            className="w-80 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition-all duration-200 focus:w-96 focus:shadow-lg"
            onFocus={() => setShowSearch(true)}
            onBlur={() => setShowSearch(false)}
          />
          {showSearch && (
            <div className="absolute top-12 left-0 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 animate-slide-up">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Pesquisas recentes:</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Projeto Lançamento Beta</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Tarefas em atraso</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          onClick={handleSupportClick}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative group"
          title="Central de Ajuda"
        >
          <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-110"
          title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          ) : (
            <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          )}
        </button>

        {/* Enhanced Notifications */}
        <div className="relative">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 hover:scale-110 relative group">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                {notifications}
              </span>
            )}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          </button>
        </div>

        {/* Enhanced User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 group"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {user?.name || 'Ana Silva'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.role === 'admin' ? 'Administrador' : 
                 user?.role === 'manager' ? 'Gerente' : 'Membro'}
              </p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold group-hover:scale-110 transition-transform">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AS'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-slide-up">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AS'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{user?.name || 'Ana Silva'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email || 'ana@company.com'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Meu Perfil</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Configurações</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Ajuda & Suporte</span>
                </button>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 py-2">
                <button 
                  onClick={handleProfileClick}
                  onClick={logout}
                  onClick={handleSupportClick}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showSearch) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowUserMenu(false);
            setShowSearch(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;