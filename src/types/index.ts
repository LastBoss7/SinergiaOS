export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'member';
  status: 'online' | 'away' | 'offline';
  department?: string;
  position?: string;
  phone?: string;
  location?: string;
  joinDate: string;
  lastLogin?: string;
  permissions: Permission[];
  companyId: string;
  isActive: boolean;
  hierarchy?: {
    level: number;
    reportsTo?: string;
    directReports?: string[];
  };
  skills?: string[];
  bio?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  logo?: string;
  plan: 'free' | 'business' | 'enterprise';
  industry?: string;
  size?: string;
  address?: string;
  phone?: string;
  website?: string;
  createdAt: string;
  settings: CompanySettings;
  modules: string[];
  hierarchy?: {
    levels: {
      name: string;
      permissions: string[];
      canManage: string[];
    }[];
  };
}

export interface CompanySettings {
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
}

export interface Permission {
  module: string;
  actions: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: User;
  reporter: User;
  dueDate?: string;
  project: string;
  tags: string[];
  timeTracked: number;
  estimatedTime?: number;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  progress: number;
  team: User[];
  manager: User;
  budget?: number;
  spent?: number;
  createdAt: string;
  dueDate?: string;
  companyId: string;
  client?: string;
  tags: string[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'available' | 'coming-soon';
  tier: 'free' | 'business' | 'enterprise';
  price?: number;
  features: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
  channel: string;
  type: 'text' | 'file' | 'system';
  edited?: boolean;
  reactions: Reaction[];
  companyId: string;
  type?: 'text' | 'file' | 'system' | 'announcement';
  edited?: boolean;
  reactions?: Reaction[];
  attachments?: any[];
  mentions?: string[];
  threadId?: string;
  isPrivate?: boolean;
}

export interface Reaction {
  emoji: string;
  users: string[];
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  members: User[];
  createdBy: User;
  createdAt: string;
  companyId: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'info' | 'success';
  title: string;
  description: string;
  actionable: boolean;
  timestamp: string;
  module: string;
  priority: 'low' | 'medium' | 'high';
  companyId: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager: User;
  members: User[];
  budget?: number;
  companyId: string;
}

export interface TimeEntry {
  id: string;
  user: User;
  task?: Task;
  project?: Project;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number;
  billable: boolean;
  companyId: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
}