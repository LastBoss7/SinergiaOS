import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, User, Company } from '../types';
import { mockUsers, mockCompanies } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateCompany: (companyData: Partial<Company>) => void;
  addUserToCompany: (userData: Partial<User>) => Promise<User | null>;
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

  // Initialize localStorage with mock data
  const initializeMockData = () => {
    try {
      const existingUsers = localStorage.getItem('insightos_users');
      const existingCompanies = localStorage.getItem('insightos_companies');
      
      if (!existingUsers) {
        localStorage.setItem('insightos_users', JSON.stringify(mockUsers));
      }
      
      if (!existingCompanies) {
        localStorage.setItem('insightos_companies', JSON.stringify(mockCompanies));
      }
    } catch (error) {
      console.error('Error initializing localStorage:', error);
    }
  };

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && key && url !== 'your-supabase-url' && key !== 'your-supabase-anon-key';
  };

  // Load user data with comprehensive fallback
  const loadUserData = async (userId: string, email?: string) => {
    try {
      // First try Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          // Get user data from Supabase
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*, companies(*)')
            .eq('id', userId)
            .eq('is_active', true)
            .single();

          if (!userError && userData) {
            // Update user status to online
            await supabase
              .from('users')
              .update({ 
                status: 'online',
                last_login_at: new Date().toISOString()
              })
              .eq('id', userId);

            const user: User = {
              id: userData.id,
              name: userData.full_name || userData.first_name + ' ' + userData.last_name,
              email: userData.email,
              role: userData.role as any,
              status: 'online' as any,
              department: userData.department_id,
              position: userData.position,
              phone: userData.phone,
              location: userData.timezone || 'Brasil',
              joinDate: userData.hire_date || userData.created_at,
              lastLogin: new Date().toISOString(),
              permissions: userData.permissions || [],
              companyId: userData.company_id,
              isActive: userData.is_active,
            };

            const company: Company = {
              id: userData.companies.id,
              name: userData.companies.name,
              email: userData.companies.email,
              plan: userData.companies.plan as any,
              industry: userData.companies.industry,
              size: userData.companies.company_size,
              address: userData.companies.address_line1,
              phone: userData.companies.phone,
              website: userData.companies.website,
              createdAt: userData.companies.created_at,
              settings: userData.companies.settings || {
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
              modules: userData.companies.active_modules || ['core'],
            };

            setAuthState({
              isAuthenticated: true,
              user,
              company,
              loading: false,
              error: null,
            });
            return;
          }
        } catch (supabaseError: any) {
          console.info('Supabase user lookup failed, falling back to localStorage:', supabaseError.message);
        }
      }

      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('insightos_users') || '[]');
      const companies = JSON.parse(localStorage.getItem('insightos_companies') || '[]');
      
      // Find user by ID or email
      let userData = users.find((u: any) => u.id === userId);
      if (!userData && email) {
        userData = users.find((u: any) => u.email === email && u.isActive);
      }
      
      if (!userData) {
        throw new Error('Usuário não encontrado');
      }
      
      const companyData = companies.find((c: any) => c.id === userData.companyId);
      if (!companyData) {
        throw new Error('Empresa não encontrada');
      }
      
      // Update user status in localStorage
      userData.status = 'online';
      userData.lastLogin = new Date().toISOString();
      const userIndex = users.findIndex((u: any) => u.id === userData.id);
      if (userIndex !== -1) {
        users[userIndex] = userData;
        localStorage.setItem('insightos_users', JSON.stringify(users));
      }
      
      setAuthState({
        isAuthenticated: true,
        user: userData,
        company: companyData,
        loading: false,
        error: null,
      });

    } catch (error: any) {
      console.error('Error loading user data:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Erro ao carregar dados do usuário' 
      }));
    }
  };

  useEffect(() => {
    // Initialize mock data first
    initializeMockData();

    // Check initial session
    const checkSession = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            await loadUserData(session.user.id, session.user.email);
            return;
          }
        }
        
        // Check localStorage for existing session
        const savedSession = localStorage.getItem('insightos_session');
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          await loadUserData(sessionData.userId, sessionData.email);
          return;
        }
        
        setAuthState(prev => ({ ...prev, loading: false }));
      } catch (error) {
        console.error('Error checking session:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    checkSession();

    // Listen for auth changes only if Supabase is configured
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id, session.user.email);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('insightos_session');
          setAuthState({
            isAuthenticated: false,
            user: null,
            company: null,
            loading: false,
            error: null,
          });
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Handle demo login first
      if ((email === 'demo@insightos.com' || email === 'demo@sinergia.com') && password === 'demo') {
        await loadUserData('demo-user', email);
        // Save session to localStorage
        localStorage.setItem('insightos_session', JSON.stringify({
          userId: 'demo-user',
          email: email,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Try Supabase authentication if configured
      if (isSupabaseConfigured()) {
        try {
          // First check if user exists and is active
          const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id, is_active, email')
            .eq('email', email)
            .eq('is_active', true)
            .maybeSingle();

          if (checkError) {
            console.info('Supabase user check failed:', checkError.message);
            throw new Error('Erro ao verificar usuário');
          }

          if (!existingUser) {
            throw new Error('Usuário não encontrado ou inativo');
          }

          // Try to sign in with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) {
            console.info('Supabase auth failed:', authError.message);
            throw new Error('Credenciais inválidas');
          }

          if (authData.user) {
            await loadUserData(authData.user.id, email);
            return;
          }
        } catch (supabaseError: any) {
          console.info('Supabase login failed, trying localStorage fallback:', supabaseError.message);
        }
      }

      // Fallback to localStorage authentication
      const users = JSON.parse(localStorage.getItem('insightos_users') || '[]');
      const userData = users.find((u: any) => u.email === email && u.isActive);
      
      if (!userData) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      // Simple password validation for demo (in production, use proper hashing)
      if (password !== 'demo' && password !== '123456') {
        throw new Error('Senha incorreta');
      }

      await loadUserData(userData.id, email);
      
      // Save session to localStorage
      localStorage.setItem('insightos_session', JSON.stringify({
        userId: userData.id,
        email: email,
        timestamp: new Date().toISOString()
      }));

    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Erro ao fazer login' 
      }));
    }
  };

  const register = async (userData: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Generate proper UUIDs
      const companyId = crypto.randomUUID();
      const userId = crypto.randomUUID();

      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          // Create company
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .insert({
              id: companyId,
              name: userData.company.companyName,
              email: userData.user.email,
              plan: 'free',
              industry: userData.company.industry,
              company_size: userData.company.size,
              address_line1: userData.company.address || '',
              phone: userData.company.phone || '',
              website: userData.company.website || '',
              country: 'Brasil',
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
              active_modules: ['core'],
            })
            .select()
            .single();

          if (companyError) throw companyError;

          // Create admin user
          const { data: newUserData, error: userError } = await supabase
            .from('users')
            .insert({
              id: userId,
              company_id: companyId,
              email: userData.user.email,
              first_name: userData.user.name.split(' ')[0],
              last_name: userData.user.name.split(' ').slice(1).join(' ') || '',
              full_name: userData.user.name,
              role: 'admin',
              status: 'online',
              position: userData.user.position || 'CEO',
              phone: userData.user.phone || '',
              timezone: 'America/Sao_Paulo',
              language: 'pt-BR',
              permissions: {
                modules: ['all'],
                actions: ['read', 'write', 'delete', 'admin']
              },
              is_active: true,
            })
            .select()
            .single();

          if (userError) throw userError;

          // Create Supabase Auth user
          const { data: authUser, error: authError } = await supabase.auth.signUp({
            email: userData.user.email,
            password: userData.user.password,
            options: {
              data: {
                full_name: userData.user.name,
                company_id: companyId,
                user_id: userId
              }
            }
          });

          if (authError) throw authError;

          // Auto-login after registration
          await loadUserData(userId, userData.user.email);
          return;

        } catch (supabaseError: any) {
          console.info('Supabase registration failed, using localStorage:', supabaseError.message);
        }
      }

      // Fallback to localStorage
      const companies = JSON.parse(localStorage.getItem('insightos_companies') || '[]');
      const users = JSON.parse(localStorage.getItem('insightos_users') || '[]');
      
      // Check if email already exists
      const existingUser = users.find((u: any) => u.email === userData.user.email);
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Create company
      const company: Company = {
        id: companyId,
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
      
      companies.push(company);
      localStorage.setItem('insightos_companies', JSON.stringify(companies));
      
      // Create admin user
      const user: User = {
        id: userId,
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
        companyId: companyId,
        isActive: true,
      };
      
      users.push(user);
      localStorage.setItem('insightos_users', JSON.stringify(users));
      
      // Save session
      localStorage.setItem('insightos_session', JSON.stringify({
        userId: userId,
        email: userData.user.email,
        timestamp: new Date().toISOString()
      }));
      
      // Auto-login after registration
      await loadUserData(userId, userData.user.email);

    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Erro ao criar conta' 
      }));
    }
  };

  const logout = async () => {
    try {
      // Update user status to offline if possible
      if (authState.user && isSupabaseConfigured()) {
        try {
          await supabase
            .from('users')
            .update({ status: 'offline' })
            .eq('id', authState.user.id);
        } catch (error) {
          console.info('Could not update user status in Supabase:', error);
        }
      }

      // Update localStorage
      if (authState.user) {
        const users = JSON.parse(localStorage.getItem('insightos_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === authState.user!.id);
        if (userIndex !== -1) {
          users[userIndex].status = 'offline';
          localStorage.setItem('insightos_users', JSON.stringify(users));
        }
      }

      // Sign out from Supabase if configured
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }

      // Clear session
      localStorage.removeItem('insightos_session');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        company: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if there's an error
      localStorage.removeItem('insightos_session');
      setAuthState({
        isAuthenticated: false,
        user: null,
        company: null,
        loading: false,
        error: null,
      });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!authState.user) return;

    try {
      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase
            .from('users')
            .update({
              full_name: userData.name,
              first_name: userData.name?.split(' ')[0],
              last_name: userData.name?.split(' ').slice(1).join(' '),
              email: userData.email,
              role: userData.role,
              position: userData.position,
              phone: userData.phone,
              updated_at: new Date().toISOString(),
            })
            .eq('id', authState.user.id);

          if (!error) {
            const updatedUser = { ...authState.user, ...userData };
            setAuthState(prev => ({ ...prev, user: updatedUser }));
            return;
          }
        } catch (supabaseError) {
          console.info('Supabase user update failed, using localStorage:', supabaseError);
        }
      }

      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('insightos_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === authState.user!.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('insightos_users', JSON.stringify(users));
        
        const updatedUser = { ...authState.user, ...userData };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const updateCompany = async (companyData: Partial<Company>) => {
    if (!authState.company) return;

    try {
      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase
            .from('companies')
            .update({
              name: companyData.name,
              email: companyData.email,
              industry: companyData.industry,
              company_size: companyData.size,
              address_line1: companyData.address,
              phone: companyData.phone,
              website: companyData.website,
              settings: companyData.settings,
              active_modules: companyData.modules,
              updated_at: new Date().toISOString(),
            })
            .eq('id', authState.company.id);

          if (!error) {
            const updatedCompany = { ...authState.company, ...companyData };
            setAuthState(prev => ({ ...prev, company: updatedCompany }));
            return;
          }
        } catch (supabaseError) {
          console.info('Supabase company update failed, using localStorage:', supabaseError);
        }
      }

      // Fallback to localStorage
      const companies = JSON.parse(localStorage.getItem('insightos_companies') || '[]');
      const companyIndex = companies.findIndex((c: any) => c.id === authState.company!.id);
      
      if (companyIndex !== -1) {
        companies[companyIndex] = { ...companies[companyIndex], ...companyData };
        localStorage.setItem('insightos_companies', JSON.stringify(companies));
        
        const updatedCompany = { ...authState.company, ...companyData };
        setAuthState(prev => ({ ...prev, company: updatedCompany }));
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const addUserToCompany = async (userData: Partial<User>): Promise<User | null> => {
    if (!authState.company) return null;

    try {
      const newUserId = crypto.randomUUID();

      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const { data: newUserData, error } = await supabase
            .from('users')
            .insert({
              id: newUserId,
              company_id: authState.company.id,
              email: userData.email || '',
              first_name: userData.name?.split(' ')[0] || '',
              last_name: userData.name?.split(' ').slice(1).join(' ') || '',
              full_name: userData.name || '',
              role: userData.role || 'member',
              status: 'offline',
              position: userData.position || '',
              phone: userData.phone || '',
              timezone: 'America/Sao_Paulo',
              language: 'pt-BR',
              permissions: userData.permissions || {
                modules: ['core'],
                actions: ['read', 'write']
              },
              is_active: true,
            })
            .select()
            .single();

          if (!error && newUserData) {
            const user: User = {
              id: newUserData.id,
              name: newUserData.full_name,
              email: newUserData.email,
              role: newUserData.role as any,
              status: newUserData.status as any,
              department: userData.department,
              position: newUserData.position,
              phone: newUserData.phone,
              location: userData.location,
              joinDate: newUserData.created_at,
              lastLogin: newUserData.last_login_at,
              permissions: newUserData.permissions || [],
              companyId: newUserData.company_id,
              isActive: newUserData.is_active,
            };

            return user;
          }
        } catch (supabaseError) {
          console.info('Supabase user creation failed, using localStorage:', supabaseError);
        }
      }

      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('insightos_users') || '[]');
      
      // Check if email already exists
      const existingUser = users.find((u: any) => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      const user: User = {
        id: newUserId,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'member',
        status: 'offline',
        department: userData.department || '',
        position: userData.position || '',
        phone: userData.phone || '',
        location: userData.location || '',
        joinDate: new Date().toISOString(),
        lastLogin: null,
        permissions: userData.permissions || [
          { module: 'core', actions: ['read', 'write'] }
        ],
        companyId: authState.company.id,
        isActive: true,
      };
      
      users.push(user);
      localStorage.setItem('insightos_users', JSON.stringify(users));
      
      return user;
    } catch (error) {
      console.error('Error adding user to company:', error);
      return null;
    }
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