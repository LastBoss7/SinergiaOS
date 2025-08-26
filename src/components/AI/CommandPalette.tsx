import React, { useState, useEffect } from 'react';
import { 
  Search, Bot, Lightbulb, AlertTriangle, TrendingUp, X, Plus, Users, BarChart3, MessageCircle,
  Zap, Calendar, Target, DollarSign, FileText, Settings, Clock, Star, Send, Sparkles,
  Brain, Activity, ChevronRight, Command, Mic, MicOff
} from 'lucide-react';
import { mockInsights } from '../../data/mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string, data?: any) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onAction }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [recentCommands, setRecentCommands] = useState([
    'Criar projeto "Website 2.0"',
    'Mostrar relatório de vendas',
    'Agendar reunião com equipe',
    'Exportar dados do último mês'
  ]);
  
  const [suggestions] = useState([
    { text: 'Criar novo projeto', action: 'create-project', icon: Plus, category: 'create', description: 'Iniciar um novo projeto com equipe' },
    { text: 'Adicionar nova tarefa', action: 'create-task', icon: Target, category: 'create', description: 'Criar tarefa e atribuir responsável' },
    { text: 'Convidar membro da equipe', action: 'invite-member', icon: Users, category: 'team', description: 'Enviar convite por email ou link' },
    { text: 'Relatório de produtividade', action: 'productivity-report', icon: BarChart3, category: 'analytics', description: 'Métricas da equipe e projetos' },
    { text: 'Mensagens não lidas', action: 'unread-messages', icon: MessageCircle, category: 'communication', description: 'Ver conversas pendentes' },
    { text: 'Projetos em atraso', action: 'overdue-projects', icon: AlertTriangle, category: 'alerts', description: 'Identificar gargalos e riscos' },
    { text: 'Agendar reunião', action: 'schedule-meeting', icon: Calendar, category: 'calendar', description: 'Criar evento no calendário' },
    { text: 'Exportar relatório financeiro', action: 'export-financial', icon: DollarSign, category: 'finance', description: 'Baixar dados em Excel/PDF' },
    { text: 'Configurar automação', action: 'setup-automation', icon: Zap, category: 'automation', description: 'Criar fluxo de trabalho automatizado' },
    { text: 'Backup dos dados', action: 'backup-data', icon: FileText, category: 'system', description: 'Fazer backup completo do sistema' },
  ]);

  const categories = [
    { id: 'all', name: 'Todos', icon: Command },
    { id: 'create', name: 'Criar', icon: Plus },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'team', name: 'Equipe', icon: Users },
    { id: 'automation', name: 'Automação', icon: Zap },
    { id: 'communication', name: 'Comunicação', icon: MessageCircle },
  ];

  const filteredSuggestions = activeCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === activeCategory);

  const handleSuggestionClick = (suggestion: any) => {
    // Add to recent commands
    setRecentCommands(prev => [suggestion.text, ...prev.filter(cmd => cmd !== suggestion.text).slice(0, 3)]);
    
    if (onAction) {
      onAction(suggestion.action);
    }
    onClose();
  };

  const handleQuerySubmit = () => {
    if (query.trim() && onAction) {
      // Add to recent commands
      setRecentCommands(prev => [query, ...prev.filter(cmd => cmd !== query).slice(0, 3)]);
      onAction('ai-query', { query });
      onClose();
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && query.trim()) {
        handleQuerySubmit();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    // Auto-focus input when opened
    if (isOpen) {
      setTimeout(() => document.getElementById('command-input')?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'info': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      default: return <Bot className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 animate-fade-in">
      <div className="w-full max-w-3xl mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-up">
        {/* Enhanced Header */}
        <div className="flex items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 relative">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-slate-400" />
              {isListening && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
            </div>
            <input
              id="command-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pergunte qualquer coisa à IA, digite um comando ou use sua voz..."
              className="absolute inset-0 pl-8 pr-16 py-2 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none text-lg"
            />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500'
                }`}
                title="Comando por voz"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              {query.trim() && (
                <button
                  onClick={handleQuerySubmit}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="Executar comando"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors ml-2"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1 px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!query && (
            <div className="p-6">
              {/* Recent Commands */}
              {recentCommands.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Comandos Recentes</span>
                  </h3>
                  <div className="space-y-2">
                    {recentCommands.map((command, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(command)}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{command}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Insights Recentes da IA</span>
              </h3>
              <div className="space-y-3">
                {mockInsights.slice(0, 2).map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-lg hover:from-slate-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-blue-900/30 transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 group"
                  >
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {insight.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {insight.description.slice(0, 120)}...
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            insight.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                          }`}>
                            {insight.priority === 'high' ? 'Alta Prioridade' : 
                             insight.priority === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-4 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>Comandos Sugeridos</span>
                {activeCategory !== 'all' && (
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                    {categories.find(c => c.id === activeCategory)?.name}
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={index}
                      className="w-full flex items-start space-x-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 text-left border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md group"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                        suggestion.category === 'create' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        suggestion.category === 'analytics' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        suggestion.category === 'team' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        suggestion.category === 'automation' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          suggestion.category === 'create' ? 'text-emerald-600 dark:text-emerald-400' :
                          suggestion.category === 'analytics' ? 'text-blue-600 dark:text-blue-400' :
                          suggestion.category === 'team' ? 'text-purple-600 dark:text-purple-400' :
                          suggestion.category === 'automation' ? 'text-amber-600 dark:text-amber-400' :
                          'text-slate-600 dark:text-slate-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {suggestion.text}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mt-1" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {query && (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">IA Processando...</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Analisando sua solicitação</p>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Resposta da IA Sinergia
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      Entendi sua solicitação: <strong>"{query}"</strong>
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                      No ambiente de demonstração, essa funcionalidade seria processada pela IA integrada do Sinergia OS 
                      para fornecer insights precisos, automações inteligentes e ações baseadas nos dados da sua empresa.
                    </p>
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-xs text-blue-600 dark:text-blue-400">Processamento concluído</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setQuery('')}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">Limpar</span>
                </button>
                <button
                  onClick={handleQuerySubmit}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-sm">Executar Comando</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Pressione <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">Enter</kbd> para executar</span>
              <span>Pressione <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">Esc</kbd> para fechar</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span>IA Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;