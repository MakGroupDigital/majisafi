
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import { BRAND_COLORS, MOCK_USER } from '../constants';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', id: 'accueil' },
    { icon: FileText, label: 'Factures', id: 'factures' },
    { icon: History, label: 'Historique', id: 'commandes' },
    { icon: UserCircle, label: 'Profil', id: 'profil' },
    { icon: Settings, label: 'Paramètres', id: 'parametres' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 p-6">
      <div className="flex flex-col items-center mb-10 pb-10 border-b border-slate-100">
        <div className="relative mb-4 group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-[#0066CC] to-[#A32626] rounded-full blur opacity-25"></div>
          <img 
            src={MOCK_USER.avatar} 
            alt="Profil" 
            className="relative w-20 h-20 rounded-full border-2 border-white object-cover"
          />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">{MOCK_USER.name}</h3>
        <p className="text-slate-400 text-xs mb-3">{MOCK_USER.email}</p>
        <span 
          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: `${BRAND_COLORS.sourceBlue}15`, color: BRAND_COLORS.sourceBlue }}
        >
          Membre {MOCK_USER.membership}
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
              currentPage === item.id 
                ? 'bg-slate-50 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={currentPage === item.id ? 'text-[#0066CC]' : 'text-slate-400 group-hover:text-[#0066CC]'} />
              <span className="font-semibold text-sm">{item.label}</span>
            </div>
            {currentPage === item.id && <ChevronRight size={16} className="text-slate-400" />}
          </button>
        ))}
      </nav>

      <button 
        onClick={() => {
          if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
            alert('Déconnexion réussie. À bientôt!');
            // Ici on pourrait ajouter la logique de déconnexion réelle
          }
        }}
        className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-auto">
        <LogOut size={20} />
        <span className="font-bold text-sm">Déconnexion</span>
      </button>
    </aside>
  );
};

export default Sidebar;
