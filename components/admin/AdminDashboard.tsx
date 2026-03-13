import React, { useState, useEffect } from 'react';
import DepotRelaisManagement from './DepotRelaisManagement';
import StockManagement from './StockManagement';
import SalesManagement from './SalesManagement';
import ClientManagement from './ClientManagement';
import ProductsManagement from './ProductsManagement';
import SecurityAudit from './SecurityAudit';
import { 
  DashboardIcon, 
  DepotIcon, 
  StockIcon, 
  SalesIcon, 
  ClientsIcon, 
  SettingsIcon, 
  LogoutIcon, 
  MenuIcon, 
  CloseIcon,
  WarehouseStatsIcon,
  StockStatsIcon,
  SalesStatsIcon,
  ClientsStatsIcon
} from '../icons/AdminIcons';
import { DepotRelais, StockItem, Sale, Client } from '../../types';
import { useDepots, useStock, useSales, useClients, useProducts } from '../../hooks/useSupabaseData';

type AdminTab = 'dashboard' | 'depot' | 'stock' | 'ventes' | 'clients' | 'produits' | 'settings';

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Récupérer les données depuis Supabase
  const { depots, loading: depotsLoading, addDepot, updateDepot, deleteDepot } = useDepots();
  const { stock: stocks, loading: stocksLoading, addStockItem, updateStockItem, deleteStockItem } = useStock();
  const { sales, loading: salesLoading, addSale, updateSale, deleteSale } = useSales();
  const { clients, loading: clientsLoading, addClient, updateClient, deleteClient } = useClients();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();

  const isLoading = depotsLoading || stocksLoading || salesLoading || clientsLoading || productsLoading;

  // Calculate stats
  const totalStockValue = stocks.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalClients = clients.length;

  const handleLogout = () => {
    if (onLogout) onLogout();
    else window.location.href = '/?admin=false';
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Chargement...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'depot':
        return <DepotRelaisManagement />;
      case 'stock':
        return <StockManagement stocks={stocks} setStocks={(s) => { stocks.length = 0; stocks.push(...s); }} depots={depots} />;
      case 'ventes':
        return <SalesManagement stocks={stocks} setStocks={(s) => { stocks.length = 0; stocks.push(...s); }} />;
      case 'clients':
        return <ClientManagement clients={clients} setClients={(c) => { clients.length = 0; clients.push(...c); }} />;
      case 'produits':
        return <ProductsManagement products={products} setProducts={(p) => { products.length = 0; products.push(...p); }} />;
      case 'settings':
        return <SecurityAudit />;
      default:
        return (
          <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900">Tableau de bord Admin</h1>

            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="text-blue-600">
                    <WarehouseStatsIcon size={24} />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-blue-600 bg-white px-2 md:px-3 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-blue-600 text-xs md:text-sm font-semibold mb-1">Total Dépôts</p>
                <p className="text-2xl md:text-3xl font-black text-blue-900">{depots.length}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="text-emerald-600">
                    <StockStatsIcon size={24} />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-emerald-600 bg-white px-2 md:px-3 py-1 rounded-full">+5%</span>
                </div>
                <p className="text-emerald-600 text-xs md:text-sm font-semibold mb-1">Valeur Stock</p>
                <p className="text-2xl md:text-3xl font-black text-emerald-900">{totalStockValue.toLocaleString()} FC</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="text-purple-600">
                    <SalesStatsIcon size={24} />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-purple-600 bg-white px-2 md:px-3 py-1 rounded-full">+8%</span>
                </div>
                <p className="text-purple-600 text-xs md:text-sm font-semibold mb-1">Total Ventes</p>
                <p className="text-2xl md:text-3xl font-black text-purple-900">{totalSales.toLocaleString()} FC</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="text-orange-600">
                    <ClientsStatsIcon size={24} />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-orange-600 bg-white px-2 md:px-3 py-1 rounded-full">+3%</span>
                </div>
                <p className="text-orange-600 text-xs md:text-sm font-semibold mb-1">Total Clients</p>
                <p className="text-2xl md:text-3xl font-black text-orange-900">{totalClients}</p>
              </div>
            </div>

            {/* Recent Sales - Responsive */}
            <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-black text-slate-900 mb-4">Dernières Ventes</h2>
              <div className="space-y-2 md:space-y-3 max-h-64 overflow-y-auto">
                {sales.slice(-5).reverse().map((sale) => (
                  <div key={sale.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-100 gap-2 sm:gap-4">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm md:text-base">{new Date(sale.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-xs md:text-sm text-slate-500">{sale.items.length} article(s)</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-black text-emerald-600 text-sm md:text-base">{sale.total.toLocaleString()} FC</p>
                      <p className="text-xs md:text-sm text-slate-500 capitalize">{sale.paymentMethod}</p>
                    </div>
                  </div>
                ))}
                {sales.length === 0 && <p className="text-center text-slate-500 py-6 text-sm md:text-base">Aucune vente enregistrée</p>}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-xl font-black text-slate-900">Admin Panel</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
        >
          {isSidebarOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Sidebar - Mobile Overlay & Desktop Fixed */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black/50 lg:hidden transition-opacity z-30 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`fixed lg:static left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 p-4 md:p-6 flex flex-col z-30 transform transition-transform lg:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <h1 className="hidden lg:block text-2xl font-black text-slate-900 mb-8">Admin Panel</h1>

        <nav className="space-y-2 md:space-y-3 flex-1">
          <TabButton
            label="Tableau de bord"
            icon={DashboardIcon}
            active={activeTab === 'dashboard'}
            onClick={() => {
              setActiveTab('dashboard');
              setIsSidebarOpen(false);
            }}
          />
          <TabButton
            label="Dépôt Relais"
            icon={DepotIcon}
            active={activeTab === 'depot'}
            onClick={() => {
              setActiveTab('depot');
              setIsSidebarOpen(false);
            }}
            badge={depots.length}
          />
          <TabButton
            label="Gestion Stock"
            icon={StockIcon}
            active={activeTab === 'stock'}
            onClick={() => {
              setActiveTab('stock');
              setIsSidebarOpen(false);
            }}
            badge={stocks.length}
          />
          <TabButton
            label="Ventes"
            icon={SalesIcon}
            active={activeTab === 'ventes'}
            onClick={() => {
              setActiveTab('ventes');
              setIsSidebarOpen(false);
            }}
            badge={sales.length}
          />
          <TabButton
            label="Clients"
            icon={ClientsIcon}
            active={activeTab === 'clients'}
            onClick={() => {
              setActiveTab('clients');
              setIsSidebarOpen(false);
            }}
            badge={clients.length}
          />
          <TabButton
            label="Produits"
            icon={StockIcon}
            active={activeTab === 'produits'}
            onClick={() => {
              setActiveTab('produits');
              setIsSidebarOpen(false);
            }}
            badge={products.length}
          />
        </nav>

        <div className="space-y-2 md:space-y-3 border-t border-slate-200 pt-4 md:pt-6">
          <button 
            onClick={() => {
              setActiveTab('settings');
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 md:py-3 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold transition-colors text-sm md:text-base"
          >
            <SettingsIcon size={20} />
            <span>Audit de Sécurité</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 md:py-3 rounded-lg hover:bg-red-50 text-red-600 font-semibold transition-colors text-sm md:text-base"
          >
            <LogoutIcon size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content - Responsive Padding */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;

interface TabButtonProps {
  label: string;
  icon: React.FC<any>;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon: Icon, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-700 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
    {badge !== undefined && (
      <span className={`ml-auto px-2 py-1 rounded-full text-xs font-black ${
        active ? 'bg-blue-700' : 'bg-slate-200 text-slate-700'
      }`}>
        {badge}
      </span>
    )}
  </button>
);
