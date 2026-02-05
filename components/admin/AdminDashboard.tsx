import React, { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    Users,
    Truck,
    Store,
    BarChart3,
    Settings,
    Bell,
    Search,
    LogOut,
    ChevronRight,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download
} from 'lucide-react';
import { BRAND_COLORS, COMPANY_INFO } from '../../constants';

// --- Types ---
type AdminView = 'overview' | 'stock' | 'sales' | 'distribution' | 'partners' | 'crm';

// --- Mock Data ---
const KPIS = [
    { label: 'Revenu Journalier', value: '2,450,000 FC', trend: '+12.5%', isPositive: true },
    { label: 'Commandes en cours', value: '45', trend: '-5%', isPositive: false },
    { label: 'Stock Usine (Global)', value: '85%', trend: 'Stable', isPositive: true },
    { label: 'Dépôts Actifs', value: '12 / 15', trend: '+2', isPositive: true },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#0066CC] text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
        {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
);

const KPICard = ({ kpi }: { kpi: typeof KPIS[0] }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{kpi.label}</p>
        <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {kpi.isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {kpi.trend}
            </div>
        </div>
    </div>
);

// --- Vues Spécifiques (Modules) ---

const OverviewModule = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KPIS.map((kpi, i) => <KPICard key={i} kpi={kpi} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alertes Stock */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Package size={20} className="text-orange-500" />
                        Alertes Stock & Production
                    </h3>
                    <button className="text-xs font-bold text-[#0066CC]">Voir tout</button>
                </div>
                <div className="space-y-4">
                    {[
                        { item: 'Bouteilles 10L', status: 'Critique', stock: '150 unités', color: 'text-red-600 bg-red-50' },
                        { item: 'Préformes 1L', status: 'Faible', stock: '5000 unités', color: 'text-orange-600 bg-orange-50' },
                        { item: 'Étiquettes Std', status: 'Normal', stock: '25000 unités', color: 'text-emerald-600 bg-emerald-50' },
                    ].map((alert, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                            <div>
                                <p className="font-bold text-slate-900 text-sm">{alert.item}</p>
                                <p className="text-xs text-slate-500">Stock actuel: {alert.stock}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.color}`}>{alert.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activité Récente */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Truck size={20} className="text-[#0066CC]" />
                        Derniers Mouvements
                    </h3>
                    <button className="text-xs font-bold text-[#0066CC]">Détails</button>
                </div>
                <div className="space-y-4">
                    {[
                        { action: 'Expédition vers Relais Ma Campagne', time: 'Il y a 10 min', amount: '200x 10L', user: 'Chauffeur Jean' },
                        { action: 'Vente Directe Usine', time: 'Il y a 25 min', amount: '50x 1L', user: 'Vendeur Paul' },
                        { action: 'Retour Bouteilles Vides', time: 'Il y a 1h', amount: '150x 10L', user: 'Dépôt Central' },
                    ].map((move, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 border-b border-slate-50 last:border-0">
                            <div className="w-2 h-2 mt-2 rounded-full bg-[#0066CC]"></div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">{move.action}</p>
                                <p className="text-xs text-slate-500">{move.amount} • par {move.user}</p>
                            </div>
                            <span className="ml-auto text-xs text-slate-400 font-medium">{move.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const StockModule = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-slate-900">Inventaire Global</h3>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200"><Filter size={16} /> Filtres</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-lg text-sm font-bold hover:bg-blue-700"><Plus size={16} /> Entrée Stock</button>
                </div>
            </div>

            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4 rounded-l-xl">Article</th>
                        <th className="px-6 py-4">Catégorie</th>
                        <th className="px-6 py-4">Stock Usine</th>
                        <th className="px-6 py-4">En Transit</th>
                        <th className="px-6 py-4">Valeur Est.</th>
                        <th className="px-6 py-4 rounded-r-xl">Statut</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { name: 'Bouteille 10L (Eau)', cat: 'Produit Fini', stock: 1250, transit: 200, val: '10.6M FC', status: 'Bon' },
                        { name: 'Bouteille 5L (Eau)', cat: 'Produit Fini', stock: 3400, transit: 150, val: '15.3M FC', status: 'Bon' },
                        { name: 'Pack 1L x12', cat: 'Produit Fini', stock: 850, transit: 50, val: '8.5M FC', status: 'Moyen' },
                        { name: 'Préforme 10L', cat: 'Matière Première', stock: 150, transit: 5000, val: '-', status: 'Critique' },
                        { name: 'Bouchon Std', cat: 'Matière Première', stock: 50000, transit: 0, val: '-', status: 'Bon' },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                            <td className="px-6 py-4 text-slate-500">{row.cat}</td>
                            <td className="px-6 py-4 font-mono font-medium">{row.stock}</td>
                            <td className="px-6 py-4 text-slate-400 font-mono">{row.transit}</td>
                            <td className="px-6 py-4 text-slate-900 font-bold">{row.val}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'Critique' ? 'bg-red-100 text-red-600' :
                                        row.status === 'Moyen' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Main Layout ---

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [currentView, setCurrentView] = useState<AdminView>('overview');

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">

            {/* Sidebar Admin */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 bg-[#0066CC] rounded-lg flex items-center justify-center text-white font-black text-xs">MS</div>
                        <h1 className="font-black text-lg tracking-tight">Maji Safi <span className="text-[#0066CC]">Admin</span></h1>
                    </div>
                    <p className="text-xs text-slate-400 pl-11">Gestion & Opérations</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Principal</p>
                    <SidebarItem icon={LayoutDashboard} label="Vue d'ensemble" active={currentView === 'overview'} onClick={() => setCurrentView('overview')} />
                    <SidebarItem icon={BarChart3} label="Ventes & Finance" active={currentView === 'sales'} onClick={() => setCurrentView('sales')} />

                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Opérations</p>
                    <SidebarItem icon={Package} label="Stock & Inventaire" active={currentView === 'stock'} onClick={() => setCurrentView('stock')} />
                    <SidebarItem icon={Truck} label="Distribution" active={currentView === 'distribution'} onClick={() => setCurrentView('distribution')} />
                    <SidebarItem icon={Store} label="Dépôts Relais" active={currentView === 'partners'} onClick={() => setCurrentView('partners')} />

                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Relation</p>
                    <SidebarItem icon={Users} label="CRM Clients" active={currentView === 'crm'} onClick={() => setCurrentView('crm')} />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm">
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 flex flex-col min-w-0">
                {/* Header Admin */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 capitalize">
                            {currentView === 'overview' ? "Vue d'ensemble" :
                                currentView === 'stock' ? "Gestion des Stocks" :
                                    currentView === 'sales' ? "Ventes & Finances" : currentView}
                        </h2>
                        <p className="text-slate-500 text-xs">Mise à jour: Aujourd'hui à 16:30</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-600">Système Opérationnel</span>
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-[#0066CC] transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-900">Admin Principal</p>
                                <p className="text-xs text-slate-400">Direction Générale</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">AD</div>
                        </div>
                    </div>
                </header>

                {/* Dynamic View Content */}
                <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
                    {currentView === 'overview' && <OverviewModule />}
                    {currentView === 'stock' && <StockModule />}
                    {currentView === 'distribution' && (
                        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                            <Truck size={48} className="mb-4 text-slate-300" />
                            <p>Module Distribution en cours de chargement...</p>
                        </div>
                    )}
                    {/* Les autres modules seront ajoutés ici */}
                    {!['overview', 'stock', 'distribution'].includes(currentView) && (
                        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                            <Settings size={48} className="mb-4 text-slate-300" />
                            <p>Module {currentView} en développement</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
