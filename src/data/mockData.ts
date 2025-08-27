import { User, Task, Project, Module, Message, AIInsight } from '../types';

export interface Company {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'business' | 'enterprise';
  industry?: string;
  size?: string;
  address?: string;
  phone?: string;
  website?: string;
  createdAt: string;
  settings: {
    timezone: string;
    currency: string;
    language: string;
    workingHours: {
      start: string;
      end: string;
      workingDays: number[];
    };
    notifications: {
      email: boolean;
      push: boolean;
      slack: boolean;
    };
  };
  modules: string[];
}

export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Ana Silva', 
    email: 'ana@company.com', 
    role: 'admin', 
    status: 'online',
    department: 'Administração',
    position: 'CEO',
    phone: '+55 (11) 99999-9999',
    location: 'São Paulo, SP',
    joinDate: '2023-01-15',
    lastLogin: new Date().toISOString(),
    permissions: [
      { module: 'all', actions: ['read', 'write', 'delete', 'admin'] }
    ],
    companyId: 'comp-1',
    isActive: true,
    hierarchy: {
      level: 0,
      directReports: ['2', '6']
    },
    skills: ['Gestão', 'Estratégia', 'Liderança'],
    bio: 'CEO e fundadora da empresa com mais de 10 anos de experiência em gestão empresarial.'
  },
  { 
    id: '550e8400-e29b-41d4-a716-446655440000', 
    name: 'Usuário Demo', 
    email: 'demo@insightos.com', 
    role: 'admin', 
    status: 'online',
    department: 'Demonstração',
    position: 'Admin Demo',
    phone: '+55 (11) 99999-0000',
    location: 'São Paulo, SP',
    joinDate: '2024-01-01',
    lastLogin: new Date().toISOString(),
    permissions: [
      { module: 'all', actions: ['read', 'write', 'delete', 'admin'] }
    ],
    companyId: '550e8400-e29b-41d4-a716-446655440001',
    isActive: true,
    hierarchy: {
      level: 0,
      directReports: []
    },
    skills: ['Demonstração', 'Teste', 'Suporte'],
    bio: 'Usuário de demonstração para testar todas as funcionalidades da plataforma.'
  },
  { 
    id: '2', 
    name: 'Carlos Santos', 
    email: 'carlos@company.com', 
    role: 'manager', 
    status: 'online',
    department: 'Vendas',
    position: 'Gerente de Vendas',
    phone: '+55 (11) 98888-8888',
    location: 'São Paulo, SP',
    joinDate: '2023-02-20',
    lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    permissions: [
      { module: 'crm', actions: ['read', 'write'] },
      { module: 'core', actions: ['read', 'write'] }
    ],
    companyId: 'comp-1',
    isActive: true,
    hierarchy: {
      level: 1,
      reportsTo: '1',
      directReports: ['5']
    },
    skills: ['Vendas', 'Negociação', 'CRM'],
    bio: 'Gerente de vendas experiente com foco em relacionamento com clientes e crescimento de receita.'
  },
  { 
    id: '3', 
    name: 'Maria Oliveira', 
    email: 'maria@company.com', 
    role: 'member', 
    status: 'away',
    department: 'Design',
    position: 'UX Designer',
    phone: '+55 (11) 97777-7777',
    location: 'Rio de Janeiro, RJ',
    joinDate: '2023-03-10',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    permissions: [
      { module: 'core', actions: ['read', 'write'] }
    ],
    companyId: 'comp-1',
    isActive: true,
    hierarchy: {
      level: 2,
      reportsTo: '4'
    },
    skills: ['UX Design', 'Figma', 'Prototipagem'],
    bio: 'Designer UX/UI apaixonada por criar experiências digitais intuitivas e acessíveis.'
  },
  { 
    id: '4', 
    name: 'João Costa', 
    email: 'joao@company.com', 
    role: 'member', 
    status: 'online',
    department: 'Desenvolvimento',
    position: 'Desenvolvedor Full-Stack',
    phone: '+55 (11) 96666-6666',
    location: 'São Paulo, SP',
    joinDate: '2023-04-05',
    lastLogin: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    permissions: [
      { module: 'core', actions: ['read', 'write'] }
    ],
    companyId: 'comp-1',
    isActive: true,
    hierarchy: {
      level: 2,
      reportsTo: '6',
      directReports: ['3']
    },
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    bio: 'Desenvolvedor full-stack com expertise em tecnologias modernas e arquitetura de software.'
  },
  { 
    id: '5', 
    name: 'Luisa Ferreira', 
    email: 'luisa@company.com', 
    role: 'member', 
    status: 'offline',
    department: 'Marketing',
    position: 'Analista de Marketing',
    phone: '+55 (11) 95555-5555',
    location: 'Belo Horizonte, MG',
    joinDate: '2023-05-12',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    permissions: [
      { module: 'core', actions: ['read', 'write'] }
    ],
    companyId: 'comp-1',
    isActive: true,
    hierarchy: {
      level: 2,
      reportsTo: '2'
    },
    skills: ['Marketing Digital', 'Analytics', 'SEO'],
    bio: 'Especialista em marketing digital com foco em growth hacking e análise de dados.'
  },
  { 
    id: '6', 
    name: 'Pedro Almeida', 
    email: 'pedro@company.com', 
    role: 'manager', 
    status: 'online',
    department: 'Operações',
    position: 'Gerente de Operações',
    phone: '+55 (11) 94444-4444',
    location: 'São Paulo, SP',
    joinDate: '2023-01-30',
    lastLogin: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    permissions: [
      { module: 'operations', actions: ['read', 'write'] },
      { module: 'core', actions: ['read', 'write'] }
    ],
    companyId: 'comp-1',
    isActive: true,
    hierarchy: {
      level: 1,
      reportsTo: '1',
      directReports: ['4']
    },
    skills: ['Gestão de Operações', 'Processos', 'Qualidade'],
    bio: 'Gerente de operações focado em otimização de processos e melhoria contínua.'
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar proposta comercial',
    description: 'Analisar e atualizar proposta para cliente X com novos requisitos de segurança e performance',
    status: 'in-progress',
    priority: 'high',
    assignee: mockUsers[0],
    dueDate: '2024-01-15',
    project: 'Lançamento Beta',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: '2',
    title: 'Implementar dashboard analytics',
    description: 'Criar visualizações para métricas de negócio com gráficos interativos',
    status: 'todo',
    priority: 'medium',
    assignee: mockUsers[1],
    dueDate: '2024-01-20',
    project: 'Sistema Analytics',
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11'
  },
  {
    id: '3',
    title: 'Teste de usabilidade',
    description: 'Conduzir testes com usuários finais e documentar feedback',
    status: 'review',
    priority: 'high',
    assignee: mockUsers[2],
    project: 'Lançamento Beta',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Documentação API',
    description: 'Atualizar documentação técnica com novos endpoints',
    status: 'done',
    priority: 'low',
    assignee: mockUsers[3],
    project: 'Sistema Analytics',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-14'
  },
  {
    id: '5',
    title: 'Setup ambiente de produção',
    description: 'Configurar servidores e pipeline de deploy automatizado',
    status: 'in-progress',
    priority: 'urgent',
    assignee: mockUsers[5],
    dueDate: '2024-01-18',
    project: 'Infrastructure',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-13'
  },
  {
    id: '6',
    title: 'Integração sistema de pagamentos',
    description: 'Implementar Stripe para processamento de pagamentos',
    status: 'todo',
    priority: 'high',
    assignee: mockUsers[4],
    dueDate: '2024-01-25',
    project: 'E-commerce',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Lançamento Beta',
    description: 'Preparação e execução do lançamento da versão beta da plataforma',
    status: 'active',
    progress: 75,
    team: [mockUsers[0], mockUsers[2], mockUsers[3]],
    createdAt: '2024-01-01',
    dueDate: '2024-01-31'
  },
  {
    id: '2',
    name: 'Sistema Analytics',
    description: 'Desenvolvimento do módulo de análise de dados e relatórios avançados',
    status: 'active',
    progress: 45,
    team: [mockUsers[1], mockUsers[3], mockUsers[4]],
    createdAt: '2024-01-05',
    dueDate: '2024-02-15'
  },
  {
    id: '3',
    name: 'Infrastructure',
    description: 'Melhoria da infraestrutura e performance do sistema',
    status: 'active',
    progress: 30,
    team: [mockUsers[5], mockUsers[1]],
    createdAt: '2024-01-10',
    dueDate: '2024-02-28'
  },
  {
    id: '4',
    name: 'E-commerce',
    description: 'Desenvolvimento de funcionalidades de e-commerce',
    status: 'paused',
    progress: 15,
    team: [mockUsers[4], mockUsers[2]],
    createdAt: '2024-01-12'
  }
];

export const mockModules: Module[] = [
  { 
    id: 'core', 
    name: 'Módulo Central', 
    description: 'Gestão de projetos, tarefas e comunicação básica', 
    icon: 'Home', 
    status: 'active', 
    tier: 'free' 
  },
  { 
    id: 'crm', 
    name: 'CRM & Vendas', 
    description: 'Gestão de clientes, leads e pipeline de vendas completo', 
    icon: 'Users', 
    status: 'available', 
    tier: 'business' 
  },
  { 
    id: 'finance', 
    name: 'Financeiro', 
    description: 'Controle financeiro, faturamento e análise de fluxo de caixa', 
    icon: 'DollarSign', 
    status: 'available', 
    tier: 'business' 
  },
  { 
    id: 'hr', 
    name: 'Recursos Humanos', 
    description: 'Gestão de pessoas, performance e desenvolvimento de talentos', 
    icon: 'UserCheck', 
    status: 'active', 
    tier: 'business',
    features: ['Gestão de funcionários', 'Avaliações', 'Folha de pagamento', 'Controle de férias']
  },
  { 
    id: 'operations', 
    name: 'Operações', 
    description: 'Estoque, fornecedores e otimização da cadeia de suprimentos', 
    icon: 'Package', 
    status: 'active', 
    tier: 'business',
    features: ['Gestão de estoque', 'Fornecedores', 'Pedidos', 'Instalações']
  },
  { 
    id: 'analytics', 
    name: 'Analytics Avançado', 
    description: 'Business Intelligence e análise preditiva com machine learning', 
    icon: 'BarChart3', 
    status: 'active', 
    tier: 'enterprise',
    features: ['IA Preditiva', 'KPIs Avançados', 'Análise Competitiva', 'Machine Learning']
  }
];

export const mockMessages: Message[] = [
  { 
    id: '1', 
    content: 'Pessoal, reunião de planning às 14h para discutir as próximas entregas do sprint', 
    sender: mockUsers[0], 
    timestamp: '2024-01-15T10:30:00Z', 
    channel: 'geral' 
  },
  { 
    id: '2', 
    content: 'Terminei a revisão da proposta. Preciso de feedback do time comercial até amanhã', 
    sender: mockUsers[1], 
    timestamp: '2024-01-15T11:00:00Z', 
    channel: 'projetos' 
  },
  { 
    id: '3', 
    content: 'Testes de usabilidade finalizados com sucesso! 🎉 Relatório completo no drive compartilhado', 
    sender: mockUsers[2], 
    timestamp: '2024-01-15T11:30:00Z', 
    channel: 'geral' 
  },
  { 
    id: '4', 
    content: 'API documentation está atualizada. Todos os novos endpoints estão documentados', 
    sender: mockUsers[3], 
    timestamp: '2024-01-15T12:15:00Z', 
    channel: 'desenvolvimento' 
  },
  { 
    id: '5', 
    content: 'Setup do ambiente de produção está 80% completo. Deploy previsto para amanhã', 
    sender: mockUsers[5], 
    timestamp: '2024-01-15T13:00:00Z', 
    channel: 'desenvolvimento' 
  }
];

export const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Projeto em risco de atraso',
    description: 'O projeto "Lançamento Beta" tem 3 tarefas críticas em atraso. Com o ritmo atual, há 73% de chance de não cumprir o prazo final. Recomendo realocar recursos da equipe de marketing.',
    actionable: true,
    timestamp: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    type: 'suggestion',
    title: 'Oportunidade de automação identificada',
    description: 'Identifiquei um padrão repetitivo no processo de aprovação de propostas (executado 47 vezes no último mês). Posso criar uma automação que reduzirá o tempo em 65%.',
    actionable: true,
    timestamp: '2024-01-15T08:30:00Z'
  },
  {
    id: '3',
    type: 'info',
    title: 'Previsão de entrega atualizada',
    description: 'Com base na velocidade atual da equipe (+23% esta semana), o projeto "Sistema Analytics" será concluído 4 dias antes do prazo. Considere antecipar o próximo milestone.',
    actionable: false,
    timestamp: '2024-01-15T08:00:00Z'
  },
  {
    id: '4',
    type: 'success',
    title: 'Meta de produtividade atingida',
    description: 'A equipe superou a meta mensal de produtividade em 15%. Destaque para Maria Oliveira (137% da meta individual) e Carlos Santos (124% da meta individual).',
    actionable: false,
    timestamp: '2024-01-15T07:30:00Z'
  },
  {
    id: '5',
    type: 'warning',
    title: 'Capacidade da equipe em risco',
    description: 'João Costa está com 94% de utilização nas próximas 2 semanas. Recomendo redistribuir 2 tarefas de prioridade média para evitar burnout.',
    actionable: true,
    timestamp: '2024-01-15T07:00:00Z'
  }
];

export const mockCompanies = [
  {
    id: 'comp-1',
    name: 'Empresa Demo',
    email: 'contato@empresademo.com',
    plan: 'business',
    industry: 'Tecnologia',
    size: '11-50',
    address: 'São Paulo, SP',
    phone: '+55 (11) 3333-3333',
    website: 'https://empresademo.com',
    createdAt: '2023-01-01',
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
    modules: ['core', 'crm', 'finance', 'hr'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001', 
    name: 'InsightOS Demo',
    email: 'demo@insightos.com',
    plan: 'free',
    industry: 'Demonstração',
    size: '1-10',
    address: 'São Paulo, SP',
    phone: '+55 (11) 0000-0000',
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
    modules: ['core'],
  },
];