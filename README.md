# Sinergia OS - Sistema de Gestão Empresarial Completo

## 🚀 Configuração do Supabase

Para conectar o sistema ao Supabase e ter dados persistentes:

### 1. Configurar Supabase
1. Clique em **"Connect to Supabase"** no canto superior direito
2. Configure suas credenciais do Supabase

### 2. Criar Schema Completo no Banco
1. Vá para o **Supabase Dashboard** do seu projeto
2. Navegue para **"SQL Editor"**
3. Copie e execute o script completo do arquivo `supabase/migrations/001_create_complete_schema.sql`

### 3. Verificar Configuração
- **8 tabelas principais** serão criadas com relacionamentos completos
- **Row Level Security (RLS)** habilitado automaticamente
- **Políticas de segurança** granulares por empresa e função
- **Dados demo** inseridos para teste imediato
- **Índices otimizados** para performance
- **Triggers automáticos** para auditoria e timestamps

## 🎯 Funcionalidades Completas

### 📊 Base de Dados Robusta
- **companies**: Empresas com configurações avançadas
- **departments**: Departamentos com orçamentos e gerentes
- **users**: Usuários com roles, permissões e segurança 2FA
- **projects**: Projetos com equipes, orçamentos e timeline
- **tasks**: Tarefas com tracking de tempo e dependências
- **time_entries**: Controle de horas trabalhadas
- **notifications**: Sistema de notificações em tempo real
- **audit_logs**: Log completo de auditoria e segurança

### 🔐 Segurança Avançada
- **Row Level Security**: Isolamento total por empresa
- **Políticas granulares**: Controle por função (admin, manager, member)
- **Auditoria completa**: Log de todas as alterações
- **Autenticação robusta**: Suporte a 2FA e bloqueio por tentativas
- **Criptografia**: Dados sensíveis protegidos

### ⚡ Performance Otimizada
- **Índices estratégicos**: Consultas rápidas em todas as tabelas
- **Views materializadas**: Estatísticas pré-calculadas
- **Triggers automáticos**: Timestamps e numeração automática
- **Relacionamentos eficientes**: Foreign keys otimizadas

### 👥 Gestão Empresarial Completa
- **Multi-empresa**: Isolamento total entre empresas
- **Departamentos**: Estrutura organizacional completa
- **Roles e permissões**: Controle granular de acesso
- **Projetos e tarefas**: Gestão completa com timeline
- **Controle de tempo**: Tracking detalhado de horas
- **Notificações**: Sistema em tempo real

## 🛠️ Como Usar

### Primeira Configuração:
1. **Execute o script SQL** no Supabase Dashboard
2. **Configure as variáveis** de ambiente (.env)
3. **Teste com usuário demo**: `demo@sinergia.com` / `demo`

### Sistema Híbrido:
- **Com Supabase**: Dados persistentes na nuvem
- **Sem Supabase**: Fallback automático para localStorage
- **Transição transparente**: Sistema detecta automaticamente

### Dados Demo Inclusos:
- 🏢 **Empresa demo** com configurações completas
- 👥 **4 usuários** com diferentes roles e departamentos
- 📋 **3 projetos** em diferentes estágios
- ✅ **5 tarefas** com status variados
- 📊 **Estatísticas reais** baseadas nos dados

## 📈 Recursos Avançados

### Views Estatísticas:
- **user_stats**: Estatísticas por usuário
- **project_stats**: Métricas de projetos

### Funções Automáticas:
- **Numeração de tarefas**: Auto-incremento por empresa
- **Timestamps**: Atualização automática
- **Auditoria**: Log automático de mudanças

### Tipos Customizados:
- **user_role**: super_admin, admin, manager, member
- **project_status**: planning, active, paused, completed, cancelled, archived
- **task_priority**: low, medium, high, urgent
- **notification_type**: info, success, warning, error, task, project, system

## 🔧 Estrutura Técnica

### Relacionamentos:
```
companies (1) → (N) departments
companies (1) → (N) users
companies (1) → (N) projects
companies (1) → (N) tasks
users (1) → (N) time_entries
projects (1) → (N) tasks
tasks (1) → (N) time_entries
```

### Segurança RLS:
- Todas as tabelas isoladas por `company_id`
- Políticas específicas por função de usuário
- Controle granular de leitura/escrita
- Auditoria completa de acessos

## 📊 Status Atual

- ✅ **Schema completo** com 8 tabelas principais
- ✅ **Segurança robusta** com RLS e políticas
- ✅ **Performance otimizada** com índices
- ✅ **Dados demo** para teste imediato
- ✅ **Sistema híbrido** com fallback
- ✅ **Interface completa** integrada
- ✅ **Auditoria e logs** implementados
- ✅ **Notificações** em tempo real

O sistema está pronto para produção com uma base de dados empresarial completa e segura! 🚀