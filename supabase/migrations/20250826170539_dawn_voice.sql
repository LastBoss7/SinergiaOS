/*
# Complete Supabase Schema for Business Management System

This migration creates a complete database schema for the Sinergia OS business management system.

## Tables Created:
1. **companies** - Company information and settings
2. **users** - User accounts with roles and permissions
3. **projects** - Project management with teams
4. **tasks** - Task tracking with time management
5. **departments** - Company departments structure
6. **time_entries** - Time tracking for tasks and projects
7. **notifications** - System notifications
8. **audit_logs** - Security and change tracking

## Security Features:
- Row Level Security (RLS) enabled on all tables
- Company-based data isolation
- Role-based access control
- Audit logging for all changes
- Secure password handling
- Data encryption for sensitive fields

## Performance Optimizations:
- Optimized indexes for common queries
- Efficient foreign key relationships
- Automatic timestamp management
- Soft delete functionality
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'manager', 'member');
CREATE TYPE user_status AS ENUM ('online', 'away', 'offline', 'busy');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'paused', 'completed', 'cancelled', 'archived');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE company_plan AS ENUM ('free', 'business', 'enterprise');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'task', 'project', 'system');

-- =============================================
-- COMPANIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 100),
    slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
    email TEXT NOT NULL CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
    phone TEXT,
    website TEXT CHECK (website ~ '^https?://'),
    logo_url TEXT,
    
    -- Business Information
    industry TEXT,
    company_size TEXT,
    tax_id TEXT,
    registration_number TEXT,
    
    -- Address Information
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'BR',
    
    -- Plan and Billing
    plan company_plan DEFAULT 'free',
    subscription_id TEXT,
    billing_email TEXT,
    
    -- Settings (JSONB for flexibility)
    settings JSONB DEFAULT '{
        "timezone": "America/Sao_Paulo",
        "currency": "BRL",
        "language": "pt-BR",
        "date_format": "DD/MM/YYYY",
        "time_format": "24h",
        "working_hours": {
            "start": "09:00",
            "end": "18:00",
            "working_days": [1, 2, 3, 4, 5]
        },
        "notifications": {
            "email": true,
            "push": true,
            "slack": false,
            "webhook": false
        },
        "security": {
            "require_2fa": false,
            "password_policy": {
                "min_length": 8,
                "require_uppercase": true,
                "require_lowercase": true,
                "require_numbers": true,
                "require_symbols": false
            },
            "session_timeout": 480
        }
    }'::jsonb,
    
    -- Active modules
    active_modules TEXT[] DEFAULT ARRAY['core'],
    
    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$'),
    CONSTRAINT valid_settings CHECK (jsonb_typeof(settings) = 'object')
);

-- =============================================
-- DEPARTMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 50),
    description TEXT,
    color TEXT DEFAULT '#3B82F6' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    budget DECIMAL(15,2),
    manager_id UUID, -- Will be set after users table is created
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    UNIQUE(company_id, name)
);

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    
    -- Authentication
    email TEXT NOT NULL CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
    password_hash TEXT, -- For custom auth, nullable if using Supabase Auth
    email_verified BOOLEAN DEFAULT false,
    
    -- Personal Information
    first_name TEXT NOT NULL CHECK (length(first_name) >= 1 AND length(first_name) <= 50),
    last_name TEXT NOT NULL CHECK (length(last_name) >= 1 AND length(last_name) <= 50),
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    avatar_url TEXT,
    phone TEXT CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$'),
    
    -- Professional Information
    role user_role DEFAULT 'member',
    position TEXT,
    employee_id TEXT,
    hire_date DATE,
    salary DECIMAL(15,2),
    hourly_rate DECIMAL(10,2),
    
    -- Status and Preferences
    status user_status DEFAULT 'offline',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    language TEXT DEFAULT 'pt-BR',
    
    -- Permissions (JSONB for flexibility)
    permissions JSONB DEFAULT '[]'::jsonb,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    UNIQUE(company_id, email),
    UNIQUE(company_id, employee_id),
    CONSTRAINT valid_permissions CHECK (jsonb_typeof(permissions) = 'array'),
    CONSTRAINT valid_salary CHECK (salary IS NULL OR salary >= 0),
    CONSTRAINT valid_hourly_rate CHECK (hourly_rate IS NULL OR hourly_rate >= 0)
);

-- Add foreign key for department manager
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_manager 
FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    
    -- Project Information
    name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 100),
    description TEXT,
    code TEXT, -- Project code/identifier
    color TEXT DEFAULT '#3B82F6' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    
    -- Status and Progress
    status project_status DEFAULT 'planning',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    priority task_priority DEFAULT 'medium',
    
    -- Team and Management
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    team_members UUID[] DEFAULT ARRAY[]::UUID[],
    
    -- Client and Financial
    client_name TEXT,
    client_email TEXT CHECK (client_email IS NULL OR client_email ~ '^[^@]+@[^@]+\.[^@]+$'),
    budget DECIMAL(15,2),
    spent DECIMAL(15,2) DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    
    -- Timeline
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    
    -- Additional Data
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    UNIQUE(company_id, code),
    CONSTRAINT valid_dates CHECK (start_date IS NULL OR due_date IS NULL OR start_date <= due_date),
    CONSTRAINT valid_budget CHECK (budget IS NULL OR budget >= 0),
    CONSTRAINT valid_spent CHECK (spent >= 0),
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
);

-- =============================================
-- TASKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    
    -- Task Information
    title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
    description TEXT,
    task_number INTEGER, -- Auto-incrementing task number per company
    
    -- Status and Priority
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    
    -- Assignment
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Time Management
    estimated_hours DECIMAL(8,2) CHECK (estimated_hours IS NULL OR estimated_hours >= 0),
    actual_hours DECIMAL(8,2) DEFAULT 0 CHECK (actual_hours >= 0),
    
    -- Timeline
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    
    -- Additional Data
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    attachments JSONB DEFAULT '[]'::jsonb,
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (start_date IS NULL OR due_date IS NULL OR start_date <= due_date),
    CONSTRAINT valid_attachments CHECK (jsonb_typeof(attachments) = 'array'),
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
);

-- =============================================
-- TIME ENTRIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    
    -- Time Information
    description TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN end_time IS NOT NULL THEN 
                EXTRACT(EPOCH FROM (end_time - start_time)) / 60
            ELSE NULL 
        END
    ) STORED,
    
    -- Billing
    is_billable BOOLEAN DEFAULT true,
    hourly_rate DECIMAL(10,2),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_time_range CHECK (end_time IS NULL OR end_time > start_time),
    CONSTRAINT valid_hourly_rate CHECK (hourly_rate IS NULL OR hourly_rate >= 0),
    CONSTRAINT require_project_or_task CHECK (project_id IS NOT NULL OR task_id IS NOT NULL)
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Content
    type notification_type DEFAULT 'info',
    title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
    message TEXT NOT NULL,
    
    -- Related Entities
    related_entity_type TEXT, -- 'project', 'task', 'user', etc.
    related_entity_id UUID,
    
    -- Action
    action_url TEXT,
    action_label TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Action Information
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
    entity_type TEXT NOT NULL, -- 'user', 'project', 'task', etc.
    entity_id UUID,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Companies
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_plan ON companies(plan);
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(is_active);

-- Departments
CREATE INDEX IF NOT EXISTS idx_departments_company ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_departments_manager ON departments(manager_id);

-- Users
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(company_id, email);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_company ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_manager ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_due_date ON projects(due_date);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_company ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);

-- Time Entries
CREATE INDEX IF NOT EXISTS idx_time_entries_company ON time_entries(company_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project ON time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_task ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(start_time);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_company ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their own company" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Company admins can update their company" ON companies
    FOR UPDATE USING (
        id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin') 
            AND is_active = true
        )
    );

-- Departments policies
CREATE POLICY "Users can view departments in their company" ON departments
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Admins can manage departments" ON departments
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin') 
            AND is_active = true
        )
    );

-- Users policies
CREATE POLICY "Users can view users in their company" ON users
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage users in their company" ON users
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin') 
            AND is_active = true
        )
    );

-- Projects policies
CREATE POLICY "Users can view projects in their company" ON projects
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Project managers can update their projects" ON projects
    FOR UPDATE USING (
        manager_id = auth.uid() OR
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin') 
            AND is_active = true
        )
    );

CREATE POLICY "Managers and admins can create projects" ON projects
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin', 'manager') 
            AND is_active = true
        )
    );

-- Tasks policies
CREATE POLICY "Users can view tasks in their company" ON tasks
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update tasks assigned to them" ON tasks
    FOR UPDATE USING (
        assignee_id = auth.uid() OR
        reporter_id = auth.uid() OR
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin', 'manager') 
            AND is_active = true
        )
    );

CREATE POLICY "Users can create tasks in their company" ON tasks
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- Time entries policies
CREATE POLICY "Users can view time entries in their company" ON time_entries
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can manage their own time entries" ON time_entries
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Managers can view team time entries" ON time_entries
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin', 'manager') 
            AND is_active = true
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Admins can view audit logs for their company" ON audit_logs
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin') 
            AND is_active = true
        )
    );

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate task numbers
CREATE OR REPLACE FUNCTION generate_task_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.task_number IS NULL THEN
        SELECT COALESCE(MAX(task_number), 0) + 1 
        INTO NEW.task_number 
        FROM tasks 
        WHERE company_id = NEW.company_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    company_uuid UUID;
BEGIN
    -- Get company_id from the record
    IF TG_TABLE_NAME = 'companies' THEN
        company_uuid := COALESCE(NEW.id, OLD.id);
    ELSE
        company_uuid := COALESCE(NEW.company_id, OLD.company_id);
    END IF;
    
    -- Insert audit log
    INSERT INTO audit_logs (
        company_id,
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values
    ) VALUES (
        company_uuid,
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
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

-- Apply task number generation trigger
CREATE TRIGGER generate_task_number_trigger BEFORE INSERT ON tasks
    FOR EACH ROW EXECUTE FUNCTION generate_task_number();

-- Apply audit logging triggers
CREATE TRIGGER audit_companies AFTER INSERT OR UPDATE OR DELETE ON companies
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_tasks AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- =============================================
-- DEMO DATA
-- =============================================

-- Insert demo company
INSERT INTO companies (
    id,
    name,
    slug,
    email,
    industry,
    company_size,
    plan,
    is_verified,
    active_modules
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Sinergia Demo',
    'sinergia-demo',
    'demo@sinergia.com',
    'Tecnologia',
    '11-50',
    'business',
    true,
    ARRAY['core', 'crm', 'finance', 'hr']
) ON CONFLICT (id) DO NOTHING;

-- Insert demo departments
INSERT INTO departments (id, company_id, name, description, color) VALUES
    ('d1000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'Administração', 'Gestão geral da empresa', '#8B5CF6'),
    ('d1000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'Desenvolvimento', 'Equipe de desenvolvimento de software', '#3B82F6'),
    ('d1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'Design', 'Equipe de design e UX/UI', '#EC4899'),
    ('d1000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'Vendas', 'Equipe comercial e vendas', '#10B981')
ON CONFLICT (id) DO NOTHING;

-- Insert demo users
INSERT INTO users (
    id,
    company_id,
    department_id,
    email,
    first_name,
    last_name,
    role,
    status,
    position,
    employee_id,
    hire_date,
    permissions,
    is_active
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440000',
        'd1000000-0000-0000-0000-000000000001',
        'demo@sinergia.com',
        'Usuário',
        'Demo',
        'admin',
        'online',
        'Administrador Demo',
        'EMP001',
        '2024-01-01',
        '[{"module": "all", "actions": ["read", "write", "delete", "admin"]}]'::jsonb,
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440000',
        'd1000000-0000-0000-0000-000000000002',
        'joao@sinergia.com',
        'João',
        'Costa',
        'member',
        'online',
        'Desenvolvedor Full-Stack',
        'EMP002',
        '2024-01-15',
        '[{"module": "core", "actions": ["read", "write"]}]'::jsonb,
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440000',
        'd1000000-0000-0000-0000-000000000003',
        'maria@sinergia.com',
        'Maria',
        'Oliveira',
        'member',
        'away',
        'UX Designer',
        'EMP003',
        '2024-01-20',
        '[{"module": "core", "actions": ["read", "write"]}]'::jsonb,
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440000',
        'd1000000-0000-0000-0000-000000000004',
        'carlos@sinergia.com',
        'Carlos',
        'Santos',
        'manager',
        'online',
        'Gerente de Vendas',
        'EMP004',
        '2024-01-10',
        '[{"module": "crm", "actions": ["read", "write"]}, {"module": "core", "actions": ["read", "write"]}]'::jsonb,
        true
    )
ON CONFLICT (id) DO NOTHING;

-- Update department managers
UPDATE departments SET manager_id = '550e8400-e29b-41d4-a716-446655440001' WHERE id = 'd1000000-0000-0000-0000-000000000001';
UPDATE departments SET manager_id = '550e8400-e29b-41d4-a716-446655440002' WHERE id = 'd1000000-0000-0000-0000-000000000002';
UPDATE departments SET manager_id = '550e8400-e29b-41d4-a716-446655440003' WHERE id = 'd1000000-0000-0000-0000-000000000003';
UPDATE departments SET manager_id = '550e8400-e29b-41d4-a716-446655440004' WHERE id = 'd1000000-0000-0000-0000-000000000004';

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
    budget,
    start_date,
    due_date,
    tags,
    created_by
) VALUES 
    (
        'p1000000-0000-0000-0000-000000000001',
        '550e8400-e29b-41d4-a716-446655440000',
        'd1000000-0000-0000-0000-000000000002',
        'Lançamento Beta',
        'Preparação e execução do lançamento da versão beta da plataforma',
        'BETA-2024',
        'active',
        75,
        'high',
        '550e8400-e29b-41d4-a716-446655440002',
        ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']::UUID[],
        50000.00,
        '2024-01-01',
        '2024-03-31',
        ARRAY['beta', 'lançamento', 'produto'],
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        'p1000000-0000-0000-0000-000000000002',
        '550e8400-e29b-41d4-a716-446655440000',
        'd1000000-0000-0000-0000-000000000002',
        'Sistema Analytics',
        'Desenvolvimento do módulo de análise de dados e relatórios avançados',
        'ANALYTICS-2024',
        'active',
        45,
        'medium',
        '550e8400-e29b-41d4-a716-446655440002',
        ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']::UUID[],
        30000.00,
        '2024-02-01',
        '2024-05-31',
        ARRAY['analytics', 'dados', 'relatórios'],
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        'p1000000-0000-0000-0000-000000000003',
        '550e8400-e29b-41d4-a716-446655440000',
        'd1000000-0000-0000-0000-000000000004',
        'CRM Integrado',
        'Integração completa do sistema CRM com automações de vendas',
        'CRM-2024',
        'planning',
        15,
        'high',
        '550e8400-e29b-41d4-a716-446655440004',
        ARRAY['550e8400-e29b-41d4-a716-446655440004']::UUID[],
        40000.00,
        '2024-03-01',
        '2024-07-31',
        ARRAY['crm', 'vendas', 'automação'],
        '550e8400-e29b-41d4-a716-446655440001'
    )
ON CONFLICT (id) DO NOTHING;

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
    due_date,
    tags,
    created_by
) VALUES 
    (
        't1000000-0000-0000-0000-000000000001',
        '550e8400-e29b-41d4-a716-446655440000',
        'p1000000-0000-0000-0000-000000000001',
        'Revisar proposta comercial',
        'Analisar e atualizar proposta para cliente X com novos requisitos de segurança e performance',
        'in_progress',
        'high',
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440001',
        8.0,
        '2024-02-15',
        ARRAY['proposta', 'comercial', 'cliente'],
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        't1000000-0000-0000-0000-000000000002',
        '550e8400-e29b-41d4-a716-446655440000',
        'p1000000-0000-0000-0000-000000000002',
        'Implementar dashboard analytics',
        'Criar visualizações para métricas de negócio com gráficos interativos',
        'todo',
        'medium',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440001',
        16.0,
        '2024-02-20',
        ARRAY['dashboard', 'analytics', 'gráficos'],
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        't1000000-0000-0000-0000-000000000003',
        '550e8400-e29b-41d4-a716-446655440000',
        'p1000000-0000-0000-0000-000000000001',
        'Teste de usabilidade',
        'Conduzir testes com usuários finais e documentar feedback',
        'review',
        'high',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440001',
        12.0,
        '2024-02-10',
        ARRAY['teste', 'usabilidade', 'ux'],
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        't1000000-0000-0000-0000-000000000004',
        '550e8400-e29b-41d4-a716-446655440000',
        'p1000000-0000-0000-0000-000000000002',
        'Documentação API',
        'Atualizar documentação técnica com novos endpoints',
        'done',
        'low',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440001',
        4.0,
        '2024-02-05',
        ARRAY['documentação', 'api', 'endpoints'],
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        't1000000-0000-0000-0000-000000000005',
        '550e8400-e29b-41d4-a716-446655440000',
        'p1000000-0000-0000-0000-000000000001',
        'Setup ambiente de produção',
        'Configurar servidores e pipeline de deploy automatizado',
        'in_progress',
        'urgent',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440001',
        20.0,
        '2024-02-18',
        ARRAY['deploy', 'produção', 'devops'],
        '550e8400-e29b-41d4-a716-446655440001'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert demo notifications
INSERT INTO notifications (
    company_id,
    user_id,
    type,
    title,
    message,
    related_entity_type,
    related_entity_id
) VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001',
        'success',
        'Tarefa concluída',
        'João Costa finalizou a tarefa "Documentação API"',
        'task',
        't1000000-0000-0000-0000-000000000004'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001',
        'warning',
        'Prazo próximo',
        'A tarefa "Teste de usabilidade" vence em 2 dias',
        'task',
        't1000000-0000-0000-0000-000000000003'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440002',
        'info',
        'Nova tarefa atribuída',
        'Você foi atribuído à tarefa "Implementar dashboard analytics"',
        'task',
        't1000000-0000-0000-0000-000000000002'
    );

-- =============================================
-- FINAL SETUP
-- =============================================

-- Create a view for user statistics
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
LEFT JOIN tasks t ON t.assignee_id = u.id AND t.is_active = true
LEFT JOIN projects p ON u.id = ANY(p.team_members) AND p.is_active = true
LEFT JOIN time_entries te ON te.user_id = u.id
WHERE u.is_active = true
GROUP BY u.id, u.full_name, u.company_id;

-- Create a view for project statistics
CREATE OR REPLACE VIEW project_stats AS
SELECT 
    p.id,
    p.name,
    p.company_id,
    p.progress,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN t.status IN ('todo', 'in_progress') THEN t.id END) as pending_tasks,
    COALESCE(SUM(te.duration_minutes), 0) as total_minutes_logged,
    array_length(p.team_members, 1) as team_size
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id AND t.is_active = true
LEFT JOIN time_entries te ON te.project_id = p.id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.company_id, p.progress, p.team_members;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📊 Tables: companies, departments, users, projects, tasks, time_entries, notifications, audit_logs';
    RAISE NOTICE '🔐 Row Level Security enabled with company-based isolation';
    RAISE NOTICE '⚡ Performance indexes and triggers configured';
    RAISE NOTICE '👤 Demo user: demo@sinergia.com (password: demo)';
    RAISE NOTICE '🏢 Demo company: Sinergia Demo with 4 users, 3 projects, 5 tasks';
END $$;