import React, { useState } from 'react';
import { Plus, Package, Truck, Users, AlertTriangle, TrendingUp, TrendingDown, BarChart3, Clock, CheckCircle, XCircle, Search, Filter, Download, Eye, Edit, Trash2, MapPin, Calendar, DollarSign, Target, Activity, Zap, Building, ShoppingCart, Warehouse, Factory } from 'lucide-react';

const OperationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const inventory = [
    {
      id: '1',
      name: 'Notebook Dell Inspiron 15',
      category: 'Equipamentos',
      sku: 'NB-DELL-001',
      quantity: 25,
      minStock: 5,
      maxStock: 50,
      unitCost: 2500,
      totalValue: 62500,
      supplier: 'Dell Brasil',
      location: 'Estoque SP - A1',
      lastMovement: '2024-01-15',
      status: 'available'
    },
    {
      id: '2',
      name: 'Monitor LG 24" Full HD',
      category: 'Equipamentos',
      sku: 'MON-LG-024',
      quantity: 3,
      minStock: 10,
      maxStock: 30,
      unitCost: 800,
      totalValue: 2400,
      supplier: 'LG Electronics',
      location: 'Estoque SP - B2',
      lastMovement: '2024-01-14',
      status: 'low_stock'
    },
    {
      id: '3',
      name: 'Cadeira Ergonômica Herman Miller',
      category: 'Mobiliário',
      sku: 'CAD-HM-001',
      quantity: 15,
      minStock: 5,
      maxStock: 25,
      unitCost: 3200,
      totalValue: 48000,
      supplier: 'Herman Miller Brasil',
      location: 'Estoque SP - C1',
      lastMovement: '2024-01-13',
      status: 'available'
    },
    {
      id: '4',
      name: 'Licença Microsoft Office 365',
      category: 'Software',
      sku: 'SW-MS-365',
      quantity: 0,
      minStock: 10,
      maxStock: 100,
      unitCost: 45,
      totalValue: 0,
      supplier: 'Microsoft Brasil',
      location: 'Digital',
      lastMovement: '2024-01-12',
      status: 'out_of_stock'
    }
  ];

  const suppliers = [
    {
      id: '1',
      name: 'Dell Brasil Ltda',
      contact: 'Carlos Vendas',
      email: 'carlos@dell.com.br',
      phone: '+55 (11) 3000-1000',
      category: 'Equipamentos',
      rating: 4.8,
      totalOrders: 45,
      totalValue: 450000,
      paymentTerms: '30 dias',
      deliveryTime: '5-7 dias',
      status: 'active'
    },
    {
      id: '2',
      name: 'LG Electronics',
      contact: 'Maria Comercial',
      email: 'maria@lg.com.br',
      phone: '+55 (11) 3000-2000',
      category: 'Equipamentos',
      rating: 4.5,
      totalOrders: 28,
      totalValue: 180000,
      paymentTerms: '45 dias',
      deliveryTime: '7-10 dias',
      status: 'active'
    },
    {
      id: '3',
      name: 'Herman Miller Brasil',
      contact: 'João Móveis',
      email: 'joao@hermanmiller.com.br',
      phone: '+55 (11) 3000-3000',
      category: 'Mobiliário',
      rating: 4.9,
      totalOrders: 12,
      totalValue: 320000,
      paymentTerms: '60 dias',
      deliveryTime: '15-20 dias',
      status: 'active'
    }
  ];

  const orders = [
    {
      id: 'ORD-001',
      supplier: 'Dell Brasil Ltda',
      items: [
        { name: 'Notebook Dell Inspiron 15', quantity: 10, unitPrice: 2500 }
      ],
      totalValue: 25000,
      status: 'delivered',
      orderDate: '2024-01-10',
      expectedDelivery: '2024-01-17',
      actualDelivery: '2024-01-15'
    },
    {
      id: 'ORD-002',
      supplier: 'Microsoft Brasil',
      items: [
        { name: 'Licença Office 365', quantity: 50, unitPrice: 45 }
      ],
      totalValue: 2250,
      status: 'pending',
      orderDate: '2024-01-14',
      expectedDelivery: '2024-01-21',
      actualDelivery: null
    },
    {
      id: 'ORD-003',
      supplier: 'Herman Miller Brasil',
      items: [
        { name: 'Cadeira Ergonômica', quantity: 5, unitPrice: 3200 }
      ],
      totalValue: 16000,
      status: 'in_transit',
      orderDate: '2024-01-12',
      expectedDelivery: '2024-01-25',
      actualDelivery: null
    }
  ];

  const facilities = [
    {
      id: '1',
      name: 'Escritório Principal - São Paulo',
      type: 'office',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      size: '500 m²',
      capacity: 50,
      currentOccupancy: 35,
      manager: 'Ana Silva',
      status: 'active',
      utilities: {
        electricity: 2500,
        water: 450,
        internet: 800,
        cleaning: 1200
      },
      amenities: ['Wi-Fi', 'Ar Condicionado', 'Cozinha', 'Sala de Reunião', 'Estacionamento']
    },
    {
      id: '2',
      name: 'Depósito Central - Guarulhos',
      type: 'warehouse',
      address: 'Rod. Presidente Dutra, Km 15 - Guarulhos, SP',
      size: '1200 m²',
      capacity: 1000,
      currentOccupancy: 750,
      manager: 'Pedro Almeida',
      status: 'active',
      utilities: {
        electricity: 1800,
        water: 200,
        security: 2000,
        maintenance: 800
      },
      amenities: ['Segurança 24h', 'Empilhadeiras', 'Sistema WMS', 'Câmeras', 'Controle de Acesso']
    }
  ];

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock).length;
  const outOfStockItems = inventory.filter(item => item.quantity === 0).length;
  const totalSuppliers = suppliers.length;
  const activeOrders = orders.filter(order => order.status !== 'delivered').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'low_stock': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'in_transit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'low_stock': return 'Estoque Baixo';
      case 'out_of_stock': return 'Sem Estoque';
      case 'delivered': return 'Entregue';
      case 'pending': return 'Pendente';
      case 'in_transit': return 'Em Trânsito';
      case 'active': return 'Ativo';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Operações
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gestão de estoque, fornecedores e operações empresariais
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nova Operação</span>
        </button>
      </div>

      {/* Operations Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {formatCurrency(totalInventoryValue)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Valor do Estoque</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">+12% este mês</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <TrendingDown className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {lowStockItems}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estoque Baixo</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Requer atenção</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {outOfStockItems}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Sem Estoque</p>
            <p className="text-xs text-red-600 dark:text-red-400">Ação urgente</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {activeOrders}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pedidos Ativos</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Em andamento</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {totalSuppliers}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Fornecedores</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Todos ativos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'inventory'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Estoque
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'suppliers'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Fornecedores
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'facilities'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Instalações
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Status do Estoque</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Itens Disponíveis</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Estoque normal</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-emerald-600">
                  {inventory.filter(item => item.status === 'available').length}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Estoque Baixo</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Requer reposição</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-amber-600">{lowStockItems}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Sem Estoque</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ação urgente</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">{outOfStockItems}</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Pedidos Recentes</h3>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white">{order.id}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{order.supplier}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(order.totalValue)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar itens..."
                  className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                />
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filtros</span>
              </button>
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Exportar</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Item</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">SKU</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Quantidade</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Valor Unit.</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Valor Total</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{item.category}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">{item.sku}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{item.quantity}</span>
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1">
                            <div
                              className={`h-1 rounded-full ${
                                item.quantity <= item.minStock ? 'bg-red-500' :
                                item.quantity <= item.minStock * 2 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-900 dark:text-white">
                          {formatCurrency(item.unitCost)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(item.totalValue)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
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
                            <Trash2 className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Fornecedor</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Contato</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Categoria</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Avaliação</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Total Pedidos</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Valor Total</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{supplier.name}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Entrega: {supplier.deliveryTime} • Pagamento: {supplier.paymentTerms}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-slate-900 dark:text-white">{supplier.contact}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{supplier.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{supplier.category}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(supplier.rating) ? 'text-amber-400' : 'text-slate-300'
                                }`}
                              >
                                ⭐
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {supplier.rating}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-900 dark:text-white">{supplier.totalOrders}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(supplier.totalValue)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                          {getStatusText(supplier.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Pedido</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Fornecedor</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Valor</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Data Pedido</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Entrega Prevista</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{order.id}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-900 dark:text-white">{order.supplier}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(order.totalValue)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(order.orderDate).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(order.expectedDelivery).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Facilities Tab */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {facility.type === 'office' ? (
                      <Building className="w-6 h-6 text-white" />
                    ) : (
                      <Warehouse className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{facility.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Gerente: {facility.manager}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                  {getStatusText(facility.status)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{facility.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Tamanho</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{facility.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Ocupação</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {facility.currentOccupancy}/{facility.capacity}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">Ocupação</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (facility.currentOccupancy / facility.capacity) > 0.9 ? 'bg-red-500' :
                        (facility.currentOccupancy / facility.capacity) > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(facility.currentOccupancy / facility.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {((facility.currentOccupancy / facility.capacity) * 100).toFixed(0)}% ocupado
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">Comodidades</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                    {facility.amenities.length > 3 && (
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        +{facility.amenities.length - 3} mais
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OperationsView;