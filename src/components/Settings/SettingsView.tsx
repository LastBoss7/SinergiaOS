import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Palette, Globe, Database, Zap, ChevronRight, Check, X, Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { mockUsers, mockModules } from '../../data/mockData';

const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'billing', name: 'Cobrança', icon: CreditCard },
    { id: 'modules', name: 'Módulos', icon: Zap },
    { id: 'appearance', name: 'Aparência', icon: Palette },
    { id: 'integrations', name: 'Integrações', icon: Globe },
    { id: 'data', name: 'Dados', icon: Database },
  ];

  const plans = [
    {
      name: 'Free',
      price: 'R$ 0',
      period: '/mês',
      features: ['Módulo Central', 'Até 5 usuários', 'Suporte por email'],
      current: true,
    },
    {
      name: 'Business',
      price: 'R$ 29',
      period: '/usuário/mês',
      features: ['Todos os módulos básicos', 'Usuários ilimitados', 'Suporte prioritário', 'API limitada'],
      current: false,
    },
    {
      name: 'Enterprise',
      price: 'Personalizado',
      period: '',
      features: ['Todos os módulos', 'Suporte dedicado', 'SLA garantido', 'API completa', 'Customizações'],
      current: false,
    },
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Perfil do Usuário</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              AS
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ana Silva</h3>
              <p className="text-slate-600 dark:text-slate-400">ana@company.com</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  Administrador
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Editar Foto
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value="Ana Silva"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value="ana@company.com"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Cargo
              </label>
              <input
                type="text"
                value="CEO & Fundadora"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Telefone
              </label>
              <input
                type="text"
                value="+55 (11) 99999-9999"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mr-3">
              Salvar Alterações
            </button>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModulesSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Módulos do Sistema</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Ative ou desative módulos conforme suas necessidades. Alguns módulos requerem planos pagos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockModules.map((module) => {
          const isActive = module.status === 'active';
          const isComingSoon = module.status === 'coming-soon';
          
          return (
            <div key={module.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    <span className="text-lg">
                      {module.icon === 'Home' && '🏠'}
                      {module.icon === 'Users' && '👥'}
                      {module.icon === 'DollarSign' && '💰'}
                      {module.icon === 'UserCheck' && '✅'}
                      {module.icon === 'Package' && '📦'}
                      {module.icon === 'BarChart3' && '📊'}
                      {module.icon === 'Brain' && '🧠'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{module.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{module.description}</p>
                    {module.features && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {module.features.slice(0, 2).map((feature) => (
                          <span key={feature} className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                        {module.features.length > 2 && (
                          <span className="text-xs text-slate-500">+{module.features.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {isActive && (
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-medium">Ativo</span>
                  </div>
                )}
                
                {isComingSoon && (
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    Em Breve
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    module.tier === 'free' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : module.tier === 'business'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {module.tier === 'free' ? 'Gratuito' : 
                     module.tier === 'business' ? 'Business' : 'Enterprise'}
                  </span>
                  {module.tier !== 'free' && !isActive && (
                    <Star className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                
                {!isComingSoon && (
                  <button 
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                    }`}
                  >
                    {isActive ? 'Desativar' : 'Ativar'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cobrança e Planos</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Gerencie sua assinatura e métodos de pagamento.
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Plano Atual</h3>
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Plano Free</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">Módulo Central • Até 5 usuários</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">R$ 0</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">/mês</p>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Planos Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative bg-white dark:bg-slate-800 rounded-xl p-6 border transition-colors ${
              plan.current 
                ? 'border-blue-500 ring-2 ring-blue-500/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}>
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Plano Atual
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{plan.name}</h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                plan.current
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`} disabled={plan.current}>
                {plan.current ? 'Plano Atual' : plan.name === 'Enterprise' ? 'Contatar Vendas' : 'Fazer Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aparência</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Personalize a aparência do sistema conforme sua preferência.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tema</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-4 rounded-lg border-2 transition-colors ${
              theme === 'light' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="bg-white rounded-lg p-3 mb-3 border border-slate-200">
              <div className="h-2 bg-slate-100 rounded mb-2"></div>
              <div className="h-2 bg-slate-200 rounded w-2/3"></div>
            </div>
            <div className="text-center">
              <span className="font-medium text-slate-900 dark:text-white">Tema Claro</span>
              {theme === 'light' && <Check className="w-4 h-4 text-blue-600 mx-auto mt-1" />}
            </div>
          </button>

          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-4 rounded-lg border-2 transition-colors ${
              theme === 'dark' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="bg-slate-800 rounded-lg p-3 mb-3 border border-slate-700">
              <div className="h-2 bg-slate-700 rounded mb-2"></div>
              <div className="h-2 bg-slate-600 rounded w-2/3"></div>
            </div>
            <div className="text-center">
              <span className="font-medium text-slate-900 dark:text-white">Tema Escuro</span>
              {theme === 'dark' && <Check className="w-4 h-4 text-blue-600 mx-auto mt-1" />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const sections_content = {
    profile: renderProfileSection,
    modules: renderModulesSection,
    billing: renderBillingSection,
    appearance: renderAppearanceSection,
    notifications: () => <div className="text-slate-600 dark:text-slate-400">Configurações de notificações em desenvolvimento...</div>,
    security: () => <div className="text-slate-600 dark:text-slate-400">Configurações de segurança em desenvolvimento...</div>,
    integrations: () => <div className="text-slate-600 dark:text-slate-400">Integrações em desenvolvimento...</div>,
    data: () => <div className="text-slate-600 dark:text-slate-400">Configurações de dados em desenvolvimento...</div>,
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Configurações</h1>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {sections_content[activeSection as keyof typeof sections_content]()}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;