import React, { useState } from 'react';
import { 
  User, Building, Shield, Bell, Palette, Globe, Clock, Save, 
  Camera, Mail, Phone, MapPin, Key, Database, Zap, Download,
  Upload, Eye, EyeOff, AlertCircle, Check, Settings as SettingsIcon,
  Moon, Sun, Monitor, Smartphone, Lock, Unlock, CreditCard,
  FileText, HelpCircle, LogOut, Trash2, RefreshCw, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SettingsView: React.FC = () => {
  const { user, company, updateUser, updateCompany, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    position: user?.position || '',
    department: user?.department || '',
    location: user?.location || '',
    bio: 'Desenvolvedor full-stack com experiência em React, Node.js e TypeScript. Apaixonado por criar soluções inovadoras.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [companyData, setCompanyData] = useState({
    name: company?.name || '',
    email: company?.email || '',
    industry: company?.industry || '',
    size: company?.size || '',
    address: company?.address || '',
    phone: company?.phone || '',
    website: company?.website || '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    slack: false,
    desktop: true,
    mobile: true,
    taskUpdates: true,
    projectUpdates: true,
    teamMessages: true,
    systemAlerts: true,
    weeklyReports: false,
    monthlyReports: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    workingHours: {
      start: '09:00',
      end: '18:00',
      workingDays: [1, 2, 3, 4, 5],
    },
    autoSave: true,
    darkMode: theme === 'dark',
  });

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
      console.log('Uploading profile photo:', selectedFile.name);
      
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (error) {
      setUploadError('Erro ao fazer upload. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        position: profileData.position,
        department: profileData.department,
        location: profileData.location,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSaveCompany = async () => {
    try {
      await updateCompany(companyData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleSaveNotifications = () => {
    // Save notification settings
    localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveSystem = () => {
    // Save system settings
    localStorage.setItem('system_settings', JSON.stringify(systemSettings));
    if (systemSettings.darkMode !== (theme === 'dark')) {
      toggleTheme();
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'company', name: 'Empresa', icon: Building },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'system', name: 'Sistema', icon: SettingsIcon },
    { id: 'billing', name: 'Plano & Cobrança', icon: CreditCard },
  ];

  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español' },
  ];

  const timezones = [
    { value: 'America/Sao_Paulo', name: 'São Paulo (UTC-3)' },
    { value: 'America/New_York', name: 'New York (UTC-5)' },
    { value: 'Europe/London', name: 'London (UTC+0)' },
  ];

  const currencies = [
    { code: 'BRL', name: 'Real Brasileiro (R$)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Configurações
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Configurações salvas!</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar de Tabs */}
        <div className="lg:w-64">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Informações do Perfil
              </h2>

              {/* Photo Upload Section */}
              <div className="flex items-start space-x-6 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer">
                    <input
                      type="file"
                      id="profile-photo-upload"
                      accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.avif,.ico,.heic,.heif"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-photo-upload"
                      className="cursor-pointer flex items-center justify-center w-full h-full hover:bg-black/70 transition-colors rounded-full"
                    >
                      <Camera className="w-6 h-6" />
                    </label>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Foto do Perfil
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Clique na foto para alterar. Aceita todos os formatos de imagem (JPG, PNG, GIF, WebP, SVG, etc.)
                  </p>
                  
                  {/* Photo Upload Controls */}
                  {selectedFile && (
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Camera className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">Nova Foto Selecionada</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 truncate">
                        📁 {selectedFile.name}
                      </p>
                      
                      {uploadError && (
                        <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400 mb-3 bg-red-50 dark:bg-red-900/20 p-2 rounded">
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
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setUploadError(null);
                          }}
                          disabled={uploading}
                          className="px-3 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+55 (11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="CEO, Desenvolvedor, Designer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Departamento
                  </label>
                  <select
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar departamento</option>
                    <option value="Administração">Administração</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Operações">Operações</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="São Paulo, SP"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Biografia
                </label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Perfil</span>
                </button>
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Informações da Empresa
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email da Empresa
                  </label>
                  <input
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Setor
                  </label>
                  <select
                    value={companyData.industry}
                    onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar setor</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Varejo">Varejo</option>
                    <option value="Serviços Financeiros">Serviços Financeiros</option>
                    <option value="Consultoria">Consultoria</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tamanho da Empresa
                  </label>
                  <select
                    value={companyData.size}
                    onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar tamanho</option>
                    <option value="1 pessoa">1 pessoa (Freelancer)</option>
                    <option value="2-10">2-10 funcionários</option>
                    <option value="11-50">11-50 funcionários</option>
                    <option value="51-200">51-200 funcionários</option>
                    <option value="201-1000">201-1000 funcionários</option>
                    <option value="1000+">1000+ funcionários</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+55 (11) 3333-3333"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://suaempresa.com"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rua, Cidade, Estado, CEP"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveCompany}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Empresa</span>
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  Segurança da Conta
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                      Alterar Senha
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Senha Atual
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={profileData.currentPassword}
                            onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite sua senha atual"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Nova Senha
                          </label>
                          <input
                            type="password"
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nova senha"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Confirmar Nova Senha
                          </label>
                          <input
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirmar senha"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                      Autenticação de Dois Fatores
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-emerald-500" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">2FA Ativado</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Sua conta está protegida</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Desativar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Preferências de Notificação
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Canais de Notificação
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email', icon: Mail, description: 'Receber notificações por email' },
                      { key: 'push', label: 'Push', icon: Bell, description: 'Notificações push no navegador' },
                      { key: 'desktop', label: 'Desktop', icon: Monitor, description: 'Notificações na área de trabalho' },
                      { key: 'mobile', label: 'Mobile', icon: Smartphone, description: 'Notificações no celular' },
                    ].map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <div key={channel.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-slate-500" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{channel.label}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{channel.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[channel.key as keyof typeof notificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [channel.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Tipos de Notificação
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'taskUpdates', label: 'Atualizações de Tarefas', description: 'Quando tarefas são criadas, atualizadas ou concluídas' },
                      { key: 'projectUpdates', label: 'Atualizações de Projetos', description: 'Mudanças no status ou progresso dos projetos' },
                      { key: 'teamMessages', label: 'Mensagens da Equipe', description: 'Novas mensagens nos canais da equipe' },
                      { key: 'systemAlerts', label: 'Alertas do Sistema', description: 'Notificações importantes do sistema' },
                      { key: 'weeklyReports', label: 'Relatórios Semanais', description: 'Resumo semanal de atividades' },
                      { key: 'monthlyReports', label: 'Relatórios Mensais', description: 'Relatório mensal de performance' },
                    ].map((type) => (
                      <div key={type.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{type.label}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{type.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[type.key as keyof typeof notificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [type.key]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveNotifications}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Notificações</span>
                </button>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Configurações do Sistema
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Idioma
                    </label>
                    <select
                      value={systemSettings.language}
                      onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Fuso Horário
                    </label>
                    <select
                      value={systemSettings.timezone}
                      onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>{tz.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Moeda
                    </label>
                    <select
                      value={systemSettings.currency}
                      onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {currencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>{curr.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Formato de Data
                    </label>
                    <select
                      value={systemSettings.dateFormat}
                      onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Tema e Aparência
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => {
                        if (theme !== 'light') toggleTheme();
                        setSystemSettings({ ...systemSettings, darkMode: false });
                      }}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Sun className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Claro</p>
                    </button>

                    <button
                      onClick={() => {
                        if (theme !== 'dark') toggleTheme();
                        setSystemSettings({ ...systemSettings, darkMode: true });
                      }}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Moon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Escuro</p>
                    </button>

                    <button className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 transition-colors">
                      <Monitor className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Sistema</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveSystem}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Sistema</span>
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  Plano Atual
                </h2>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        Plano {company?.plan === 'free' ? 'Gratuito' : company?.plan === 'business' ? 'Business' : 'Enterprise'}
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300">
                        {company?.plan === 'free' ? 'Recursos básicos incluídos' : 'Todos os recursos avançados'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {company?.plan === 'free' ? 'R$ 0' : company?.plan === 'business' ? 'R$ 49' : 'R$ 149'}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">por mês</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {[
                    { name: 'Gratuito', price: 'R$ 0', features: ['5 projetos', '10 usuários', 'Suporte básico'], current: company?.plan === 'free' },
                    { name: 'Business', price: 'R$ 49', features: ['Projetos ilimitados', '50 usuários', 'Suporte prioritário', 'Analytics avançado'], current: company?.plan === 'business' },
                    { name: 'Enterprise', price: 'R$ 149', features: ['Tudo do Business', 'Usuários ilimitados', 'Suporte 24/7', 'IA Preditiva'], current: company?.plan === 'enterprise' },
                  ].map((plan) => (
                    <div key={plan.name} className={`p-6 rounded-lg border-2 ${
                      plan.current 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-slate-200 dark:border-slate-600'
                    }`}>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{plan.name}</h4>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{plan.price}</p>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {!plan.current && (
                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          Fazer Upgrade
                        </button>
                      )}
                      {plan.current && (
                        <div className="w-full py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-center text-sm font-medium">
                          Plano Atual
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-red-200 dark:border-red-800">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Zona de Perigo
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-100">Sair da Conta</h3>
              <p className="text-sm text-red-700 dark:text-red-300">Fazer logout e voltar à tela de login</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-100">Excluir Conta</h3>
              <p className="text-sm text-red-700 dark:text-red-300">Remover permanentemente sua conta e todos os dados</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;