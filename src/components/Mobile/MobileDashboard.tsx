import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthWrapper from './components/Auth/AuthWrapper';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MobileNavigation from './components/Layout/MobileNavigation';
import MobileDashboard from './components/Mobile/MobileDashboard';
import DashboardView from './components/Dashboard/DashboardView';
import CRMView from './components/CRM/CRMView';
import FinanceView from './components/Finance/FinanceView';
import ProjectsView from './components/Projects/ProjectsView';
import TeamView from './components/Team/TeamView';
import HRView from './components/HR/HRView';
import ReportsView from './components/Reports/ReportsView';
import MessagesView from './components/Messages/MessagesView';
import SettingsView from './components/Settings/SettingsView';
import OperationsView from './components/Operations/OperationsView';
import AnalyticsView from './components/Analytics/AnalyticsView';
import CommandPalette from './components/AI/CommandPalette';
import MobileProjects from './components/Mobile/MobileProjects';
import ProjectModal from './components/Projects/ProjectModal';
import TaskModal from './components/Tasks/TaskModal';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Command palette shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandAction = (action: string, data?: any) => {
    switch (action) {
      case 'create-project':
        setIsProjectModalOpen(true);
        break;
      case 'create-task':
        setIsTaskModalOpen(true);
        break;
      case 'view-team':
        setActiveView('team');
        break;
      case 'productivity-report':
        setActiveView('dashboard');
        break;
      case 'unread-messages':
        setActiveView('messages');
        break;
      case 'overdue-projects':
        setActiveView('projects');
        break;
      case 'ai-query':
        // Handle AI query processing
        console.log('Processing AI query:', data?.query);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'crm':
        return <CRMView />;
      case 'finance':
        return <FinanceView />;
      case 'projects':
        return <ProjectsView />;
      case 'team':
        return <TeamView />;
      case 'hr':
        return <HRView />;
      case 'operations':
        return <OperationsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'messages':
        return <MessagesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <AuthWrapper>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            {/* Mobile Navigation */}
            <MobileNavigation 
              activeView={activeView} 
              onViewChange={setActiveView}
              onCommandOpen={() => setIsCommandOpen(true)}
            />
            
            {/* Desktop Layout */}
            <div className="flex">
              <div className="hidden lg:block">
                <Sidebar activeView={activeView} onViewChange={setActiveView} />
              </div>
              <div className="flex-1 lg:ml-0">
                <div className="hidden lg:block">
                  <Header onCommandOpen={() => setIsCommandOpen(true)} />
                </div>
                <main className="p-6">
                  {/* Mobile Dashboard */}
                  <div className="lg:hidden">
                    {activeView === 'dashboard' ? (
                      <MobileDashboard />
                    ) : activeView === 'projects' ? (
                      <MobileProjects />
                    ) : activeView === 'messages' ? (
                      <MessagesView />
                    ) : activeView === 'team' ? (
                      <TeamView />
                    ) : activeView === 'finance' ? (
                      <FinanceView />
                    ) : activeView === 'crm' ? (
                      <CRMView />
                    ) : activeView === 'hr' ? (
                      <HRView />
                    ) : activeView === 'operations' ? (
                      <OperationsView />
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            {activeView === 'crm' ? 'CRM & Vendas' :
                             activeView === 'finance' ? 'Financeiro' :
                             activeView === 'projects' ? 'Projetos' :
                             activeView === 'team' ? 'Equipe' :
                             activeView === 'hr' ? 'Recursos Humanos' :
                             activeView === 'operations' ? 'Operações' :
                             activeView === 'analytics' ? 'Analytics' :
                             activeView === 'reports' ? 'Relatórios' :
                             activeView === 'messages' ? 'Mensagens' :
                             activeView === 'settings' ? 'Configurações' : 'Módulo'}
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Versão mobile otimizada em desenvolvimento. Use a versão desktop para acesso completo.
                          </p>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                  Funcionalidade Disponível
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  Acesse pelo desktop ou tablet para experiência completa
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Desktop Views */}
                  <div className="hidden lg:block">
                    {renderActiveView()}
                  </div>
                </main>
              </div>
            </div>
            
            <CommandPalette 
              isOpen={isCommandOpen} 
              onClose={() => setIsCommandOpen(false)} 
              onAction={handleCommandAction}
            />
            
            <ProjectModal
              isOpen={isProjectModalOpen}
              onClose={() => setIsProjectModalOpen(false)}
              onSave={() => {}}
            />
            
            <TaskModal
              isOpen={isTaskModalOpen}
              onClose={() => setIsTaskModalOpen(false)}
              onSave={() => {}}
            />
          </div>
        </AuthWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;