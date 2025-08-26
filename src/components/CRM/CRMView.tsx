import React, { useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, Calendar, DollarSign, TrendingUp, Users, Target, Award, Clock, MoreVertical, Edit, Trash2, Eye, Star, Building, MapPin, User } from 'lucide-react';

const CRMView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');

  const leads = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      contact: 'João Silva',
      email: 'joao@techcorp.com',
      phone: '+55 (11) 99999-1111',
      value: 150000,
      stage: 'proposal',
      probability: 75,
      source: 'Website',
      lastContact: '2024-01-15',
      nextAction: 'Apresentação técnica',
      tags: ['Enterprise', 'SaaS'],
      assignedTo: 'Carlos Santos'
    },
    {
      id: '2',
      name: 'Inovação Digital Ltda',
      contact: 'Maria Oliveira',
      email: 'maria@inovacao.com',
      phone: '+55 (11) 98888-2222',
      value: 85000,
      stage: 'negotiation',
      probability: 60,
      source: 'Indicação',
      lastContact: '2024-01-14',
      nextAction: 'Negociar contrato',
      tags: ['SMB', 'Marketing'],
      assignedTo: 'Ana Silva'
    },
    {
      id: '3',
      name: 'StartupX',
      contact: 'Pedro Costa',
      email: 'pedro@startupx.com',
      phone: '+55 (11) 97777-3333',
      value: 45000,
      stage: 'qualified',
      probability: 40,
      source: 'LinkedIn',
      lastContact: '2024-01-13',
      nextAction: 'Demo do produto',
      tags: ['Startup', 'Tech'],
      assignedTo: 'Carlos Santos'
    }
  ];

  const customers = [
    {
      id: '1',
      name: 'Empresa Alpha',
      contact: 'Roberto Lima',
      email: 'roberto@alpha.com',
      phone: '+55 (11) 96666-4444',
      value: 250000,
      status: 'active',
      contractStart: '2023-06-01',
      contractEnd: '2024-06-01',
      satisfaction: 95,
      lastPurchase: '2024-01-10',
      totalRevenue: 750000,
      tags: ['Premium', 'Long-term']
    },
    {
      id: '2',
      name: 'Beta Industries',
      contact: 'Fernanda Santos',
      email: 'fernanda@beta.com',
      phone: '+55 (11) 95555-5555',
      value: 180000,
      status: 'active',
      contractStart: '2023-09-15',
      contractEnd: '2024-09-15',
      satisfaction: 88,
      lastPurchase: '2024-01-08',
      totalRevenue: 360000,
      tags: ['Growth', 'Tech']
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      case 'qualified': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'proposal': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'negotiation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'closed-won': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'closed-lost': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'lead': return 'Lead';
      case 'qualified': return 'Qualificado';
      case 'proposal': return 'Proposta';
      case 'negotiation': return 'Negociação';
      case 'closed-won': return 'Fechado';
      case 'closed-lost': return 'Perdido';
      default: return 'Lead';
    }
  };

  const totalLeadsValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const avgDealSize = totalLeadsValue / leads.length;
  const totalCustomerValue = customers.reduce((sum, customer) => sum + customer.totalRevenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            CRM & Vendas
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie leads, clientes e oportunidades de vendas
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Novo Lead</span>
        </button>
      </div>

      {/* CRM Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {leads.length}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Leads Ativos</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">+12% este mês</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              R$ {(totalLeadsValue / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pipeline Total</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">+23% este mês</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {customers.length}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Clientes Ativos</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">+8% este mês</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              R$ {(avgDealSize / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ticket Médio</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">+15% este mês</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'leads'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Leads & Oportunidades
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'customers'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Clientes
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'leads' ? 'leads' : 'clientes'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filtros</span>
          </button>
        </div>
      </div>

      {/* Leads Table */}
      {activeTab === 'leads' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Empresa</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Contato</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Valor</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Estágio</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Probabilidade</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Responsável</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">{lead.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {lead.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{lead.contact}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        R$ {(lead.value / 1000).toFixed(0)}k
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStageColor(lead.stage)}`}>
                        {getStageText(lead.stage)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${lead.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{lead.probability}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{lead.assignedTo}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                          <Phone className="w-4 h-4 text-slate-500" />
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

      {/* Customers Table */}
      {activeTab === 'customers' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Cliente</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Contato</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Receita Total</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Satisfação</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Contrato</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">{customer.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {customer.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{customer.contact}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        R$ {(customer.totalRevenue / 1000).toFixed(0)}k
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Ativo
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{customer.satisfaction}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date(customer.contractStart).toLocaleDateString('pt-BR')} - {new Date(customer.contractEnd).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                          <Phone className="w-4 h-4 text-slate-500" />
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
    </div>
  );
};

export default CRMView;