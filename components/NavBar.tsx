
import React from 'react';
import { ShoppingBag, Search, Bell, Menu } from 'lucide-react';
import Logo from './Logo';
import { BRAND_COLORS } from '../constants';

interface NavBarProps {
  cartCount: number;
  onToggleMenu: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ cartCount, onToggleMenu, currentPage, setCurrentPage }) => {
  const navItems = [
    { label: 'Accueil', id: 'accueil' },
    { label: 'Commander', id: 'commander' },
    { label: 'Trouver un relais', id: 'distributeurs' },
    { label: 'Mes Commandes', id: 'commandes' },
    { label: 'Profil', id: 'profil' }
  ];

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-8 pt-4">
      <div className="rounded-2xl border border-white/70 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_-22px_rgba(3,26,63,0.45)] px-4 lg:px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div onClick={() => setCurrentPage('accueil')}>
          <Logo />
        </div>

        <nav className="hidden md:flex items-center gap-3 bg-slate-100/80 rounded-full px-3 py-2 border border-white/80">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-all relative group ${currentPage === item.id ? 'text-[#0066CC] bg-white shadow-sm' : 'text-slate-600 hover:text-[#0066CC]'
                }`}
            >
              {item.label}
              <span className={`absolute -bottom-0.5 left-4 h-0.5 bg-[#0066CC] transition-all ${currentPage === item.id ? 'w-[calc(100%-2rem)]' : 'w-0 group-hover:w-[calc(100%-2rem)]'
                }`}></span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden sm:flex items-center bg-slate-100/90 rounded-full px-4 py-2 text-slate-400 group focus-within:ring-2 focus-within:ring-blue-100 border border-white/90 transition-all">
            <Search size={18} className="group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value;
                  alert(`Recherche: "${query}"\n\nFonctionnalité de recherche en développement`);
                }
              }}
              className="bg-transparent border-none outline-none text-sm ml-2 w-32 focus:w-48 transition-all text-slate-800"
            />
          </div>

          <button
            onClick={() => alert('Vous avez 3 nouvelles notifications:\n\n1. Votre commande #ORD-7721 a été livrée\n2. Nouvelle promotion: -20% sur les paquets\n3. Rappel: Recyclez vos bouteilles!')}
            className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-white">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#A32626] border-2 border-white rounded-full"></span>
          </button>

          <button
            onClick={() => setCurrentPage('panier')}
            className="group relative flex items-center gap-2 p-2 bg-gradient-to-r from-[#005dc2] to-[#10a8c7] text-white rounded-full px-6 py-2.5 shadow-lg shadow-cyan-400/20 hover:shadow-xl hover:shadow-cyan-400/25 transition-all active:scale-95">
            <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">Panier</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-[#A32626] text-[10px] font-black rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleMenu}
            className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      </div>
    </header>
  );
};

export default NavBar;
