/*
  # Initial Schema for Sinergia OS

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `plan` (text)
      - `industry` (text)
      - `size` (text)
      - `address` (text)
      - `phone` (text)
      - `website` (text)
      - `settings` (jsonb)
      - `modules` (text array)
      - `created_at` (timestamp)
    
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text)
      - `status` (text)
      - `department` (text)
      - `position` (text)
      - `phone` (text)
      - `location` (text)
      - `join_date` (timestamp)
      - `last_login` (timestamp)
      - `permissions` (jsonb)
      - `company_id` (uuid, foreign key)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `status` (text)
      - `progress` (integer)
      - `team_members` (uuid array)
      - `manager_id` (uuid, foreign key)
      - `budget` (decimal)
      - `spent` (decimal)
      - `due_date` (timestamp)
      - `client` (text)
      - `tags` (text array)
      - `company_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `priority` (text)
      - `assignee_id` (uuid, foreign key)
      - `reporter_id` (uuid, foreign key)
      - `due_date` (timestamp)
      - `project_id` (uuid, foreign key)
      - `tags` (text array)
      - `time_tracked` (integer)
      - `estimated_time` (integer)
      - `company_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for company-based access control
*/

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
  settings jsonb DEFAULT '{}',
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
  permissions jsonb DEFAULT '[]',
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
  team_members uuid[] DEFAULT ARRAY[]::uuid[],
  manager_id uuid REFERENCES users(id),
  budget decimal,
  spent decimal DEFAULT 0,
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

-- Companies policies
CREATE POLICY "Users can read their own company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (id IN (
    SELECT company_id FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

-- Users policies
CREATE POLICY "Users can read company members"
  ON users
  FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage company users"
  ON users
  FOR ALL
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ));

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Projects policies
CREATE POLICY "Users can read company projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Managers can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Tasks policies
CREATE POLICY "Users can read company tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage assigned tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (
    assignee_id = auth.uid() OR 
    reporter_id = auth.uid() OR
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);

-- Insert demo company and user
INSERT INTO companies (id, name, email, plan, industry, size, settings, modules) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Sinergia Demo', 'demo@sinergia.com', 'free', 'Demonstração', '1-10', 
   '{"timezone": "America/Sao_Paulo", "currency": "BRL", "language": "pt-BR", "workingHours": {"start": "09:00", "end": "18:00", "workingDays": [1,2,3,4,5]}, "notifications": {"email": true, "push": true, "slack": false}}',
   ARRAY['core'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, role, status, department, position, phone, location, permissions, company_id, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Usuário Demo', 'demo@sinergia.com', 'admin', 'online', 'Demonstração', 'Admin Demo', '+55 (11) 99999-0000', 'São Paulo, SP',
   '[{"module": "all", "actions": ["read", "write", "delete", "admin"]}]',
   '550e8400-e29b-41d4-a716-446655440000', true)
ON CONFLICT (email) DO NOTHING;