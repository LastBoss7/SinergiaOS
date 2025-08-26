import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Enhanced Database types with complete schema
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          email: string;
          phone: string | null;
          website: string | null;
          logo_url: string | null;
          industry: string | null;
          company_size: string | null;
          tax_id: string | null;
          registration_number: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string;
          plan: 'free' | 'business' | 'enterprise';
          subscription_id: string | null;
          billing_email: string | null;
          settings: any;
          active_modules: string[];
          is_active: boolean;
          is_verified: boolean;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          email: string;
          phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          company_size?: string | null;
          tax_id?: string | null;
          registration_number?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          plan?: 'free' | 'business' | 'enterprise';
          subscription_id?: string | null;
          billing_email?: string | null;
          settings?: any;
          active_modules?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          email?: string;
          phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          company_size?: string | null;
          tax_id?: string | null;
          registration_number?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          plan?: 'free' | 'business' | 'enterprise';
          subscription_id?: string | null;
          billing_email?: string | null;
          settings?: any;
          active_modules?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          color: string;
          budget: number | null;
          manager_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          color?: string;
          budget?: number | null;
          manager_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          budget?: number | null;
          manager_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          company_id: string;
          department_id: string | null;
          email: string;
          password_hash: string | null;
          email_verified: boolean;
          first_name: string;
          last_name: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          role: 'super_admin' | 'admin' | 'manager' | 'member';
          position: string | null;
          employee_id: string | null;
          hire_date: string | null;
          salary: number | null;
          hourly_rate: number | null;
          status: 'online' | 'away' | 'offline' | 'busy';
          timezone: string;
          language: string;
          permissions: any;
          two_factor_enabled: boolean;
          two_factor_secret: string | null;
          last_login_at: string | null;
          last_login_ip: string | null;
          failed_login_attempts: number;
          locked_until: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          department_id?: string | null;
          email: string;
          password_hash?: string | null;
          email_verified?: boolean;
          first_name: string;
          last_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'super_admin' | 'admin' | 'manager' | 'member';
          position?: string | null;
          employee_id?: string | null;
          hire_date?: string | null;
          salary?: number | null;
          hourly_rate?: number | null;
          status?: 'online' | 'away' | 'offline' | 'busy';
          timezone?: string;
          language?: string;
          permissions?: any;
          two_factor_enabled?: boolean;
          two_factor_secret?: string | null;
          last_login_at?: string | null;
          last_login_ip?: string | null;
          failed_login_attempts?: number;
          locked_until?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          department_id?: string | null;
          email?: string;
          password_hash?: string | null;
          email_verified?: boolean;
          first_name?: string;
          last_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'super_admin' | 'admin' | 'manager' | 'member';
          position?: string | null;
          employee_id?: string | null;
          hire_date?: string | null;
          salary?: number | null;
          hourly_rate?: number | null;
          status?: 'online' | 'away' | 'offline' | 'busy';
          timezone?: string;
          language?: string;
          permissions?: any;
          two_factor_enabled?: boolean;
          two_factor_secret?: string | null;
          last_login_at?: string | null;
          last_login_ip?: string | null;
          failed_login_attempts?: number;
          locked_until?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          company_id: string;
          department_id: string | null;
          name: string;
          description: string | null;
          code: string | null;
          color: string;
          status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
          progress: number;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          manager_id: string | null;
          team_members: string[];
          client_name: string | null;
          client_email: string | null;
          budget: number | null;
          spent: number;
          hourly_rate: number | null;
          start_date: string | null;
          due_date: string | null;
          completed_at: string | null;
          tags: string[];
          custom_fields: any;
          is_active: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          department_id?: string | null;
          name: string;
          description?: string | null;
          code?: string | null;
          color?: string;
          status?: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
          progress?: number;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          manager_id?: string | null;
          team_members?: string[];
          client_name?: string | null;
          client_email?: string | null;
          budget?: number | null;
          spent?: number;
          hourly_rate?: number | null;
          start_date?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          tags?: string[];
          custom_fields?: any;
          is_active?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          department_id?: string | null;
          name?: string;
          description?: string | null;
          code?: string | null;
          color?: string;
          status?: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
          progress?: number;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          manager_id?: string | null;
          team_members?: string[];
          client_name?: string | null;
          client_email?: string | null;
          budget?: number | null;
          spent?: number;
          hourly_rate?: number | null;
          start_date?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          tags?: string[];
          custom_fields?: any;
          is_active?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          company_id: string;
          project_id: string | null;
          parent_task_id: string | null;
          title: string;
          description: string | null;
          task_number: number | null;
          status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assignee_id: string | null;
          reporter_id: string | null;
          estimated_hours: number | null;
          actual_hours: number;
          start_date: string | null;
          due_date: string | null;
          completed_at: string | null;
          tags: string[];
          attachments: any;
          custom_fields: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          project_id?: string | null;
          parent_task_id?: string | null;
          title: string;
          description?: string | null;
          task_number?: number | null;
          status?: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assignee_id?: string | null;
          reporter_id?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number;
          start_date?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          tags?: string[];
          attachments?: any;
          custom_fields?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          project_id?: string | null;
          parent_task_id?: string | null;
          title?: string;
          description?: string | null;
          task_number?: number | null;
          status?: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assignee_id?: string | null;
          reporter_id?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number;
          start_date?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          tags?: string[];
          attachments?: any;
          custom_fields?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      time_entries: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          project_id: string | null;
          task_id: string | null;
          description: string;
          start_time: string;
          end_time: string | null;
          duration_minutes: number | null;
          is_billable: boolean;
          hourly_rate: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id: string;
          project_id?: string | null;
          task_id?: string | null;
          description: string;
          start_time: string;
          end_time?: string | null;
          is_billable?: boolean;
          hourly_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string;
          project_id?: string | null;
          task_id?: string | null;
          description?: string;
          start_time?: string;
          end_time?: string | null;
          is_billable?: boolean;
          hourly_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'project' | 'system';
          title: string;
          message: string;
          related_entity_type: string | null;
          related_entity_id: string | null;
          action_url: string | null;
          action_label: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id: string;
          type?: 'info' | 'success' | 'warning' | 'error' | 'task' | 'project' | 'system';
          title: string;
          message: string;
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          action_url?: string | null;
          action_label?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string;
          type?: 'info' | 'success' | 'warning' | 'error' | 'task' | 'project' | 'system';
          title?: string;
          message?: string;
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          action_url?: string | null;
          action_label?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          company_id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_values: any | null;
          new_values: any | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_values?: any | null;
          new_values?: any | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          old_values?: any | null;
          new_values?: any | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      user_stats: {
        Row: {
          id: string;
          full_name: string;
          company_id: string;
          total_tasks: number;
          completed_tasks: number;
          total_projects: number;
          total_minutes_logged: number;
        };
      };
      project_stats: {
        Row: {
          id: string;
          name: string;
          company_id: string;
          progress: number;
          total_tasks: number;
          completed_tasks: number;
          pending_tasks: number;
          total_minutes_logged: number;
          team_size: number;
        };
      };
    };
  };
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Get current user's company
  async getCurrentUserCompany() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('company_id, companies(*)')
      .eq('id', user.id)
      .single();

    return error ? null : data;
  },

  // Get users in current company
  async getCompanyUsers() {
    const company = await this.getCurrentUserCompany();
    if (!company) return [];

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('company_id', company.company_id)
      .eq('is_active', true)
      .order('full_name');

    return error ? [] : data;
  },

  // Get projects in current company
  async getCompanyProjects() {
    const company = await this.getCurrentUserCompany();
    if (!company) return [];

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        manager:manager_id(id, full_name, email),
        department:department_id(name, color)
      `)
      .eq('company_id', company.company_id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    return error ? [] : data;
  },

  // Get tasks in current company
  async getCompanyTasks() {
    const company = await this.getCurrentUserCompany();
    if (!company) return [];

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:assignee_id(id, full_name, email),
        reporter:reporter_id(id, full_name, email),
        project:project_id(name, code)
      `)
      .eq('company_id', company.company_id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    return error ? [] : data;
  },

  // Create notification
  async createNotification(notification: {
    user_id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'project' | 'system';
    title: string;
    message: string;
    related_entity_type?: string;
    related_entity_id?: string;
    action_url?: string;
    action_label?: string;
  }) {
    const company = await this.getCurrentUserCompany();
    if (!company) return null;

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        company_id: company.company_id,
        ...notification
      })
      .select()
      .single();

    return error ? null : data;
  }
};

export default supabase;