import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, User, Company } from '../types';

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

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setAuthState(prev => ({ ...prev, loading: false, error: 'Erro ao verificar sessão' }));
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
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
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Try to get user data from Supabase first
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;

        // Get company data
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', userData.company_id)
          .single();

        if (companyError) throw companyError;

        // Update user status to online
        await supabase
          .from('users')
          .update({ 
            status: 'online',
            last_login: new Date().toISOString()
          })
          .eq('id', userId);

        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as any,
          status: 'online' as any,
          department: userData.department,
          position: userData.position,
          phone: userData.phone,
          location: userData.location,
          joinDate: userData.join_date,
          lastLogin: new Date().toISOString(),
          permissions: userData.permissions || [],
          companyId: userData.company_id,
          isActive: userData.is_active,
        };

        const company: Company = {
          id: companyData.id,
          name: companyData.name,
          email: companyData.email,
          plan: companyData.plan as any,
          industry: companyData.industry,
          size: companyData.size,
          address: companyData.address,
          phone: companyData.phone,
          website: companyData.website,
          createdAt: companyData.created_at,
          settings: companyData.settings || {
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
          modules: companyData.modules || ['core'],
        };

        setAuthState({
          isAuthenticated: true,
          user,
          company,
          loading: false,
          error: null,
        });
      } catch (supabaseError: any) {
        // If Supabase tables don't exist, fall back to localStorage
        console.log('Supabase tables not found, using localStorage fallback:', supabaseError.message);
        
        // Load from localStorage
        const users = JSON.parse(localStorage.getItem('sinergia_users') || '[]');
        const companies = JSON.parse(localStorage.getItem('sinergia_companies') || '[]');
        
        const userData = users.find((u: any) => u.id === userId);
        if (!userData) throw new Error('Usuário não encontrado');
        
        const companyData = companies.find((c: any) => c.id === userData.companyId);
        if (!companyData) throw new Error('Empresa não encontrada');
        
        // Update user status in localStorage
        userData.status = 'online';
        userData.lastLogin = new Date().toISOString();
        localStorage.setItem('sinergia_users', JSON.stringify(users));
        
        setAuthState({
          isAuthenticated: true,
          user: userData,
          company: companyData,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro ao carregar dados do usuário' 
      }));
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Try Supabase first
      try {
        // For demo purposes, we'll use a simple email check
        if (email === 'demo@insightos.com' || email === 'demo@sinergia.com') {
          await loadUserData('550e8400-e29b-41d4-a716-446655440001');
          return;
        }

        // Check if user exists in database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('is_active', true)
          .single();

        if (userError || !userData) {
          throw new Error('Usuário não encontrado ou inativo');
        }

        await loadUserData(userData.id);
      } catch (supabaseError: any) {
        // Fall back to localStorage
        console.log('Supabase login failed, using localStorage:', supabaseError.message);
        
        const users = JSON.parse(localStorage.getItem('sinergia_users') || '[]');
        
        // Demo user
        if ((email === 'demo@insightos.com' || email === 'demo@sinergia.com') && password === 'demo') {
          await loadUserData('550e8400-e29b-41d4-a716-446655440001');
          return;
        }
        
        // Find user in localStorage
        const userData = users.find((u: any) => u.email === email && u.isActive);
        if (!userData) {
          throw new Error('Usuário não encontrado ou inativo');
        }
        
        await loadUserData(userData.id);
      }
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Credenciais inválidas' 
      }));
    }
  };

  const register = async (userData: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Try Supabase first
      try {
        // Create company
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: userData.company.companyName,
            email: userData.user.email,
            plan: 'free',
            industry: userData.company.industry,
            size: userData.company.size,
            address: userData.company.address || '',
            phone: userData.company.phone || '',
            website: userData.company.website || '',
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
          })
          .select()
          .single();

        if (companyError) throw companyError;

        // Create admin user
        const { data: newUserData, error: userError } = await supabase
          .from('users')
          .insert({
            name: userData.user.name,
            email: userData.user.email,
            role: 'admin',
            status: 'online',
            department: 'Administração',
            position: userData.user.position || 'CEO',
            phone: userData.user.phone || '',
            location: userData.company.address || 'Brasil',
            permissions: [
              { module: 'all', actions: ['read', 'write', 'delete', 'admin'] }
            ],
            company_id: companyData.id,
            is_active: true,
          })
          .select()
          .single();

        if (userError) throw userError;

        // Auto-login after registration
        await loadUserData(newUserData.id);
      } catch (supabaseError: any) {
        // Fall back to localStorage
        console.warn('Supabase registration failed, using localStorage:', supabaseError.message);
        
        const companies = JSON.parse(localStorage.getItem('sinergia_companies') || '[]');
        const users = JSON.parse(localStorage.getItem('sinergia_users') || '[]');
        
        // Create company
        const companyId = crypto.randomUUID();
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
        localStorage.setItem('sinergia_companies', JSON.stringify(companies));
        
        // Create admin user
        const userId = crypto.randomUUID();
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
        localStorage.setItem('sinergia_users', JSON.stringify(users));
        
        // Auto-login after registration
        await loadUserData(userId);
      }

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
      // Update user status to offline
      if (authState.user) {
        await supabase
          .from('users')
          .update({ status: 'offline' })
          .eq('id', authState.user.id);
      }

      // Sign out from Supabase
      await supabase.auth.signOut();
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        company: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!authState.user) return;

    try {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            department: userData.department,
            position: userData.position,
            phone: userData.phone,
            location: userData.location,
          })
          .eq('id', authState.user.id);

        if (error) throw error;

        const updatedUser = { ...authState.user, ...userData };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
      } catch (supabaseError) {
        // Fall back to localStorage
        const users = JSON.parse(localStorage.getItem('sinergia_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === authState.user!.id);
        
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...userData };
          localStorage.setItem('sinergia_users', JSON.stringify(users));
          
          const updatedUser = { ...authState.user, ...userData };
          setAuthState(prev => ({ ...prev, user: updatedUser }));
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const updateCompany = async (companyData: Partial<Company>) => {
    if (!authState.company) return;

    try {
      try {
        const { error } = await supabase
          .from('companies')
          .update({
            name: companyData.name,
            email: companyData.email,
            industry: companyData.industry,
            size: companyData.size,
            address: companyData.address,
            phone: companyData.phone,
            website: companyData.website,
            settings: companyData.settings,
            modules: companyData.modules,
          })
          .eq('id', authState.company.id);

        if (error) throw error;

        const updatedCompany = { ...authState.company, ...companyData };
        setAuthState(prev => ({ ...prev, company: updatedCompany }));
      } catch (supabaseError) {
        // Fall back to localStorage
        const companies = JSON.parse(localStorage.getItem('sinergia_companies') || '[]');
        const companyIndex = companies.findIndex((c: any) => c.id === authState.company!.id);
        
        if (companyIndex !== -1) {
          companies[companyIndex] = { ...companies[companyIndex], ...companyData };
          localStorage.setItem('sinergia_companies', JSON.stringify(companies));
          
          const updatedCompany = { ...authState.company, ...companyData };
          setAuthState(prev => ({ ...prev, company: updatedCompany }));
        }
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const addUserToCompany = async (userData: Partial<User>): Promise<User | null> => {
    if (!authState.company) return null;

    try {
      try {
        const { data: newUserData, error } = await supabase
          .from('users')
          .insert({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || 'member',
            status: 'offline',
            department: userData.department || '',
            position: userData.position || '',
            phone: userData.phone || '',
            location: userData.location || '',
            permissions: userData.permissions || [
              { module: 'core', actions: ['read', 'write'] }
            ],
            company_id: authState.company.id,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        const user: User = {
          id: newUserData.id,
          name: newUserData.name,
          email: newUserData.email,
          role: newUserData.role as any,
          status: newUserData.status as any,
          department: newUserData.department,
          position: newUserData.position,
          phone: newUserData.phone,
          location: newUserData.location,
          joinDate: newUserData.join_date,
          lastLogin: newUserData.last_login,
          permissions: newUserData.permissions || [],
          companyId: newUserData.company_id,
          isActive: newUserData.is_active,
        };

        return user;
      } catch (supabaseError) {
        // Fall back to localStorage
        const users = JSON.parse(localStorage.getItem('sinergia_users') || '[]');
        
        const userId = crypto.randomUUID();
        const user: User = {
          id: userId,
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
        localStorage.setItem('sinergia_users', JSON.stringify(users));
        
        return user;
      }
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