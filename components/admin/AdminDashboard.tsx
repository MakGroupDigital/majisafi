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
    Download,
    CreditCard,
    Map,
    UserCheck,
    MoreHorizontal
} from 'lucide-react';

// --- Types ---
type AdminView = 'overview' | 'stock' | 'sales' | 'distribution' | 'partners' | 'crm';

// --- Components Helpers ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles: { [key: string]: string } = {
        'Livré': 'bg-emerald-100 text-emerald-700',
        'En cours': 'bg-blue-100 text-blue-700',
        'En attente': 'bg-orange-100 text-orange-700',
        'Annulé': 'bg-red-100 text-red-700',
        'Actif': 'bg-emerald-100 text-emerald-700',
        'Inactif': 'bg-slate-100 text-slate-500',
        'Premium': 'bg-purple-100 text-purple-700',
        'Standard': 'bg-slate-100 text-slate-600',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );
};

const Header = ({ title }: { title: string }) => (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <div className="flex gap-2">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-100 outline-none w-64" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200"><Filter size={16} /> Filtres</button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200"><Download size={16} /> Export</button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"><Plus size={16} /> Nouveau</button>
        </div>
    </div>
);

// --- MODULES ---

const OverviewModule = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: 'Revenu Journalier', value: '2,450,000 FC', trend: '+12.5%', isPositive: true },
                { label: 'Commandes en cours', value: '45', trend: '-5%', isPositive: false },
                { label: 'Stock Usine', value: '85%', trend: 'Stable', isPositive: true },
                { label: 'Dépôts Actifs', value: '12 / 15', trend: '+2', isPositive: true },
            ].map((kpi, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{kpi.label}</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
                        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {kpi.isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                            {kpi.trend}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2"><Package size={20} className="text-orange-500" /> Alertes Stock</h3>
                    <button className="text-xs font-bold text-[#0066CC]">Voir tout</button>
                </div>
                <div className="space-y-4">
                    {[{ item: 'Bouteilles 10L', status: 'Critique', stock: '150 unités', color: 'text-red-600 bg-red-50' }, { item: 'Préformes 1L', status: 'Faible', stock: '5000 unités', color: 'text-orange-600 bg-orange-50' }].map((alert, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                            <div><p className="font-bold text-slate-900 text-sm">{alert.item}</p><p className="text-xs text-slate-500">Stock: {alert.stock}</p></div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.color}`}>{alert.status}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2"><Truck size={20} className="text-[#0066CC]" /> Derniers Mouvements</h3>
                    <button className="text-xs font-bold text-[#0066CC]">Détails</button>
                </div>
                <div className="space-y-4">
                    {[{ action: 'Expédition vers Relais Ma Campagne', time: '10 min', amount: '200x 10L' }, { action: 'Vente Directe Usine', time: '25 min', amount: '50x 1L' }].map((move, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 border-b border-slate-50 last:border-0">
                            <div className="w-2 h-2 mt-2 rounded-full bg-[#0066CC]"></div>
                            <div><p className="font-bold text-slate-900 text-sm">{move.action}</p><p className="text-xs text-slate-500">{move.amount}</p></div>
                            <span className="ml-auto text-xs text-slate-400 font-medium">{move.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const StockModule = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <Header title="Inventaire Global" />
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    <tr><th className="px-6 py-4 rounded-l-xl">Article</th><th className="px-6 py-4">Catégorie</th><th className="px-6 py-4">Stock Usine</th><th className="px-6 py-4">En Transit</th><th className="px-6 py-4">Valeur Est.</th><th className="px-6 py-4 rounded-r-xl">Statut</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { name: 'Bouteille 10L (Eau)', cat: 'Produit Fini', stock: 1250, transit: 200, val: '10.6M FC', status: 'Bon' },
                        { name: 'Bouteille 5L (Eau)', cat: 'Produit Fini', stock: 3400, transit: 150, val: '15.3M FC', status: 'Bon' },
                        { name: 'Pack 1L x12', cat: 'Produit Fini', stock: 850, transit: 50, val: '8.5M FC', status: 'Moyen' },
                        { name: 'Préforme 10L', cat: 'Matière Première', stock: 150, transit: 5000, val: '-', status: 'Critique' },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                            <td className="px-6 py-4 text-slate-500">{row.cat}</td>
                            <td className="px-6 py-4 font-mono font-medium">{row.stock}</td>
                            <td className="px-6 py-4 text-slate-400 font-mono">{row.transit}</td>
                            <td className="px-6 py-4 text-slate-900 font-bold">{row.val}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'Critique' ? 'bg-red-100 text-red-600' : row.status === 'Moyen' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{row.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const SalesModule = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                <p className="text-slate-500 text-xs font-bold uppercase">Chiffre d'affaire (Mois)</p>
                <h3 className="text-3xl font-black text-slate-900">45.2M FC</h3>
                <p className="text-emerald-600 text-xs font-bold flex items-center"><ArrowUpRight size={14} className="mr-1" /> +15% vs mois dernier</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                <p className="text-slate-500 text-xs font-bold uppercase">Panier Moyen</p>
                <h3 className="text-3xl font-black text-slate-900">$12.50</h3>
                <p className="text-emerald-600 text-xs font-bold flex items-center"><ArrowUpRight size={14} className="mr-1" /> +2% vs mois dernier</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                <p className="text-slate-500 text-xs font-bold uppercase">Commandes Totales</p>
                <h3 className="text-3xl font-black text-slate-900">1,245</h3>
                <p className="text-slate-400 text-xs font-bold">Cette période</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <Header title="Dernières Transactions" />
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    <tr><th className="px-6 py-4 rounded-l-xl">ID Commande</th><th className="px-6 py-4">Client</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Montant</th><th className="px-6 py-4">Méthode</th><th className="px-6 py-4 rounded-r-xl">Statut</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { id: '#CMD-8821', client: 'Relais Ma Campagne', date: 'Aujourd\'hui, 14:30', amount: '250,000 FC', method: 'Virement', status: 'Payé' },
                        { id: '#CMD-8820', client: 'Jean Dupont (Particulier)', date: 'Aujourd\'hui, 13:15', amount: '45,000 FC', method: 'Mobile Money', status: 'Payé' },
                        { id: '#CMD-8819', client: 'Hôtel Bunia Palace', date: 'Hier, 18:45', amount: '1,200,000 FC', method: 'Chèque', status: 'En attente' },
                        { id: '#CMD-8818', client: 'Dépôt Cité Verte', date: 'Hier, 10:00', amount: '350,000 FC', method: 'Cash', status: 'Payé' },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-[#0066CC] font-bold">{row.id}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{row.client}</td>
                            <td className="px-6 py-4 text-slate-500">{row.date}</td>
                            <td className="px-6 py-4 font-black text-slate-900">{row.amount}</td>
                            <td className="px-6 py-4 text-slate-600">{row.method}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'Payé' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{row.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const DistributionModule = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carte simulée */}
            <div className="lg:col-span-2 bg-slate-200 rounded-2xl h-80 relative overflow-hidden flex items-center justify-center border border-slate-300">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Bunia_OSM_Map.png')] bg-cover opacity-50 grayscale"></div>
                <div className="relative z-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg text-center">
                    <Map size={32} className="mx-auto text-[#0066CC] mb-2" />
                    <p className="font-bold text-slate-900">Suivi Flotte en Temps Réel</p>
                    <p className="text-xs text-slate-500">4 Camions en mouvement</p>
                </div>
                {/* Points simulés */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Truck size={20} className="text-[#0066CC]" /> Flotte Active</h3>
                <div className="flex-1 space-y-4 overflow-y-auto">
                    {[
                        { id: 'TRUCK-01', driver: 'Moussa K.', status: 'En route', dest: 'Ma Campagne', load: '85%' },
                        { id: 'TRUCK-02', driver: 'Jean P.', status: 'En livraison', dest: 'Centre Ville', load: '45%' },
                        { id: 'TRUCK-03', driver: 'Michel D.', status: 'Au dépôt', dest: '-', load: '0%' },
                    ].map((truck, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-slate-900 text-sm">{truck.id}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${truck.status === 'Au dépôt' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>{truck.status}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">Chauffeur: <span className="text-slate-700 font-medium">{truck.driver}</span></p>
                            {truck.dest !== '-' && <p className="text-xs text-slate-500">Vers: {truck.dest}</p>}
                            {truck.load !== '0%' && (
                                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-[#0066CC]" style={{ width: truck.load }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <Header title="Programmation des Livraisons" />
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                <p>Aucune livraison en attente d'assignation</p>
                <button className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">Créer une tournée</button>
            </div>
        </div>
    </div>
);

const PartnersModule = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { kpi: 'Dépôts Total', val: '15' },
                { kpi: 'Ventes du jour (Réseau)', val: '1.2M FC' },
                { kpi: 'Stock Déporté', val: '45%' },
                { kpi: 'Nouveaux (30j)', val: '+2' },
            ].map((k, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">{k.kpi}</p>
                    <p className="text-2xl font-black text-slate-900">{k.val}</p>
                </div>
            ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <Header title="Gestion des Dépôts Relais" />
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    <tr><th className="px-6 py-4 rounded-l-xl">Nom du Relais</th><th className="px-6 py-4">Responsable</th><th className="px-6 py-4">Localisation</th><th className="px-6 py-4">Stock Actuel</th><th className="px-6 py-4">Performance</th><th className="px-6 py-4 rounded-r-xl">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { name: 'Relais Ma Campagne', resp: 'Mme. Kapinga', loc: 'Ma Campagne', stock: 'Haut', perf: 'A+', id: 1 },
                        { name: 'Dépôt Cité Verte', resp: 'Mr. Kabuya', loc: 'Cité Verte', stock: 'Moyen', perf: 'B', id: 2 },
                        { name: 'Kiosque Marché', resp: 'Sarah M.', loc: 'Marché Central', stock: 'Bas', perf: 'A', id: 3 },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-blue-100 text-[#0066CC] flex items-center justify-center font-bold text-xs">{row.name.substring(0, 2)}</div>
                                {row.name}
                            </td>
                            <td className="px-6 py-4 text-slate-600">{row.resp}</td>
                            <td className="px-6 py-4 text-slate-500">{row.loc}</td>
                            <td className="px-6 py-4"><StatusBadge status={row.stock === 'Haut' ? 'Actif' : row.stock === 'Bas' ? 'En attente' : 'En cours'} /></td>
                            <td className="px-6 py-4 font-bold text-slate-900">{row.perf}</td>
                            <td className="px-6 py-4">
                                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MoreHorizontal size={16} className="text-slate-400" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const CRMModule = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <Header title="Base de Données Clients" />
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    <tr><th className="px-6 py-4 rounded-l-xl">Client</th><th className="px-6 py-4">Email / Tél</th><th className="px-6 py-4">Segment</th><th className="px-6 py-4">Commandes</th><th className="px-6 py-4">Dernière active</th><th className="px-6 py-4 rounded-r-xl">Solde</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { name: 'Alex Johnson', contact: 'alex@example.com', segment: 'Premium', orders: 45, last: '2j', solde: '0 FC' },
                        { name: 'Marie Curie', contact: '+243 81 000 0000', segment: 'Standard', orders: 12, last: '5j', solde: '0 FC' },
                        { name: 'Hôtel Deluxe', contact: 'appro@hoteldeluxe.cd', segment: 'B2B', orders: 150, last: '1j', solde: '1.5M FC (Facturé)' },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                    <img src={`https://ui-avatars.com/api/?name=${row.name}&background=random`} alt={row.name} />
                                </div>
                                {row.name}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{row.contact}</td>
                            <td className="px-6 py-4"><StatusBadge status={row.segment} /></td>
                            <td className="px-6 py-4 font-mono text-slate-500">{row.orders}</td>
                            <td className="px-6 py-4 text-slate-400 text-xs">Il y a {row.last}</td>
                            <td className="px-6 py-4 font-bold text-slate-700">{row.solde}</td>
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

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">

            {/* Sidebar Admin */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 bg-[#0066CC] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-200">MS</div>
                        <h1 className="font-black text-lg tracking-tight">Maji Safi <span className="text-[#0066CC]">Admin</span></h1>
                    </div>
                    <p className="text-xs text-slate-400 pl-11 font-medium">Gestion & Opérations v1.2</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-2">Tableaux de Bord</p>
                    <SidebarItem icon={LayoutDashboard} label="Vue d'ensemble" active={currentView === 'overview'} onClick={() => setCurrentView('overview')} />
                    <SidebarItem icon={BarChart3} label="Ventes & Finance" active={currentView === 'sales'} onClick={() => setCurrentView('sales')} />

                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-6">Opérations</p>
                    <SidebarItem icon={Package} label="Stock & Inventaire" active={currentView === 'stock'} onClick={() => setCurrentView('stock')} />
                    <SidebarItem icon={Truck} label="Logistique" active={currentView === 'distribution'} onClick={() => setCurrentView('distribution')} />
                    <SidebarItem icon={Store} label="Dépôts Relais" active={currentView === 'partners'} onClick={() => setCurrentView('partners')} />

                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-6">Relation</p>
                    <SidebarItem icon={Users} label="Clients CRM" active={currentView === 'crm'} onClick={() => setCurrentView('crm')} />
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm">
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header Admin */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">
                            {currentView === 'overview' ? "Vue d'ensemble" :
                                currentView === 'stock' ? "Gestion des Stocks" :
                                    currentView === 'sales' ? "Ventes & Finances" :
                                        currentView === 'distribution' ? "Logistique & Flotte" :
                                            currentView === 'partners' ? "Réseau de Dépôts" :
                                                "Base Clients (CRM)"}
                        </h2>
                        <p className="text-slate-400 text-xs font-medium">Dernière synchro: <span className="text-slate-600">À l'instant</span></p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-emerald-700">Système Opérationnel</span>
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
                            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg">AD</div>
                        </div>
                    </div>
                </header>

                {/* Dynamic View Content */}
                <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50 scroll-smooth">
                    {currentView === 'overview' && <OverviewModule />}
                    {currentView === 'stock' && <StockModule />}
                    {currentView === 'sales' && <SalesModule />}
                    {currentView === 'distribution' && <DistributionModule />}
                    {currentView === 'partners' && <PartnersModule />}
                    {currentView === 'crm' && <CRMModule />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
