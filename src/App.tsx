import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthWrapper from './components/Auth/AuthWrapper';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
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
            <div className="flex">
              <Sidebar activeView={activeView} onViewChange={setActiveView} />
              <div className="flex-1">
                <Header onCommandOpen={() => setIsCommandOpen(true)} />
                <main className="p-6">
                  {renderActiveView()}
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