# Sinergia - Sistema de Gestão Empresarial

## 🚀 Configuração do Supabase

Para conectar o sistema ao Supabase e ter dados persistentes:

### 1. Configurar Supabase
1. Clique em **"Connect to Supabase"** no canto superior direito
2. Configure suas credenciais do Supabase

### 2. Criar Tabelas no Banco
1. Vá para o **Supabase Dashboard** do seu projeto
2. Navegue para **"SQL Editor"**
3. Copie e execute o script do arquivo `database-setup.sql`

### 3. Verificar Configuração
- As tabelas `companies`, `users`, `projects` e `tasks` devem ser criadas
- Row Level Security (RLS) será habilitado automaticamente
- Dados demo serão inseridos para teste

## 🎯 Funcionalidades

### Sistema Híbrido
- **Supabase**: Dados persistentes na nuvem (quando configurado)
- **localStorage**: Fallback local (quando Supabase não está disponível)
- **Transição automática**: O sistema detecta e usa a melhor opção

### Autenticação
- **Usuário Demo**: `demo@sinergia.com` / `demo`
- **Cadastro funcional**: Cria empresa e usuário admin
- **Login persistente**: Mantém sessão entre recarregamentos

### Gestão de Equipe
- **Convites reais**: Adiciona usuários à base de dados
- **Perfis editáveis**: Alterações são salvas
- **Isolamento por empresa**: Cada empresa vê apenas seus dados

## 🛠️ Como Usar

1. **Sem Supabase**: O sistema funciona com localStorage
2. **Com Supabase**: Configure conforme instruções acima
3. **Teste**: Use `demo@sinergia.com` / `demo` ou cadastre nova empresa

## 📊 Status Atual

- ✅ Sistema híbrido funcionando
- ✅ Fallback para localStorage
- ✅ Interface completa
- ⏳ Aguardando configuração do Supabase para dados persistentes