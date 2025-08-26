import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, Company } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateCompany: (companyData: Partial<Company>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    company: null,
    loading: true,
    error: null,
  });

  // Initialize users database from localStorage or use mock data
  const [usersDatabase, setUsersDatabase] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('sinergia_users_db');
    return savedUsers ? JSON.parse(savedUsers) : mockUsers;
  });

  const [companiesDatabase, setCompaniesDatabase] = useState<Company[]>(() => {
    const savedCompanies = localStorage.getItem('sinergia_companies_db');
    return savedCompanies ? JSON.parse(savedCompanies) : [];
  });

  // Save databases to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sinergia_users_db', JSON.stringify(usersDatabase));
  }, [usersDatabase]);

  useEffect(() => {
    localStorage.setItem('sinergia_companies_db', JSON.stringify(companiesDatabase));
  }, [companiesDatabase]);
  useEffect(() => {
    // Simular verificação de token armazenado
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('sinergia_token');
        const userData = localStorage.getItem('sinergia_user');
        const companyData = localStorage.getItem('sinergia_company');
        
        if (token && userData && companyData) {
          setAuthState({
            isAuthenticated: true,
            user: JSON.parse(userData),
            company: JSON.parse(companyData),
            loading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setAuthState(prev => ({ ...prev, loading: false, error: 'Erro ao verificar autenticação' }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in database
      const user = usersDatabase.find(u => u.email === email && u.isActive);
      
      if (!user) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      // Find user's company
      const company = companiesDatabase.find(c => c.id === user.companyId);
      
      if (!company) {
        throw new Error('Empresa não encontrada');
      }

      // Update user's last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString(), status: 'online' as const };
      setUsersDatabase(prev => prev.map(u => u.id === user.id ? updatedUser : u));

      // Armazenar dados
      localStorage.setItem('sinergia_token', 'mock-jwt-token');
      localStorage.setItem('sinergia_user', JSON.stringify(updatedUser));
      localStorage.setItem('sinergia_company', JSON.stringify(company));

      setAuthState({
        isAuthenticated: true,
        user: updatedUser,
        company: company,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Credenciais inválidas' 
      }));
    }
  };

  const register = async (userData: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new company
      const newCompany: Company = {
        id: `comp-${Date.now()}`,
        name: userData.company.companyName,
        email: userData.user.email,
        plan: 'free',
        industry: userData.company.industry,
        size: userData.company.size,
        address: userData.company.address || '',
        phone: userData.company.phone || '',
        website: userData.company.website || '',
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

      // Create new admin user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.user.name,
        email: userData.user.email,
        role: 'admin',
        status: 'online',
        department: 'Administração',
        position: userData.user.position || 'CEO',
        phone: userData.user.phone || '',
        location: userData.company.address || 'Brasil',
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        permissions: [
          { module: 'all', actions: ['read', 'write', 'delete', 'admin'] }
        ],
        companyId: newCompany.id,
        isActive: true,
      };

      // Add to databases
      setCompaniesDatabase(prev => [...prev, newCompany]);
      setUsersDatabase(prev => [...prev, newUser]);
      
      // Após registro bem-sucedido, fazer login automático
      await login(userData.email, userData.password);
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro ao criar conta' 
      }));
    }
  };

  const logout = () => {
    // Update user status to offline
    if (authState.user) {
      setUsersDatabase(prev => prev.map(u => 
        u.id === authState.user?.id ? { ...u, status: 'offline' as const } : u
      ));
    }

    localStorage.removeItem('sinergia_token');
    localStorage.removeItem('sinergia_user');
    localStorage.removeItem('sinergia_company');
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      company: null,
      loading: false,
      error: null,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      
      // Update in database
      setUsersDatabase(prev => prev.map(u => 
        u.id === authState.user?.id ? updatedUser : u
      ));
      
      localStorage.setItem('sinergia_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const updateCompany = (companyData: Partial<Company>) => {
    if (authState.company) {
      const updatedCompany = { ...authState.company, ...companyData };
      
      // Update in database
      setCompaniesDatabase(prev => prev.map(c => 
        c.id === authState.company?.id ? updatedCompany : c
      ));
      
      localStorage.setItem('sinergia_company', JSON.stringify(updatedCompany));
      setAuthState(prev => ({ ...prev, company: updatedCompany }));
    }
  };

  const addUserToCompany = (userData: Partial<User>) => {
    if (authState.company) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'member',
        status: 'offline',
        department: userData.department || '',
        position: userData.position || '',
        phone: userData.phone || '',
        location: userData.location || '',
        joinDate: new Date().toISOString(),
        permissions: userData.permissions || [
          { module: 'core', actions: ['read', 'write'] }
        ],
        companyId: authState.company.id,
        isActive: true,
      };
      
      setUsersDatabase(prev => [...prev, newUser]);
      return newUser;
    }
    return null;
  };
  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateUser,
      updateCompany,
      addUserToCompany,
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