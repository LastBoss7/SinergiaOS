import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Building, User, Phone, MapPin, Zap, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, loading, error } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [companyData, setCompanyData] = useState({
    companyName: '',
    industry: '',
    size: '',
    website: '',
    phone: '',
    address: '',
  });

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
    phone: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const industries = [
    'Tecnologia', 'Saúde', 'Educação', 'Varejo', 'Serviços Financeiros',
    'Manufatura', 'Consultoria', 'Marketing', 'Construção', 'Outros'
  ];

  const companySizes = [
    '1 pessoa (Freelancer)', '2-10 funcionários', '11-50 funcionários',
    '51-200 funcionários', '201-1000 funcionários', '1000+ funcionários'
  ];

  const handleNextStep = () => {
    if (step === 1) {
      // Validar dados da empresa
      if (!companyData.companyName || !companyData.industry || !companyData.size) {
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userData.password !== userData.confirmPassword) {
      return;
    }

    if (!acceptTerms) {
      return;
    }

    await register({
      company: companyData,
      user: userData,
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Informações da Empresa
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Vamos começar configurando sua empresa
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Nome da Empresa *
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            required
            value={companyData.companyName}
            onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome da sua empresa"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Setor *
          </label>
          <select
            required
            value={companyData.industry}
            onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
            className="w-full px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o setor</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tamanho da Empresa *
          </label>
          <select
            required
            value={companyData.size}
            onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
            className="w-full px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o tamanho</option>
            {companySizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Website
        </label>
        <input
          type="url"
          value={companyData.website}
          onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
          className="w-full px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://suaempresa.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              value={companyData.phone}
              onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Endereço
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={companyData.address}
              onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cidade, Estado"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextStep}
        disabled={!companyData.companyName || !companyData.industry || !companyData.size}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
      >
        <span>Continuar</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Seus Dados Pessoais
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Agora vamos criar sua conta de administrador
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Nome Completo *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            required
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Seu nome completo"
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
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Senha *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="w-full pl-11 pr-12 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Confirmar Senha *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={userData.confirmPassword}
              onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
              className="w-full pl-11 pr-12 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
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
            value={userData.position}
            onChange={(e) => setUserData({ ...userData, position: e.target.value })}
            className="w-full px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CEO, Diretor, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            className="w-full px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2 mt-1"
        />
        <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
          Eu aceito os{' '}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Termos de Uso
          </a>{' '}
          e a{' '}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Política de Privacidade
          </a>
        </label>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={loading || !acceptTerms || userData.password !== userData.confirmPassword}
          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Criar Conta</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Criar Conta no InsightOS
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-8 h-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
            <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Passo {step} de 2
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? renderStep1() : renderStep2()}
          </form>

          {/* Link para login */}
          <div className="mt-6 text-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Já tem uma conta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Fazer login
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;