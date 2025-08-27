import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, Edit3, Save, Camera, Shield, User as UserIcon, Upload, FileImage, Check, AlertCircle, Award, Target, Users, TrendingUp, Star, BookOpen } from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (user: Partial<User>) => void;
  canEdit?: boolean;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave,
  canEdit = false 
}) => {
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'member',
    phone: '+55 (11) 99999-9999',
    location: 'São Paulo, SP',
    department: 'Desenvolvimento',
    joinDate: '2023-06-15',
    bio: user?.bio || 'Desenvolvedor full-stack com 5 anos de experiência em React, Node.js e Python. Apaixonado por criar soluções inovadoras e trabalhar em equipe.',
    position: user?.position || 'Desenvolvedor',
    skills: user?.skills || ['React', 'TypeScript', 'Node.js']
  });

  if (!isOpen || !user) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Arquivo muito grande. Máximo 5MB permitido.');
      return;
    }

    // Accept all image types
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, upload to Supabase Storage
      console.log('Uploading user photo:', selectedFile.name);
      
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      
    } catch (error) {
      setUploadError('Erro ao fazer upload. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave({
      ...user,
      name: formData.name,
      email: formData.email,
      role: formData.role as any,
      position: formData.position,
      bio: formData.bio,
      skills: formData.skills
    });
    setIsEditing(false);
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
      case 'super_admin': return 'Super Admin';
      case 'manager': return 'Gerente';
      case 'member': return 'Membro';
      default: return 'Membro';
    }
  };

  const getHierarchyLevel = (level: number) => {
    switch (level) {
      case 0: return 'C-Level';
      case 1: return 'Gerência';
      case 2: return 'Coordenação';
      case 3: return 'Operacional';
      default: return 'Não definido';
    }
  };

  // Check if current user can edit this profile
  const canEditProfile = canEdit && (
    currentUser?.id === user.id || 
    currentUser?.role === 'admin' || 
    currentUser?.role === 'super_admin' ||
    (currentUser?.hierarchy?.directReports?.includes(user.id))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Perfil do Usuário
          </h2>
          <div className="flex items-center space-x-2">
            {canEditProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Header com foto e info básica */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                ) : (
                  user.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(user.status)} rounded-full border-4 border-white dark:border-slate-900`}></div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                <input
                  type="file"
                  id="user-photo-upload"
                  accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.avif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="user-photo-upload"
                  className="cursor-pointer flex items-center justify-center w-full h-full hover:bg-black/70 transition-colors rounded-full"
                >
                  <Camera className="w-6 h-6" />
                </label>
              </div>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="CEO, Desenvolvedor, Designer..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Função
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')}
                    >
                      <option value="member">Membro</option>
                      <option value="manager">Gerente</option>
                      {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && (
                        <option value="admin">Administrador</option>
                      )}
                      {currentUser?.role === 'super_admin' && (
                        <option value="super_admin">Super Admin</option>
                      )}
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {user.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">{user.email}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${getStatusColor(user.status)} rounded-full`}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {getStatusText(user.status)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {getRoleText(user.role)}
                      </span>
                    </div>
                    {user.hierarchy && (
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {getHierarchyLevel(user.hierarchy.level)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Photo Upload Controls */}
            {selectedFile && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileImage className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Nova Foto</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 truncate">
                  {selectedFile.name}
                </p>
                
                {uploadError && (
                  <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400 mb-3">
                    <AlertCircle className="w-3 h-3" />
                    <span>{uploadError}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm transition-colors"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploading ? 'Enviando...' : 'Salvar Foto'}</span>
                  </button>
                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Informações detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Informações de Contato
              </h4>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Mail className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Email</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Phone className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Telefone</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{formData.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Localização</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{formData.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Informações Profissionais
              </h4>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <UserIcon className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Departamento</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.department || 'Não definido'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Award className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Cargo</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.position || 'Não definido'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Data de Entrada</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {user.hierarchy && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Hierarquia</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Nível</span>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">
                        {getHierarchyLevel(user.hierarchy.level)}
                      </span>
                    </div>
                    {user.hierarchy.reportsTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Reporta para</span>
                        <span className="text-xs font-medium text-slate-900 dark:text-white">
                          {mockUsers.find(u => u.id === user.hierarchy?.reportsTo)?.name || 'N/A'}
                        </span>
                      </div>
                    )}
                    {user.hierarchy.directReports && user.hierarchy.directReports.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Subordinados</span>
                        <span className="text-xs font-medium text-slate-900 dark:text-white">
                          {user.hierarchy.directReports.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span>Habilidades</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Sobre
            </h4>
            {isEditing ? (
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Conte um pouco sobre você..."
              />
            ) : (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {formData.bio}
              </p>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">23</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tarefas Concluídas</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">4</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Projetos Ativos</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">98%</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Taxa de Entrega</p>
            </div>
          </div>
        </div>
        
        {/* Botões de ação */}
        {isEditing && canEditProfile && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;