import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  updateCompany: (data: Partial<Company>) => Promise<void>;
  getCompanyUsers: () => User[];
  getCompanyProjects: () => any[];
  getCompanyTasks: () => any[];
  addUserToCompany: (userData: any) => Promise<User>;
  removeUserFromCompany: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('insightos_user');
    const savedCompany = localStorage.getItem('insightos_company');
    
    if (savedUser && savedCompany) {
      setUser(JSON.parse(savedUser));
      setCompany(JSON.parse(savedCompany));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Demo login
      if (email === 'demo@insightos.com' && password === 'demo') {
        const demoUser: User = {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Ana Silva',
          email: 'demo@insightos.com',
          role: 'admin',
          status: 'online',
          department: 'Administração',
          position: 'CEO',
          phone: '+55 (11) 99999-9999',
          location: 'São Paulo, SP',
          joinDate: '2024-01-01',
          permissions: [{ module: 'all', actions: ['read', 'write', 'delete', 'admin'] }],
          companyId: '550e8400-e29b-41d4-a716-446655440000',
          isActive: true,
          hierarchy: {
            level: 0,
            directReports: ['2', '3', '4']
          },
          skills: ['Gestão', 'Estratégia', 'Liderança'],
          bio: 'CEO e fundadora da InsightOS com mais de 10 anos de experiência em gestão empresarial.'
        };

        const demoCompany: Company = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'InsightOS Demo',
          email: 'demo@insightos.com',
          plan: 'business',
          industry: 'Tecnologia',
          size: '11-50',
          address: 'São Paulo, SP',
          phone: '+55 (11) 3333-3333',
          website: 'https://insightos.demo',
          createdAt: '2024-01-01',
          settings: {
            timezone: 'America/Sao_Paulo',
            currency: 'BRL',
            language: 'pt-BR',
            workingHours: {
              start: '09:00',
              end: '18:00',
              workingDays: [1, 2, 3, 4, 5],
            },
            notifications: {
              email: true,
              push: true,
              slack: false,
            },
          },
          modules: ['core', 'crm', 'finance', 'hr', 'operations', 'analytics'],
        };

        // Initialize demo data
        initializeDemoData();

        setUser(demoUser);
        setCompany(demoCompany);
        setIsAuthenticated(true);
        
        localStorage.setItem('insightos_user', JSON.stringify(demoUser));
        localStorage.setItem('insightos_company', JSON.stringify(demoCompany));
      } else {
        // Try Supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Load user and company data from Supabase
          const { data: userData } = await supabase
            .from('users')
            .select('*, companies(*)')
            .eq('email', email)
            .single();

          if (userData) {
            const user: User = {
              id: userData.id,
              name: userData.full_name,
              email: userData.email,
              role: userData.role,
              status: userData.status,
              department: userData.department_id,
              position: userData.position,
              phone: userData.phone,
              location: userData.timezone,
              joinDate: userData.hire_date || userData.created_at,
              permissions: userData.permissions || [],
              companyId: userData.company_id,
              isActive: userData.is_active,
            };

            const company: Company = {
              id: userData.companies.id,
              name: userData.companies.name,
              email: userData.companies.email,
              plan: userData.companies.plan,
              industry: userData.companies.industry,
              size: userData.companies.company_size,
              address: userData.companies.address_line1,
              phone: userData.companies.phone,
              website: userData.companies.website,
              createdAt: userData.companies.created_at,
              settings: userData.companies.settings,
              modules: userData.companies.active_modules,
            };

            setUser(user);
            setCompany(company);
            setIsAuthenticated(true);
            
            localStorage.setItem('insightos_user', JSON.stringify(user));
            localStorage.setItem('insightos_company', JSON.stringify(company));
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // Create company first
      const newCompany: Company = {
        id: `comp-${Date.now()}`,
        name: data.company.companyName,
        email: data.user.email,
        plan: 'free',
        industry: data.company.industry,
        size: data.company.size,
        address: data.company.address,
        phone: data.company.phone,
        website: data.company.website,
        createdAt: new Date().toISOString(),
        settings: {
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          language: 'pt-BR',
          workingHours: {
            start: '09:00',
            end: '18:00',
            workingDays: [1, 2, 3, 4, 5],
          },
          notifications: {
            email: true,
            push: true,
            slack: false,
          },
        },
        modules: ['core'],
      };

      // Create admin user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.user.name,
        email: data.user.email,
        role: 'admin',
        status: 'online',
        department: 'Administração',
        position: data.user.position || 'Administrador',
        phone: data.user.phone,
        location: 'Brasil',
        joinDate: new Date().toISOString(),
        permissions: [{ module: 'all', actions: ['read', 'write', 'delete', 'admin'] }],
        companyId: newCompany.id,
        isActive: true,
        hierarchy: {
          level: 0,
          directReports: []
        },
        skills: ['Gestão', 'Administração'],
        bio: 'Fundador(a) da empresa e administrador principal do sistema.'
      };

      setUser(newUser);
      setCompany(newCompany);
      setIsAuthenticated(true);
      
      localStorage.setItem('insightos_user', JSON.stringify(newUser));
      localStorage.setItem('insightos_company', JSON.stringify(newCompany));
      
      // Initialize empty data structures for new company
      localStorage.setItem(`insightos_users_${newCompany.id}`, JSON.stringify([newUser]));
      localStorage.setItem(`insightos_projects_${newCompany.id}`, JSON.stringify([]));
      localStorage.setItem(`insightos_tasks_${newCompany.id}`, JSON.stringify([]));
      localStorage.setItem(`insightos_messages_${newCompany.id}`, JSON.stringify([]));
      localStorage.setItem(`insightos_departments_${newCompany.id}`, JSON.stringify([
        { id: 'dept-1', name: 'Administração', managerId: newUser.id, color: '#8B5CF6' },
        { id: 'dept-2', name: 'Desenvolvimento', managerId: null, color: '#3B82F6' },
        { id: 'dept-3', name: 'Vendas', managerId: null, color: '#10B981' },
        { id: 'dept-4', name: 'Marketing', managerId: null, color: '#F59E0B' },
        { id: 'dept-5', name: 'Recursos Humanos', managerId: null, color: '#EC4899' },
        { id: 'dept-6', name: 'Financeiro', managerId: null, color: '#EF4444' },
      ]));

    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    setIsAuthenticated(false);
    localStorage.removeItem('insightos_user');
    localStorage.removeItem('insightos_company');
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('insightos_user', JSON.stringify(updatedUser));

    // Update in company users list
    const companyUsers = getCompanyUsers();
    const updatedUsers = companyUsers.map(u => u.id === user.id ? updatedUser : u);
    localStorage.setItem(`insightos_users_${company?.id}`, JSON.stringify(updatedUsers));
  };

  const updateCompany = async (data: Partial<Company>) => {
    if (!company) return;

    const updatedCompany = { ...company, ...data };
    setCompany(updatedCompany);
    localStorage.setItem('insightos_company', JSON.stringify(updatedCompany));
  };

  const getCompanyUsers = (): User[] => {
    if (!company) return [];
    const users = localStorage.getItem(`insightos_users_${company.id}`);
    return users ? JSON.parse(users) : [];
  };

  const getCompanyProjects = () => {
    if (!company) return [];
    const projects = localStorage.getItem(`insightos_projects_${company.id}`);
    return projects ? JSON.parse(projects) : [];
  };

  const getCompanyTasks = () => {
    if (!company) return [];
    const tasks = localStorage.getItem(`insightos_tasks_${company.id}`);
    return tasks ? JSON.parse(tasks) : [];
  };

  const addUserToCompany = async (userData: any): Promise<User> => {
    if (!company || !user) throw new Error('No company or user context');

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'member',
      status: 'offline',
      department: userData.department,
      position: userData.position,
      phone: userData.phone,
      location: 'Brasil',
      joinDate: new Date().toISOString(),
      permissions: [
        { module: 'core', actions: ['read', 'write'] }
      ],
      companyId: company.id,
      isActive: true,
      hierarchy: {
        level: userData.role === 'admin' ? 1 : userData.role === 'manager' ? 2 : 3,
        reportsTo: userData.role === 'admin' ? user.id : undefined
      },
      skills: [],
      bio: `Novo membro da equipe ${userData.department || 'da empresa'}.`,
      salary: userData.salary,
      hourlyRate: userData.hourlyRate
    };

    // Add to company users
    const companyUsers = getCompanyUsers();
    const updatedUsers = [...companyUsers, newUser];
    localStorage.setItem(`insightos_users_${company.id}`, JSON.stringify(updatedUsers));

    return newUser;
  };

  const removeUserFromCompany = async (userId: string) => {
    if (!company) return;

    const companyUsers = getCompanyUsers();
    const updatedUsers = companyUsers.filter(u => u.id !== userId);
    localStorage.setItem(`insightos_users_${company.id}`, JSON.stringify(updatedUsers));
  };

  const initializeDemoData = () => {
    const companyId = '550e8400-e29b-41d4-a716-446655440000';
    
    // Demo users
    const demoUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Ana Silva',
        email: 'demo@insightos.com',
        role: 'admin',
        status: 'online',
        department: 'Administração',
        position: 'CEO',
        phone: '+55 (11) 99999-9999',
        location: 'São Paulo, SP',
        joinDate: '2024-01-01',
        permissions: [{ module: 'all', actions: ['read', 'write', 'delete', 'admin'] }],
        companyId,
        isActive: true,
        hierarchy: { level: 0, directReports: ['2', '3', '4'] },
        skills: ['Gestão', 'Estratégia', 'Liderança'],
        bio: 'CEO e fundadora da InsightOS.'
      },
      {
        id: '2',
        name: 'Carlos Santos',
        email: 'carlos@insightos.com',
        role: 'manager',
        status: 'online',
        department: 'Vendas',
        position: 'Gerente de Vendas',
        phone: '+55 (11) 98888-8888',
        location: 'São Paulo, SP',
        joinDate: '2024-01-15',
        permissions: [{ module: 'crm', actions: ['read', 'write'] }],
        companyId,
        isActive: true,
        hierarchy: { level: 1, reportsTo: '550e8400-e29b-41d4-a716-446655440001' },
        skills: ['Vendas', 'Negociação', 'CRM'],
        bio: 'Gerente de vendas experiente.'
      },
      {
        id: '3',
        name: 'Maria Oliveira',
        email: 'maria@insightos.com',
        role: 'member',
        status: 'away',
        department: 'Design',
        position: 'UX Designer',
        phone: '+55 (11) 97777-7777',
        location: 'Rio de Janeiro, RJ',
        joinDate: '2024-01-20',
        permissions: [{ module: 'core', actions: ['read', 'write'] }],
        companyId,
        isActive: true,
        hierarchy: { level: 2, reportsTo: '550e8400-e29b-41d4-a716-446655440001' },
        skills: ['UX Design', 'Figma', 'Prototipagem'],
        bio: 'Designer UX/UI apaixonada por experiências digitais.'
      },
      {
        id: '4',
        name: 'João Costa',
        email: 'joao@insightos.com',
        role: 'member',
        status: 'online',
        department: 'Desenvolvimento',
        position: 'Desenvolvedor Full-Stack',
        phone: '+55 (11) 96666-6666',
        location: 'São Paulo, SP',
        joinDate: '2024-01-25',
        permissions: [{ module: 'core', actions: ['read', 'write'] }],
        companyId,
        isActive: true,
        hierarchy: { level: 2, reportsTo: '550e8400-e29b-41d4-a716-446655440001' },
        skills: ['React', 'Node.js', 'TypeScript'],
        bio: 'Desenvolvedor full-stack especializado em React.'
      }
    ];

    // Demo projects
    const demoProjects = [
      {
        id: 'proj-1',
        name: 'Lançamento Beta',
        description: 'Preparação e execução do lançamento da versão beta',
        status: 'active',
        progress: 75,
        team: demoUsers.slice(0, 3),
        manager: demoUsers[0],
        budget: 150000,
        spent: 95000,
        createdAt: '2024-01-01',
        dueDate: '2024-01-31',
        companyId,
        client: 'Cliente Alpha',
        tags: ['MVP', 'Beta', 'Launch']
      },
      {
        id: 'proj-2',
        name: 'Sistema Analytics',
        description: 'Desenvolvimento do módulo de análise de dados',
        status: 'active',
        progress: 45,
        team: [demoUsers[1], demoUsers[3]],
        manager: demoUsers[1],
        budget: 100000,
        spent: 35000,
        createdAt: '2024-01-05',
        dueDate: '2024-02-15',
        companyId,
        client: 'Cliente Beta',
        tags: ['Analytics', 'BI', 'Reports']
      },
      {
        id: 'proj-3',
        name: 'CRM Enterprise',
        description: 'Implementação de CRM avançado',
        status: 'planning',
        progress: 15,
        team: [demoUsers[1], demoUsers[2]],
        manager: demoUsers[1],
        budget: 200000,
        spent: 15000,
        createdAt: '2024-01-10',
        dueDate: '2024-03-30',
        companyId,
        client: 'Enterprise Corp',
        tags: ['CRM', 'Enterprise', 'Sales']
      }
    ];

    // Demo tasks
    const demoTasks = [
      {
        id: 'task-1',
        title: 'Revisar proposta comercial',
        description: 'Analisar e atualizar proposta para cliente X',
        status: 'in-progress',
        priority: 'high',
        assignee: demoUsers[0],
        reporter: demoUsers[1],
        dueDate: '2024-01-25',
        project: 'Lançamento Beta',
        tags: ['proposal', 'commercial'],
        timeTracked: 300,
        estimatedTime: 480,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        companyId
      },
      {
        id: 'task-2',
        title: 'Implementar dashboard analytics',
        description: 'Criar visualizações para métricas de negócio',
        status: 'todo',
        priority: 'medium',
        assignee: demoUsers[3],
        reporter: demoUsers[0],
        dueDate: '2024-02-05',
        project: 'Sistema Analytics',
        tags: ['dashboard', 'analytics'],
        timeTracked: 0,
        estimatedTime: 960,
        createdAt: '2024-01-16',
        updatedAt: '2024-01-16',
        companyId
      },
      {
        id: 'task-3',
        title: 'Teste de usabilidade',
        description: 'Conduzir testes com usuários finais',
        status: 'review',
        priority: 'high',
        assignee: demoUsers[2],
        reporter: demoUsers[0],
        dueDate: '2024-01-30',
        project: 'Lançamento Beta',
        tags: ['testing', 'usability'],
        timeTracked: 600,
        estimatedTime: 720,
        createdAt: '2024-01-17',
        updatedAt: '2024-01-17',
        companyId
      }
    ];

    // Demo messages
    const demoMessages = [
      {
        id: 'msg-1',
        content: 'Bem-vindos ao InsightOS! 🎉 Vamos começar organizando nossos projetos.',
        sender: demoUsers[0],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        channel: 'geral',
        type: 'text',
        edited: false,
        reactions: [],
        companyId
      },
      {
        id: 'msg-2',
        content: 'Pessoal, reunião de planning às 14h para discutir as próximas entregas.',
        sender: demoUsers[1],
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        channel: 'geral',
        type: 'text',
        edited: false,
        reactions: [],
        companyId
      },
      {
        id: 'msg-3',
        content: 'Dashboard analytics está 60% completo. Preview disponível para testes.',
        sender: demoUsers[3],
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        channel: 'desenvolvimento',
        type: 'text',
        edited: false,
        reactions: [],
        companyId
      }
    ];

    // Save demo data
    localStorage.setItem(`insightos_users_${companyId}`, JSON.stringify(demoUsers));
    localStorage.setItem(`insightos_projects_${companyId}`, JSON.stringify(demoProjects));
    localStorage.setItem(`insightos_tasks_${companyId}`, JSON.stringify(demoTasks));
    localStorage.setItem(`insightos_messages_${companyId}`, JSON.stringify(demoMessages));
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      company,
      loading,
      error,
      login,
      register,
      logout,
      updateUser,
      updateCompany,
      getCompanyUsers,
      getCompanyProjects,
      getCompanyTasks,
      addUserToCompany,
      removeUserFromCompany,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};