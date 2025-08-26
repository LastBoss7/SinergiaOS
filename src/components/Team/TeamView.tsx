import React, { useState, useMemo } from 'react';
import { Plus, Mail, Phone, MapPin, Calendar, Search, Award, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import UserProfileModal from './UserProfileModal';
import InviteUserModal from './InviteUserModal';
import { User } from '../../types';

const TeamView: React.FC = () => {
  const { user: currentUser, company } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Load users from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      if (!company?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('company_id', company.id)
          .eq('is_active', true);

        if (error) throw error;

        const formattedUsers: User[] = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as any,
          status: user.status as any,
          department: user.department,
          position: user.position,
          phone: user.phone,
          location: user.location,
          joinDate: user.join_date,
          lastLogin: user.last_login,
          permissions: user.permissions || [],
          companyId: user.company_id,
          isActive: user.is_active,
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [company?.id]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          department: updatedUser.department,
          position: updatedUser.position,
          phone: updatedUser.phone,
          location: updatedUser.location,
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInviteUser = async (userData) => {
    // Refresh users list from Supabase
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true);

      if (error) throw error;

      const formattedUsers: User[] = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        status: user.status as any,
        department: user.department,
        position: user.position,
        phone: user.phone,
        location: user.location,
        joinDate: user.join_date,
        lastLogin: user.last_login,
        permissions: user.permissions || [],
        companyId: user.company_id,
        isActive: user.is_active,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-400';
      case 'away': return 'bg-amber-400';
      case 'offline': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Ausente';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'member': return 'Membro';
      default: return 'Membro';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'member': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Equipe
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie membros da equipe e permissões
          </p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Convidar Membro</span>
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{users.filter(u => u.status === 'online').length}</span>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Online Agora</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Ativos hoje</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{users.length}</span>
            </div>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Gerentes</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Liderança</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{users.filter(u => u.role === 'admin').length}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Administradores</p>
            <p className="text-xs text-purple-600 dark:text-purple-400">Acesso total</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">98%</span>
            </div>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Taxa de Atividade</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Últimos 30 dias</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar membros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Todas as funções</option>
              <option value="admin">Administradores</option>
              <option value="manager">Gerentes</option>
              <option value="member">Membros</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">Todos os status</option>
              <option value="online">Online</option>
              <option value="away">Ausente</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="w-4 h-4 flex flex-col space-y-1">
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
                <div className="h-0.5 bg-current rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Team Members */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="relative group">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
                   onClick={() => handleUserClick(user)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white dark:border-slate-800`}></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all">
                      <MoreVertical className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${getStatusColor(user.status)} rounded-full`}></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {getStatusText(user.status)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                      Ver Perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Member Card */}
          <div 
            onClick={() => setIsInviteModalOpen(true)}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-1">Convidar Membro</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adicione um novo membro à equipe</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Membro</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Função</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Último Acesso</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white dark:border-slate-800`}></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${getStatusColor(user.status)} rounded-full`}></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {getStatusText(user.status)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {user.status === 'online' ? 'Agora' : '2 horas atrás'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                          <Edit className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                          <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.id);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Atividade Recente da Equipe
        </h2>
        <div className="space-y-4">
          {[
            { user: users[0], action: 'completou a tarefa', target: 'Revisar proposta comercial', time: '2 horas atrás', type: 'task' },
            { user: users[1], action: 'criou um novo projeto', target: 'Sistema Analytics', time: '4 horas atrás', type: 'project' },
            { user: users[2], action: 'enviou mensagem no canal', target: '#geral', time: '6 horas atrás', type: 'message' },
            { user: users[3], action: 'atualizou a documentação', target: 'API Reference', time: '1 dia atrás', type: 'docs' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {activity.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(activity.user.status)} rounded-full border-2 border-white dark:border-slate-700`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">
                  <span className="font-medium">{activity.user.name}</span> {activity.action}{' '}
                  <span className="font-medium text-blue-600 dark:text-blue-400">{activity.target}</span>
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  activity.type === 'task' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                  activity.type === 'project' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  activity.type === 'message' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {activity.type === 'task' ? 'Tarefa' :
                   activity.type === 'project' ? 'Projeto' :
                   activity.type === 'message' ? 'Mensagem' : 'Documento'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
        canEdit={true}
      />

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
        </>
      )}
    </div>
  );
};

export default TeamView;