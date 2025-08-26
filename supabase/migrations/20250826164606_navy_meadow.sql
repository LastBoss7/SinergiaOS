/*
# Complete Database Setup for Sinergia Platform

This script creates all necessary tables, security policies, and sample data for the Sinergia platform.

## Instructions:
1. Copy this entire SQL script
2. Go to your Supabase Dashboard
3. Navigate to "SQL Editor"
4. Paste and run this script
5. Refresh your application

## What this creates:
1. Companies table with settings and modules
2. Users table with roles and permissions
3. Projects table with team management
4. Tasks table with time tracking
5. Row Level Security policies
6. Sample demo data
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  plan text DEFAULT 'free',
  industry text,
  size text,
  address text,
  phone text,
  website text,
  settings jsonb DEFAULT '{
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
  }'::jsonb,
  modules text[] DEFAULT ARRAY['core'],
  created_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'member',
  status text DEFAULT 'offline',
  department text,
  position text,
  phone text,
  location text,
  join_date timestamptz DEFAULT now(),
  last_login timestamptz,
  permissions jsonb DEFAULT '[]'::jsonb,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  progress integer DEFAULT 0,
  team_members text[] DEFAULT ARRAY[]::text[],
  manager_id uuid REFERENCES users(id),
  budget numeric,
  spent numeric DEFAULT 0,
  due_date timestamptz,
  client text,
  tags text[] DEFAULT ARRAY[]::text[],
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo',
  priority text DEFAULT 'medium',
  assignee_id uuid REFERENCES users(id),
  reporter_id uuid REFERENCES users(id),
  due_date timestamptz,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tags text[] DEFAULT ARRAY[]::text[],
  time_tracked integer DEFAULT 0,
  estimated_time integer,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for companies
CREATE POLICY "Companies can read own data"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Companies can update own data"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Create RLS policies for users
CREATE POLICY "Users can read company members"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'owner')
    )
  );

CREATE POLICY "Admins can update company users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'owner')
    )
  );

-- Create RLS policies for projects
CREATE POLICY "Users can read company projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage company projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Create RLS policies for tasks
CREATE POLICY "Users can read company tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage company tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);

-- Insert demo company
INSERT INTO companies (
  id,
  name,
  email,
  plan,
  industry,
  size,
  address,
  phone,
  website,
  settings,
  modules
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Sinergia Demo',
  'demo@sinergia.com',
  'premium',
  'Tecnologia',
  '11-50',
  'São Paulo, SP, Brasil',
  '+55 11 99999-9999',
  'https://sinergia.com',
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
      "slack": true
    }
  }'::jsonb,
  ARRAY['core', 'projects', 'tasks', 'team', 'reports']
) ON CONFLICT (id) DO NOTHING;

-- Insert demo users
INSERT INTO users (
  id,
  name,
  email,
  role,
  status,
  department,
  position,
  phone,
  location,
  join_date,
  last_login,
  permissions,
  company_id,
  is_active
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Admin Demo',
  'demo@sinergia.com',
  'admin',
  'online',
  'Administração',
  'CEO',
  '+55 11 99999-0001',
  'São Paulo, SP',
  '2024-01-01T00:00:00Z',
  now(),
  '[{"module": "all", "actions": ["read", "write", "delete", "admin"]}]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440000',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Maria Silva',
  'maria@sinergia.com',
  'manager',
  'online',
  'Desenvolvimento',
  'Tech Lead',
  '+55 11 99999-0002',
  'São Paulo, SP',
  '2024-01-15T00:00:00Z',
  now(),
  '[{"module": "projects", "actions": ["read", "write"]}, {"module": "tasks", "actions": ["read", "write"]}]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440000',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'João Santos',
  'joao@sinergia.com',
  'member',
  'offline',
  'Desenvolvimento',
  'Desenvolvedor Senior',
  '+55 11 99999-0003',
  'Rio de Janeiro, RJ',
  '2024-02-01T00:00:00Z',
  '2024-12-20T15:30:00Z',
  '[{"module": "tasks", "actions": ["read", "write"]}]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440000',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Ana Costa',
  'ana@sinergia.com',
  'member',
  'busy',
  'Design',
  'UX Designer',
  '+55 11 99999-0004',
  'São Paulo, SP',
  '2024-02-15T00:00:00Z',
  '2024-12-20T14:20:00Z',
  '[{"module": "projects", "actions": ["read"]}, {"module": "tasks", "actions": ["read", "write"]}]'::jsonb,
  '550e8400-e29b-41d4-a716-446655440000',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert demo projects
INSERT INTO projects (
  id,
  name,
  description,
  status,
  progress,
  team_members,
  manager_id,
  budget,
  spent,
  due_date,
  client,
  tags,
  company_id
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440010',
  'Sistema de Gestão Empresarial',
  'Desenvolvimento de um sistema completo de gestão empresarial com módulos de RH, financeiro e projetos.',
  'active',
  75,
  ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'],
  '550e8400-e29b-41d4-a716-446655440002',
  150000.00,
  112500.00,
  '2024-12-31T23:59:59Z',
  'Empresa ABC Ltda',
  ARRAY['web', 'react', 'typescript', 'supabase'],
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'App Mobile de Vendas',
  'Aplicativo mobile para equipe de vendas com sincronização offline e relatórios em tempo real.',
  'planning',
  25,
  ARRAY['550e8400-e29b-41d4-a716-446655440003'],
  '550e8400-e29b-41d4-a716-446655440002',
  80000.00,
  20000.00,
  '2025-03-15T23:59:59Z',
  'Vendas Plus',
  ARRAY['mobile', 'react-native', 'offline'],
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'Redesign do Portal',
  'Modernização completa da interface do portal corporativo com foco em UX/UI.',
  'completed',
  100,
  ARRAY['550e8400-e29b-41d4-a716-446655440004'],
  '550e8400-e29b-41d4-a716-446655440004',
  45000.00,
  42000.00,
  '2024-11-30T23:59:59Z',
  'Portal Corp',
  ARRAY['design', 'ui/ux', 'figma'],
  '550e8400-e29b-41d4-a716-446655440000'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo tasks
INSERT INTO tasks (
  id,
  title,
  description,
  status,
  priority,
  assignee_id,
  reporter_id,
  due_date,
  project_id,
  tags,
  time_tracked,
  estimated_time,
  company_id
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440020',
  'Implementar autenticação JWT',
  'Desenvolver sistema de autenticação seguro com tokens JWT e refresh tokens.',
  'in_progress',
  'high',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  '2024-12-25T17:00:00Z',
  '550e8400-e29b-41d4-a716-446655440010',
  ARRAY['backend', 'security', 'jwt'],
  480,
  600,
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '550e8400-e29b-41d4-a716-446655440021',
  'Criar dashboard de métricas',
  'Desenvolver dashboard interativo com gráficos e KPIs em tempo real.',
  'todo',
  'medium',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  '2024-12-30T17:00:00Z',
  '550e8400-e29b-41d4-a716-446655440010',
  ARRAY['frontend', 'charts', 'dashboard'],
  0,
  720,
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '550e8400-e29b-41d4-a716-446655440022',
  'Design do fluxo de onboarding',
  'Criar wireframes e protótipos para o processo de onboarding de novos usuários.',
  'done',
  'medium',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440002',
  '2024-12-15T17:00:00Z',
  '550e8400-e29b-41d4-a716-446655440010',
  ARRAY['design', 'ux', 'wireframes'],
  360,
  360,
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '550e8400-e29b-41d4-a716-446655440023',
  'Configurar CI/CD Pipeline',
  'Implementar pipeline de integração e deploy contínuo com testes automatizados.',
  'todo',
  'high',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-12-28T17:00:00Z',
  '550e8400-e29b-41d4-a716-446655440010',
  ARRAY['devops', 'ci/cd', 'testing'],
  0,
  480,
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '550e8400-e29b-41d4-a716-446655440024',
  'Pesquisa de usuários',
  'Conduzir entrevistas com usuários para validar funcionalidades do app mobile.',
  'in_progress',
  'medium',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440002',
  '2024-12-27T17:00:00Z',
  '550e8400-e29b-41d4-a716-446655440011',
  ARRAY['research', 'ux', 'interviews'],
  120,
  240,
  '550e8400-e29b-41d4-a716-446655440000'
) ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for tasks updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Demo company created: Sinergia Demo';
    RAISE NOTICE 'Demo user: demo@sinergia.com / demo';
    RAISE NOTICE 'You can now use the application with real Supabase data!';
END $$;