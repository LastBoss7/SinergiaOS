import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, Book, Video, Mail, Phone, Search, ExternalLink, FileText, Lightbulb, AlertCircle, CheckCircle, Clock, Star, Send, Paperclip, Smile } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('help');
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    attachments: [] as File[]
  });

  if (!isOpen) return null;

  const helpCategories = [
    {
      id: 'getting-started',
      name: 'Primeiros Passos',
      icon: Lightbulb,
      articles: [
        { title: 'Como configurar sua empresa', views: 1250, helpful: 95 },
        { title: 'Convidar membros da equipe', views: 890, helpful: 92 },
        { title: 'Criar seu primeiro projeto', views: 1100, helpful: 88 },
        { title: 'Configurar notificações', views: 650, helpful: 85 }
      ]
    },
    {
      id: 'projects',
      name: 'Gestão de Projetos',
      icon: FileText,
      articles: [
        { title: 'Usando o quadro Kanban', views: 980, helpful: 94 },
        { title: 'Controle de tempo e produtividade', views: 750, helpful: 91 },
        { title: 'Relatórios de progresso', views: 620, helpful: 87 },
        { title: 'Integrações com ferramentas externas', views: 450, helpful: 83 }
      ]
    },
    {
      id: 'crm',
      name: 'CRM & Vendas',
      icon: MessageSquare,
      articles: [
        { title: 'Gerenciar pipeline de vendas', views: 840, helpful: 93 },
        { title: 'Automações de follow-up', views: 560, helpful: 89 },
        { title: 'Relatórios de conversão', views: 420, helpful: 86 },
        { title: 'Integração com email marketing', views: 320, helpful: 82 }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics & IA',
      icon: Star,
      articles: [
        { title: 'Interpretando insights da IA', views: 720, helpful: 96 },
        { title: 'Configurar KPIs personalizados', views: 480, helpful: 90 },
        { title: 'Análise preditiva de negócios', views: 380, helpful: 88 },
        { title: 'Exportar dados para análise', views: 290, helpful: 84 }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Central de Ajuda',
      description: 'Documentação completa e tutoriais',
      icon: Book,
      action: () => setActiveTab('help'),
      color: 'blue'
    },
    {
      title: 'Vídeo Tutoriais',
      description: 'Aprenda assistindo nossos vídeos',
      icon: Video,
      action: () => window.open('https://youtube.com/insightos', '_blank'),
      color: 'red'
    },
    {
      title: 'Chat ao Vivo',
      description: 'Fale conosco em tempo real',
      icon: MessageSquare,
      action: () => setActiveTab('chat'),
      color: 'emerald'
    },
    {
      title: 'Abrir Ticket',
      description: 'Reporte problemas ou solicite recursos',
      icon: Mail,
      action: () => setActiveTab('ticket'),
      color: 'purple'
    }
  ];

  const recentTickets = [
    {
      id: 'TK-001',
      subject: 'Problema com sincronização de dados',
      status: 'resolved',
      priority: 'high',
      created: '2024-01-15',
      updated: '2024-01-16'
    },
    {
      id: 'TK-002',
      subject: 'Solicitação de nova funcionalidade',
      status: 'in_progress',
      priority: 'medium',
      created: '2024-01-14',
      updated: '2024-01-15'
    },
    {
      id: 'TK-003',
      subject: 'Dúvida sobre relatórios',
      status: 'pending',
      priority: 'low',
      created: '2024-01-13',
      updated: '2024-01-13'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getActionColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      red: 'from-red-500 to-red-600',
      emerald: 'from-emerald-500 to-emerald-600',
      purple: 'from-purple-500 to-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleSubmitTicket = () => {
    console.log('Submitting ticket:', ticketForm);
    // Reset form
    setTicketForm({
      subject: '',
      category: '',
      priority: 'medium',
      description: '',
      attachments: []
    });
    setActiveTab('help');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Central de Ajuda & Suporte
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Encontre respostas ou entre em contato conosco
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-4 bg-gradient-to-r ${getActionColor(action.color)} text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 group`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs opacity-90">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 mx-6 mt-4 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'help'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Central de Ajuda
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ticket'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Abrir Ticket
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Chat ao Vivo
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'tickets'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Meus Tickets
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar na central de ajuda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {helpCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {category.name}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {category.articles.map((article, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-3 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {article.title}
                              </h4>
                              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-500">
                              <span>{article.views} visualizações</span>
                              <span>{article.helpful}% útil</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ticket Tab */}
          {activeTab === 'ticket' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  Abrir Novo Ticket de Suporte
                </h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Categoria
                      </label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecionar categoria</option>
                        <option value="bug">Reportar Bug</option>
                        <option value="feature">Solicitar Funcionalidade</option>
                        <option value="question">Dúvida Técnica</option>
                        <option value="billing">Cobrança</option>
                        <option value="account">Conta</option>
                        <option value="other">Outros</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Prioridade
                      </label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Assunto
                    </label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva brevemente o problema ou solicitação"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Descrição Detalhada
                    </label>
                    <textarea
                      rows={6}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Forneça o máximo de detalhes possível sobre o problema ou solicitação..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Anexos (Opcional)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Arraste arquivos aqui ou clique para selecionar
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Screenshots, logs, documentos (máx 10MB cada)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('help')}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitTicket}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Ticket</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                      Chat ao Vivo
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-emerald-700 dark:text-emerald-300">
                        Suporte online • Tempo de resposta: ~2 min
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 min-h-64">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        S
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
                          <p className="text-sm text-slate-900 dark:text-white">
                            Olá! 👋 Sou o assistente de suporte do InsightOS. Como posso ajudá-lo hoje?
                          </p>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-500 mt-1 block">
                          Agora
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Meus Tickets de Suporte
                </h3>
                <button
                  onClick={() => setActiveTab('ticket')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Novo Ticket</span>
                </button>
              </div>

              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {ticket.subject}
                          </h4>
                          <span className="text-sm text-slate-500 dark:text-slate-500 font-mono">
                            {ticket.id}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status === 'resolved' ? 'Resolvido' :
                             ticket.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority === 'high' ? 'Alta' :
                             ticket.priority === 'medium' ? 'Média' : 
                             ticket.priority === 'low' ? 'Baixa' : 'Urgente'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-500 dark:text-slate-500">
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>Criado: {new Date(ticket.created).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div>
                          Atualizado: {new Date(ticket.updated).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {ticket.status === 'resolved' && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                        {ticket.status === 'in_progress' && (
                          <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                        )}
                        {ticket.status === 'pending' && (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {ticket.status === 'resolved' ? 'Ticket resolvido com sucesso' :
                           ticket.status === 'in_progress' ? 'Nossa equipe está trabalhando nisso' :
                           'Aguardando resposta da equipe'}
                        </span>
                      </div>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                        Ver Detalhes →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+55 (11) 3333-3333</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>suporte@insightos.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Suporte Online 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;