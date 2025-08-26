import React, { useState } from 'react';
import { Plus, Hash, Users, Search, Send, Paperclip, Smile, MoreHorizontal, Phone, Video } from 'lucide-react';
import { mockMessages, mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const MessagesView: React.FC = () => {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState('geral');
  const [messageInput, setMessageInput] = useState('');

  const channels = [
    { id: 'geral', name: 'Geral', type: 'public', unread: 3 },
    { id: 'projetos', name: 'Projetos', type: 'public', unread: 1 },
    { id: 'marketing', name: 'Marketing', type: 'public', unread: 0 },
    { id: 'desenvolvimento', name: 'Desenvolvimento', type: 'public', unread: 5 },
    { id: 'recursos-humanos', name: 'Recursos Humanos', type: 'private', unread: 0 },
  ];

  const directMessages = [
    { user: mockUsers[1], unread: 2, lastMessage: 'Vou revisar o documento hoje', time: '10:30' },
    { user: mockUsers[2], unread: 0, lastMessage: 'Perfeito! Obrigada', time: '09:15' },
    { user: mockUsers[3], unread: 1, lastMessage: 'Posso te ligar em 10min?', time: '08:45' },
  ];

  const channelMessages = mockMessages.filter(msg => msg.channel === activeChannel);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Aqui seria implementada a lógica para enviar mensagem
      console.log('Enviando mensagem:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex">
      {/* Sidebar de Canais */}
      <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Mensagens</h1>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Canais */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Canais
            </h3>
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    activeChannel === channel.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-medium">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mensagens Diretas */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Mensagens Diretas
            </h3>
            <div className="space-y-2">
              {directMessages.map((dm) => (
                <button
                  key={dm.user.id}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {dm.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${
                      dm.user.status === 'online' ? 'bg-emerald-400' :
                      dm.user.status === 'away' ? 'bg-amber-400' : 'bg-slate-400'
                    } rounded-full border-2 border-white dark:border-slate-900`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {dm.user.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{dm.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{dm.lastMessage}</p>
                  </div>
                  {dm.unread > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {dm.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Channel List */}
      <div className="lg:hidden w-full bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Canais</h2>
        <div className="grid grid-cols-2 gap-3">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                activeChannel === channel.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span className="text-sm font-medium">{channel.name}</span>
              </div>
              {channel.unread > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {channel.unread}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-6 mb-3">
          Mensagens Diretas
        </h3>
        <div className="space-y-2">
          {directMessages.map((dm) => (
            <div key={dm.user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {dm.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className="text-sm text-slate-900 dark:text-white">{dm.user.name}</span>
              {dm.unread > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[16px] text-center">
                  {dm.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Área Principal de Chat */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
        {/* Header do Chat */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Hash className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  {channels.find(c => c.id === activeChannel)?.name || 'Geral'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {mockUsers.filter(u => u.status === 'online').length} membros online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channelMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {message.sender.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {/* IA Assistant Message */}
          <div className="flex items-start space-x-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <span className="text-sm font-bold">IA</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-blue-800 dark:text-blue-200">Assistente IA</span>
                <span className="text-xs text-blue-600 dark:text-blue-400">agora</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                📊 <strong>Insight Automático:</strong> Detectei que a produtividade da equipe aumentou 23% esta semana. 
                O projeto "Lançamento Beta\" está 15% adiantado no cronograma. Recomendo aproveitar esse momentum 
                para antecipar algumas entregas do próximo sprint.
              </p>
            </div>
          </div>
        </div>

        {/* Input de Mensagem */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Mensagem para #${channels.find(c => c.id === activeChannel)?.name || 'geral'}`}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Smile className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;