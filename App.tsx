
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import RecentOrders from './components/RecentOrders';
import GammeSection from './components/GammeSection';
import GammePage from './components/GammePage';
import HomePage from './components/HomePage';
import RecyclingProgram from './components/RecyclingProgram';
import DistributorsPage from './components/DistributorsPage';
import { BottleSize, CartItem } from './types';
import { BOTTLE_PRICES, BRAND_COLORS, COMPANY_INFO } from './constants';
import { Droplets, Truck, Clock, ShieldCheck, User, CreditCard, Settings as SettingsIcon, Mail, Phone, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('accueil');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);


  const renderContent = () => {
    switch (currentPage) {
      case 'accueil':
        return (
          <>
            <HomePage
              onOrderClick={() => {
                setCurrentPage('commander');
                setTimeout(() => document.getElementById('notre-gamme')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              onRecyclingClick={() => {
                setCurrentPage('recyclage');
              }}
            />

            {/* Section Notre gamme synchronisée avec le panier */}
            <GammeSection cart={cart} setCart={setCart} />
          </>
        );
      case 'recyclage':
        return (
          <RecyclingProgram
            onStartRecycling={() => {
              alert(`Merci de votre intérêt!\n\nPour commencer le programme de recyclage:\n\n1. Appelez-nous: ${COMPANY_INFO.phoneDisplay}\n2. Ou visitez notre usine: ${COMPANY_INFO.address}\n3. Ou commandez en ligne et mentionnez le recyclage\n\nVous recevrez un kit de démarrage avec tous les détails.`);
            }}
          />
        );
      case 'commander':
        return (
          <>
            <Hero onOrderClick={() => {
              setCurrentPage('commander');
              setTimeout(() => document.getElementById('notre-gamme')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Truck, label: 'Livraison', value: '30-45 mins', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Droplets, label: 'Qualité Source', value: 'PH 7.4+', color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { icon: ShieldCheck, label: 'Indice Pureté', value: '100% Pur', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: Clock, label: 'Service Client', value: '24h/24', color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-slate-900 text-lg font-black">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Section Notre gamme synchronisée avec le panier */}
            <GammeSection cart={cart} setCart={setCart} />
          </>
        );
      case 'panier':
        return (
          <GammePage cart={cart} setCart={setCart} />
        );
      case 'commandes':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900">Historique des commandes</h2>
            <RecentOrders />
          </div>
        );
      case 'factures':
        return (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#0066CC]">
              <CreditCard size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Vos Factures</h2>
            <p className="text-slate-500">Aucune facture impayée pour le moment. Votre compte est à jour.</p>
          </div>
        );
      case 'profil':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tableau de Bord Header - Only on Profile Page */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-[10px] font-black text-[#0066CC] uppercase tracking-widest mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Tableau de Bord</h2>
                <h1 className="text-4xl font-black text-slate-900" style={{ fontFamily: 'Helvetica Bold, Arial Bold, sans-serif' }}>Bienvenue chez vous</h1>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <img key={i} className="w-8 h-8 rounded-full border-2 border-white object-cover" src={`https://picsum.photos/100/100?random=${i}`} />
                  ))}
                </div>
                <p className="text-[10px] font-bold text-slate-500 pr-2">
                  <span className="text-slate-900">12 voisins</span> ont commandé aujourd'hui
                </p>
              </div>
            </div>

            {/* Profile Content */}
            <div className="bg-white rounded-3xl p-12 border border-slate-100">
              <div className="flex items-center gap-8 mb-12">
                <img src="https://picsum.photos/seed/user123/200/200" className="w-32 h-32 rounded-3xl object-cover shadow-xl" />
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Alex Johnson</h2>
                  <p className="text-slate-500 mb-4">alex.j@example.com • Kinshasa, RDC</p>
                  <span className="bg-blue-50 text-[#0066CC] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Membre Premium</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => alert('Fonctionnalité: Modifier vos informations personnelles\n\nNom, Email, Téléphone, Adresse')}
                  className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <User className="text-slate-400" />
                    <span className="font-bold text-slate-700">Informations Personnelles</span>
                  </div>
                  <Clock size={16} className="text-slate-300" />
                </button>
                <button
                  onClick={() => alert('Fonctionnalité: Gérer vos préférences de livraison\n\nAdresse, Horaires, Instructions spéciales')}
                  className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <SettingsIcon className="text-slate-400" />
                    <span className="font-bold text-slate-700">Préférences de Livraison</span>
                  </div>
                  <Clock size={16} className="text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'distributeurs':
        return <DistributorsPage />;
      case 'parametres':
        return (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Paramètres</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Notifications</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-slate-700">Recevoir les notifications de livraison</span>
                </label>
              </div>
              <div className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Confidentialité</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-slate-700">Partager mes données avec les partenaires</span>
                </label>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Compte</h3>
                <button className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${BRAND_COLORS.sourceBlue} transparent transparent transparent` }}
          ></div>
        </div>
        <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] animate-pulse">Chargement de Maji Safi...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {currentPage === 'profil' && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <NavBar
          cartCount={cart.length}
          onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-black/40 flex lg:hidden" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-white w-64 h-full shadow-xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
              <button className="self-end mb-6 text-slate-400 hover:text-[#0066CC]" onClick={() => setIsMenuOpen(false)}>
                ✕
              </button>
              <nav className="flex flex-col gap-4">
                {[{ label: 'Accueil', id: 'accueil' }, { label: 'Commander', id: 'commander' }, { label: 'Trouver un relais', id: 'distributeurs' }, { label: 'Mes Commandes', id: 'commandes' }, { label: 'Profil', id: 'profil' }].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id); setIsMenuOpen(false); }}
                    className={`text-lg font-bold py-2 px-4 rounded transition-all ${currentPage === item.id ? 'bg-blue-50 text-[#0066CC]' : 'text-slate-700 hover:bg-blue-50 hover:text-[#0066CC]'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 lg:p-12 max-w-[1400px] mx-auto w-full">
          {renderContent()}
        </main>

        <footer className="mt-auto py-12 px-6 lg:px-12 border-t border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4">{COMPANY_INFO.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{COMPANY_INFO.fullName}</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#0066CC] flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600 text-sm">{COMPANY_INFO.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-[#0066CC] flex-shrink-0" />
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-600 text-sm hover:text-[#0066CC] transition-colors">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#0066CC] flex-shrink-0" />
                    <a href={`tel:${COMPANY_INFO.phone}`} className="text-slate-600 text-sm hover:text-[#0066CC] transition-colors">
                      {COMPANY_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4">Liens Rapides</h3>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-slate-600 text-sm hover:text-[#0066CC] transition-colors">À Propos</a>
                  <a href="#" className="text-slate-600 text-sm hover:text-[#0066CC] transition-colors">Nos Produits</a>
                  <a href="#" className="text-slate-600 text-sm hover:text-[#0066CC] transition-colors">Programme de Recyclage</a>
                  <a href="#" className="text-slate-600 text-sm hover:text-[#0066CC] transition-colors">Contact</a>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4">Moyens de Paiement</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['M-Pesa', 'Airtel Money', 'Orange Money', 'Visa'].map(m => (
                    <div key={m} className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-600 text-center">
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-xs font-medium">
                © 2026 {COMPANY_INFO.name}. Tous droits réservés.
              </p>
              <div className="flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <a href="#" className="hover:text-[#0066CC] transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-[#0066CC] transition-colors">Conditions</a>
                <a href="#" className="hover:text-[#0066CC] transition-colors">Aide</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
