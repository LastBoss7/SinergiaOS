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

// Database types
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          email: string;
          plan: string;
          industry: string | null;
          size: string | null;
          address: string | null;
          phone: string | null;
          website: string | null;
          settings: any;
          modules: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          plan?: string;
          industry?: string | null;
          size?: string | null;
          address?: string | null;
          phone?: string | null;
          website?: string | null;
          settings?: any;
          modules?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          plan?: string;
          industry?: string | null;
          size?: string | null;
          address?: string | null;
          phone?: string | null;
          website?: string | null;
          settings?: any;
          modules?: string[];
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          status: string;
          department: string | null;
          position: string | null;
          phone: string | null;
          location: string | null;
          join_date: string;
          last_login: string | null;
          permissions: any;
          company_id: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role?: string;
          status?: string;
          department?: string | null;
          position?: string | null;
          phone?: string | null;
          location?: string | null;
          join_date?: string;
          last_login?: string | null;
          permissions?: any;
          company_id: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          status?: string;
          department?: string | null;
          position?: string | null;
          phone?: string | null;
          location?: string | null;
          join_date?: string;
          last_login?: string | null;
          permissions?: any;
          company_id?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: string;
          progress: number;
          team_members: string[];
          manager_id: string | null;
          budget: number | null;
          spent: number;
          due_date: string | null;
          client: string | null;
          tags: string[];
          company_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          status?: string;
          progress?: number;
          team_members?: string[];
          manager_id?: string | null;
          budget?: number | null;
          spent?: number;
          due_date?: string | null;
          client?: string | null;
          tags?: string[];
          company_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          status?: string;
          progress?: number;
          team_members?: string[];
          manager_id?: string | null;
          budget?: number | null;
          spent?: number;
          due_date?: string | null;
          client?: string | null;
          tags?: string[];
          company_id?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          assignee_id: string | null;
          reporter_id: string | null;
          due_date: string | null;
          project_id: string | null;
          tags: string[];
          time_tracked: number;
          estimated_time: number | null;
          company_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          assignee_id?: string | null;
          reporter_id?: string | null;
          due_date?: string | null;
          project_id?: string | null;
          tags?: string[];
          time_tracked?: number;
          estimated_time?: number | null;
          company_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          assignee_id?: string | null;
          reporter_id?: string | null;
          due_date?: string | null;
          project_id?: string | null;
          tags?: string[];
          time_tracked?: number;
          estimated_time?: number | null;
          company_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}