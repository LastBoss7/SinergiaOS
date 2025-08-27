import React, { useState, useEffect } from 'react';
import { Plus, Hash, Users, Search, Send, Paperclip, Smile, MoreHorizontal, Phone, Video, UserPlus, Settings, Archive, Pin, Star, Reply, Edit, Trash2, Copy, Forward, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: string;
  channel: string;
  type: 'text' | 'system';
  edited?: boolean;
  reactions?: any[];
}

const MessagesView: React.FC = () => {
  const { user, company, getCompanyUsers } = useAuth();
  const [activeChannel, setActiveChannel] = useState('geral');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);

  const channels = [
    { id: 'geral', name: 'Geral', type: 'public', unread: 3 },
    { id: 'projetos', name: 'Projetos', type: 'public', unread: 1 },
    { id: 'marketing', name: 'Marketing', type: 'public', unread: 0 },
    { id: 'desenvolvimento', name: 'Desenvolvimento', type: 'public', unread: 5 },
    { id: 'recursos-humanos', name: 'Recursos Humanos', type: 'private', unread: 0 },
    { id: 'random', name: 'Random', type: 'public', unread: 2 },
    { id: 'anuncios', name: 'Anúncios', type: 'public', unread: 0 },
  ];

  // Load messages and users
  useEffect(() => {
    if (!company) return;

    // Load company users
    const users = getCompanyUsers();
    setCompanyUsers(users);

    // Load messages from localStorage
    const savedMessages = localStorage.getItem(`insightos_messages_${company.id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initialize with welcome message
      const welcomeMessage: Message = {
        id: 'msg-welcome',
        content: `Bem-vindos ao chat da ${company.name}! 🎉 Use este espaço para colaborar com sua equipe.`,
        sender: {
          id: 'system',
          name: 'Sistema InsightOS',
          role: 'system'
        },
        timestamp: new Date().toISOString(),
        channel: 'geral',
        type: 'system',
        edited: false,
        reactions: []
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(`insightos_messages_${company.id}`, JSON.stringify([welcomeMessage]));
    }
  }, [company, getCompanyUsers]);

  const directMessages = companyUsers
    .filter(u => u.id !== user?.id)
    .map(u => ({
      user: u,
      unread: Math.floor(Math.random() * 3),
      lastMessage: 'Última mensagem...',
      time: '10:30'
    }));

  const channelMessages = messages.filter(msg => 
    selectedUser 
      ? (msg.sender.id === selectedUser && msg.channel === 'direct') || 
        (msg.sender.id === user?.id && msg.channel === 'direct')
      : msg.channel === activeChannel
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !user || !company) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageInput,
      sender: {
        id: user.id,
        name: user.name,
        role: user.role
      },
      timestamp: new Date().toISOString(),
      channel: selectedUser ? 'direct' : activeChannel,
      type: 'text',
      edited: false,
      reactions: []
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`insightos_messages_${company.id}`, JSON.stringify(updatedMessages));
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChannelSelect = (channelId: string) => {
    setActiveChannel(channelId);
    setSelectedUser(null);
  };

  const handleDirectMessageSelect = (userId: string) => {
    setSelectedUser(userId);
    setActiveChannel('');
  };

  const getCurrentChannelName = () => {
    if (selectedUser) {
      const selectedUserData = companyUsers.find(u => u.id === selectedUser);
      return selectedUserData?.name || 'Usuário';
    }
    const channel = channels.find(c => c.id === activeChannel);
    return channel?.name || 'Canal';
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
                  onClick={() => handleChannelSelect(channel.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    activeChannel === channel.id && !selectedUser
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
                  onClick={() => handleDirectMessageSelect(dm.user.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    selectedUser === dm.user.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {dm.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
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

      {/* Área Principal de Chat */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
        {/* Header do Chat */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedUser ? (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {companyUsers.find(u => u.id === selectedUser)?.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
              ) : (
                <Hash className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  {getCurrentChannelName()}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedUser ? 'Conversa direta' : `${companyUsers.filter(u => u.status === 'online').length} membros online`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedUser ? (
                <>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </>
              ) : (
                <>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <UserPlus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setShowChannelSettings(!showChannelSettings)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channelMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Hash className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {selectedUser ? 'Conversa Direta' : `Canal #${getCurrentChannelName()}`}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedUser 
                    ? 'Inicie uma conversa direta enviando uma mensagem.'
                    : 'Seja o primeiro a enviar uma mensagem neste canal!'
                  }
                </p>
              </div>
            </div>
          ) : (
            channelMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3 group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {message.sender.id === 'system' ? (
                    <span className="text-xs">🤖</span>
                  ) : (
                    message.sender.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {message.sender.name}
                    </span>
                    {message.sender.role === 'admin' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                    {message.sender.role === 'system' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full">
                        Sistema
                      </span>
                    )}
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
                  {message.edited && (
                    <span className="text-xs text-slate-500 dark:text-slate-500 italic">
                      (editado)
                    </span>
                  )}
                </div>
                {message.sender.id !== 'system' && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                      <Reply className="w-3 h-3 text-slate-500" />
                    </button>
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                      <Star className="w-3 h-3 text-slate-500" />
                    </button>
                    {message.sender.id === user?.id && (
                      <>
                        <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                          <Edit className="w-3 h-3 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors">
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
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
                placeholder={selectedUser ? `Mensagem para ${companyUsers.find(u => u.id === selectedUser)?.name}` : `Mensagem para #${getCurrentChannelName()}`}
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
          
          {/* Typing indicator */}
          {companyUsers.length > 1 && (
            <div className="px-4 py-2">
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-500">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>{companyUsers.find(u => u.id !== user?.id)?.name || 'Alguém'} está digitando...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden w-full">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Canais</h2>
          <div className="grid grid-cols-2 gap-3">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleChannelSelect(channel.id)}
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
              <button
                key={dm.user.id}
                onClick={() => handleDirectMessageSelect(dm.user.id)}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {dm.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <span className="text-sm text-slate-900 dark:text-white">{dm.user.name}</span>
                {dm.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[16px] text-center">
                    {dm.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages for Mobile */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {channelMessages.length === 0 ? (
              <div className="text-center py-8">
                <Hash className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedUser ? 'Inicie uma conversa!' : 'Seja o primeiro a enviar uma mensagem!'}
                </p>
              </div>
            ) : (
              channelMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {message.sender.id === 'system' ? '🤖' : message.sender.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-slate-900 dark:text-white text-sm">
                        {message.sender.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile Message Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Channel Settings Panel */}
      {showChannelSettings && !selectedUser && (
        <div className="w-64 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Configurações do Canal</h3>
            <button 
              onClick={() => setShowChannelSettings(false)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Pin className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Fixar Canal</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Adicionar Membros</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Archive className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Arquivar Canal</span>
            </button>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Membros do Canal</h4>
            <div className="space-y-2">
              {companyUsers.slice(0, 4).map((member) => (
                <div key={member.id} className="flex items-center space-x-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                    {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{member.name}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'online' ? 'bg-emerald-400' :
                    member.status === 'away' ? 'bg-amber-400' : 'bg-slate-400'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;