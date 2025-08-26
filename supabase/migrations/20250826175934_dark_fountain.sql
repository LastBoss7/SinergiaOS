/*
  # InsightOS - Complete Business Management Database Schema

  1. New Tables
    - `companies` - Company information with settings and modules
    - `departments` - Company departments with budgets and managers
    - `users` - User accounts with roles, permissions and security
    - `projects` - Project management with teams and budgets
    - `tasks` - Task management with time tracking and dependencies
    - `time_entries` - Time tracking for projects and tasks
    - `notifications` - System notifications and alerts
    - `audit_logs` - Complete audit trail for security

  2. Security
    - Enable RLS on all tables
    - Company-based data isolation
    - Role-based access control (super_admin, admin, manager, member)
    - Audit logging for all operations

  3. Demo Data
    - Demo company with complete setup
    - 4 demo users with different roles
    - 3 sample projects with tasks
    - Financial transactions and notifications
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  logo_url text,
  industry text,
  company_size text,
  tax_id text,
  registration_number text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text DEFAULT 'Brazil',
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'business', 'enterprise')),
  subscription_id text,
  billing_email text,
  settings jsonb DEFAULT '{}',
  active_modules text[] DEFAULT ARRAY['core'],
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  trial_ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  budget numeric,
  manager_id uuid,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  email text UNIQUE NOT NULL,
  password_hash text,
  email_verified boolean DEFAULT false,
  first_name text NOT NULL,
  last_name text NOT NULL,
  full_name text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  avatar_url text,
  phone text,
  role text DEFAULT 'member' CHECK (role IN ('super_admin', 'admin', 'manager', 'member')),
  position text,
  employee_id text,
  hire_date date,
  salary numeric,
  hourly_rate numeric,
  status text DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline', 'busy')),
  timezone text DEFAULT 'America/Sao_Paulo',
  language text DEFAULT 'pt-BR',
  permissions jsonb DEFAULT '[]',
  two_factor_enabled boolean DEFAULT false,
  two_factor_secret text,
  last_login_at timestamptz,
  last_login_ip text,
  failed_login_attempts integer DEFAULT 0,
  locked_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  name text NOT NULL,
  description text,
  code text,
  color text DEFAULT '#3B82F6',
  status text DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled', 'archived')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  manager_id uuid REFERENCES users(id),
  team_members uuid[] DEFAULT '{}',
  client_name text,
  client_email text,
  budget numeric,
  spent numeric DEFAULT 0,
  hourly_rate numeric,
  start_date date,
  due_date date,
  completed_at timestamptz,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  parent_task_id uuid REFERENCES tasks(id),
  title text NOT NULL,
  description text,
  task_number integer,
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid REFERENCES users(id),
  reporter_id uuid REFERENCES users(id),
  estimated_hours numeric,
  actual_hours numeric DEFAULT 0,
  start_date date,
  due_date date,
  completed_at timestamptz,
  tags text[] DEFAULT '{}',
  attachments jsonb DEFAULT '[]',
  custom_fields jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Time entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id),
  task_id uuid REFERENCES tasks(id),
  description text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes integer,
  is_billable boolean DEFAULT true,
  hourly_rate numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'task', 'project', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  related_entity_type text,
  related_entity_id uuid,
  action_url text,
  action_label text,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_departments_company_id ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_company_id ON time_entries(company_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_company_id ON notifications(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id ON audit_logs(company_id);

-- RLS Policies for Companies
CREATE POLICY "Users can read their own company" ON companies
  FOR SELECT TO authenticated
  USING (id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can update their company" ON companies
  FOR UPDATE TO authenticated
  USING (id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- RLS Policies for Departments
CREATE POLICY "Users can read company departments" ON departments
  FOR SELECT TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage departments" ON departments
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- RLS Policies for Users
CREATE POLICY "Users can read company members" ON users
  FOR SELECT TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can manage company users" ON users
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- RLS Policies for Projects
CREATE POLICY "Users can read company projects" ON projects
  FOR SELECT TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Managers can manage projects" ON projects
  FOR ALL TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- RLS Policies for Tasks
CREATE POLICY "Users can read company tasks" ON tasks
  FOR SELECT TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage assigned tasks" ON tasks
  FOR ALL TO authenticated
  USING (
    assignee_id = auth.uid() OR 
    reporter_id = auth.uid() OR
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
    )
  );

-- RLS Policies for Time Entries
CREATE POLICY "Users can read company time entries" ON time_entries
  FOR SELECT TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage their own time entries" ON time_entries
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for Notifications
CREATE POLICY "Users can read their own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for Audit Logs
CREATE POLICY "Admins can read company audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraint for department manager after users table is created
ALTER TABLE departments ADD CONSTRAINT departments_manager_id_fkey 
  FOREIGN KEY (manager_id) REFERENCES users(id);

-- Create views for statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.full_name,
  u.company_id,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
  COUNT(DISTINCT p.id) as total_projects,
  COALESCE(SUM(te.duration_minutes), 0) as total_minutes_logged
FROM users u
LEFT JOIN tasks t ON u.id = t.assignee_id
LEFT JOIN projects p ON u.id = ANY(p.team_members)
LEFT JOIN time_entries te ON u.id = te.user_id
WHERE u.is_active = true
GROUP BY u.id, u.full_name, u.company_id;

CREATE OR REPLACE VIEW project_stats AS
SELECT 
  p.id,
  p.name,
  p.company_id,
  p.progress,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
  COUNT(DISTINCT CASE WHEN t.status != 'done' THEN t.id END) as pending_tasks,
  COALESCE(SUM(te.duration_minutes), 0) as total_minutes_logged,
  array_length(p.team_members, 1) as team_size
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN time_entries te ON p.id = te.project_id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.company_id, p.progress, p.team_members;

-- Insert demo company
INSERT INTO companies (
  id,
  name,
  slug,
  email,
  phone,
  website,
  industry,
  company_size,
  address_line1,
  city,
  state,
  country,
  plan,
  settings,
  active_modules,
  is_active,
  is_verified
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'InsightOS Demo',
  'insightos-demo',
  'demo@insightos.com',
  '+55 (11) 3333-3333',
  'https://insightos.demo',
  'Tecnologia',
  '11-50',
  'Av. Paulista, 1000',
  'São Paulo',
  'SP',
  'Brazil',
  'business',
  '{
    "timezone": "America/Sao_Paulo",
    "currency": "BRL",
    "language": "pt-BR",
    "workingHours": {
      "start": "09:00",
      "end": "18:00",
      "workingDays": [1, 2, 3, 4, 5]
    },
    "notifications": {
      "email": true,
      "push": true,
      "slack": false
    }
  }',
  ARRAY['core', 'crm', 'finance', 'hr', 'projects'],
  true,
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  settings = EXCLUDED.settings,
  active_modules = EXCLUDED.active_modules;

-- Insert demo departments
INSERT INTO departments (
  id,
  company_id,
  name,
  description,
  color,
  budget,
  is_active
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440000',
  'Administração',
  'Gestão geral e estratégia da empresa',
  '#8B5CF6',
  50000,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440000',
  'Desenvolvimento',
  'Equipe de desenvolvimento de software',
  '#3B82F6',
  120000,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440000',
  'Vendas',
  'Equipe comercial e relacionamento com clientes',
  '#10B981',
  80000,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440000',
  'Marketing',
  'Marketing digital e comunicação',
  '#F59E0B',
  60000,
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Insert demo users
INSERT INTO users (
  id,
  company_id,
  department_id,
  email,
  first_name,
  last_name,
  phone,
  role,
  position,
  hire_date,
  salary,
  status,
  permissions,
  is_active,
  email_verified
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440010',
  'demo@insightos.com',
  'Ana',
  'Silva',
  '+55 (11) 99999-9999',
  'admin',
  'CEO & Fundadora',
  '2023-01-15',
  15000,
  'online',
  '[{"module": "all", "actions": ["read", "write", "delete", "admin"]}]',
  true,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440012',
  'carlos@insightos.com',
  'Carlos',
  'Santos',
  '+55 (11) 98888-8888',
  'manager',
  'Gerente de Vendas',
  '2023-02-20',
  12000,
  'online',
  '[{"module": "crm", "actions": ["read", "write"]}, {"module": "core", "actions": ["read", "write"]}]',
  true,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440013',
  'maria@insightos.com',
  'Maria',
  'Oliveira',
  '+55 (11) 97777-7777',
  'member',
  'UX Designer',
  '2023-03-10',
  7200,
  'away',
  '[{"module": "core", "actions": ["read", "write"]}]',
  true,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440011',
  'joao@insightos.com',
  'João',
  'Costa',
  '+55 (11) 96666-6666',
  'member',
  'Desenvolvedor Full-Stack',
  '2023-04-05',
  8500,
  'online',
  '[{"module": "core", "actions": ["read", "write"]}]',
  true,
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- Update department managers
UPDATE departments SET manager_id = '550e8400-e29b-41d4-a716-446655440001' WHERE id = '550e8400-e29b-41d4-a716-446655440010';
UPDATE departments SET manager_id = '550e8400-e29b-41d4-a716-446655440004' WHERE id = '550e8400-e29b-41d4-a716-446655440011';
UPDATE departments SET manager_id = '550e8400-e29b-41d4-a716-446655440002' WHERE id = '550e8400-e29b-41d4-a716-446655440012';
UPDATE departments SET manager_id = '550e8400-e29b-41d4-a716-446655440003' WHERE id = '550e8400-e29b-41d4-a716-446655440013';

-- Insert demo projects
INSERT INTO projects (
  id,
  company_id,
  department_id,
  name,
  description,
  code,
  status,
  progress,
  priority,
  manager_id,
  team_members,
  client_name,
  budget,
  spent,
  start_date,
  due_date,
  tags,
  is_active
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440020',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440011',
  'Lançamento Beta',
  'Preparação e execução do lançamento da versão beta da plataforma',
  'BETA-2024',
  'active',
  75,
  'high',
  '550e8400-e29b-41d4-a716-446655440001',
  ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'],
  'Cliente Alpha',
  150000,
  95000,
  '2024-01-01',
  '2024-01-31',
  ARRAY['MVP', 'Beta', 'Launch'],
  true
),
(
  '550e8400-e29b-41d4-a716-446655440021',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440011',
  'Sistema Analytics',
  'Desenvolvimento do módulo de análise de dados e relatórios avançados',
  'ANALYTICS-2024',
  'active',
  45,
  'medium',
  '550e8400-e29b-41d4-a716-446655440004',
  ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'],
  'Cliente Beta',
  100000,
  35000,
  '2024-01-05',
  '2024-02-15',
  ARRAY['Analytics', 'BI', 'Reports'],
  true
),
(
  '550e8400-e29b-41d4-a716-446655440022',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440012',
  'CRM Enterprise',
  'Implementação de CRM avançado para grandes clientes',
  'CRM-ENT-2024',
  'planning',
  15,
  'high',
  '550e8400-e29b-41d4-a716-446655440002',
  ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'],
  'Enterprise Corp',
  200000,
  15000,
  '2024-01-15',
  '2024-03-30',
  ARRAY['CRM', 'Enterprise', 'Sales'],
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  progress = EXCLUDED.progress;

-- Insert demo tasks
INSERT INTO tasks (
  id,
  company_id,
  project_id,
  title,
  description,
  status,
  priority,
  assignee_id,
  reporter_id,
  estimated_hours,
  actual_hours,
  due_date,
  tags,
  is_active
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440030',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440020',
  'Revisar proposta comercial',
  'Analisar e atualizar proposta para cliente X com novos requisitos de segurança e performance',
  'in_progress',
  'high',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  8,
  5,
  '2024-01-25',
  ARRAY['proposal', 'commercial', 'review'],
  true
),
(
  '550e8400-e29b-41d4-a716-446655440031',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440021',
  'Implementar dashboard analytics',
  'Criar visualizações para métricas de negócio com gráficos interativos',
  'todo',
  'medium',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440001',
  16,
  0,
  '2024-02-05',
  ARRAY['dashboard', 'analytics', 'charts'],
  true
),
(
  '550e8400-e29b-41d4-a716-446655440032',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440020',
  'Teste de usabilidade',
  'Conduzir testes com usuários finais e documentar feedback',
  'review',
  'high',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
  12,
  10,
  '2024-01-30',
  ARRAY['testing', 'usability', 'ux'],
  true
),
(
  '550e8400-e29b-41d4-a716-446655440033',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440021',
  'Documentação API',
  'Atualizar documentação técnica com novos endpoints',
  'done',
  'low',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440004',
  6,
  6,
  '2024-01-20',
  ARRAY['documentation', 'api', 'technical'],
  true
),
(
  '550e8400-e29b-41d4-a716-446655440034',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440022',
  'Setup CRM inicial',
  'Configurar estrutura básica do módulo CRM',
  'in_progress',
  'urgent',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  20,
  8,
  '2024-02-01',
  ARRAY['crm', 'setup', 'configuration'],
  true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  progress = EXCLUDED.progress;

-- Insert demo time entries
INSERT INTO time_entries (
  id,
  company_id,
  user_id,
  project_id,
  task_id,
  description,
  start_time,
  end_time,
  duration_minutes,
  is_billable,
  hourly_rate
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440040',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440021',
  '550e8400-e29b-41d4-a716-446655440031',
  'Desenvolvimento do dashboard principal',
  '2024-01-15 09:00:00+00',
  '2024-01-15 12:00:00+00',
  180,
  true,
  85
),
(
  '550e8400-e29b-41d4-a716-446655440041',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440020',
  '550e8400-e29b-41d4-a716-446655440032',
  'Criação de wireframes e protótipos',
  '2024-01-15 14:00:00+00',
  '2024-01-15 18:00:00+00',
  240,
  true,
  75
) ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description;

-- Insert demo notifications
INSERT INTO notifications (
  id,
  company_id,
  user_id,
  type,
  title,
  message,
  related_entity_type,
  related_entity_id,
  is_read
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440050',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440001',
  'success',
  'Tarefa concluída',
  'João Costa finalizou a documentação da API',
  'task',
  '550e8400-e29b-41d4-a716-446655440033',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440051',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440001',
  'warning',
  'Projeto em risco',
  'Projeto Lançamento Beta tem tarefas em atraso',
  'project',
  '550e8400-e29b-41d4-a716-446655440020',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440052',
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440002',
  'info',
  'Nova oportunidade',
  'Lead qualificado adicionado ao pipeline',
  'lead',
  null,
  true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message;