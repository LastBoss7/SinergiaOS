import React, { useState } from 'react';
import { X, Mail, User, Shield, Send, Plus, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (inviteData: any) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, onInvite }) => {
  const { addUserToCompany } = useAuth();
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link'>('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    department: '',
    position: '',
    message: '',
  });
  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inviteMethod === 'email') {
      handleEmailInvite();
    } else {
      // Gerar link de convite
      const link = `${window.location.origin}/invite/${Math.random().toString(36).substr(2, 9)}`;
      setInviteLink(link);
      
      if (onInvite) {
        onInvite({
          type: 'link',
          link,
          role: formData.role,
          department: formData.department,
        });
      }
    }
  };

  const handleEmailInvite = async () => {
    try {
      const newUser = await addUserToCompany?.(formData);
      
      if (newUser && onInvite) {
        onInvite({
          type: 'email',
          user: newUser,
          ...formData,
        });
      }
    } catch (error) {
      console.error('Error inviting user:', error);
    }
    
    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      role: 'member',
      department: '',
      position: '',
      message: '',
    });
    onClose();
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const departments = [
    'Administração', 'Vendas', 'Marketing', 'Desenvolvimento', 
    'Design', 'Recursos Humanos', 'Financeiro', 'Operações', 'Suporte'
  ];

  const roles = [
    { value: 'member', label: 'Membro', description: 'Acesso básico aos projetos atribuídos' },
    { value: 'manager', label: 'Gerente', description: 'Pode gerenciar projetos e equipes' },
    { value: 'admin', label: 'Administrador', description: 'Acesso total ao sistema' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Convidar Novo Membro
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Método de convite */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Método de Convite
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInviteMethod('email')}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  inviteMethod === 'email'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                }`}
              >
                <Mail className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-slate-900 dark:text-white">Por Email</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enviar convite diretamente por email
                </p>
              </button>

              <button
                type="button"
                onClick={() => setInviteMethod('link')}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  inviteMethod === 'link'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                }`}
              >
                <Copy className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-slate-900 dark:text-white">Por Link</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Gerar link de convite para compartilhar
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {inviteMethod === 'email' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome do funcionário"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@empresa.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Desenvolvedor, Designer, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Departamento
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecionar departamento</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Mensagem Personalizada
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adicione uma mensagem de boas-vindas (opcional)"
                  />
                </div>
              </>
            )}

            {/* Nível de Acesso */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Nível de Acesso *
              </label>
              <div className="space-y-3">
                {roles.map((role) => (
                  <label key={role.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:ring-2 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {role.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {role.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Link gerado */}
            {inviteMethod === 'link' && inviteLink && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Link de Convite Gerado
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={copyInviteLink}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{linkCopied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Este link expira em 7 dias e pode ser usado apenas uma vez.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {inviteMethod === 'email' ? <Send className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{inviteMethod === 'email' ? 'Enviar Convite' : 'Gerar Link'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;