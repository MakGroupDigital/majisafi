import React from 'react';
import { Droplets, Truck, Clock, ShieldCheck, Leaf, Zap, Award, Users, TrendingUp, Heart, AlertCircle, MapPin, DollarSign, Recycle } from 'lucide-react';

interface HomePageProps {
  onOrderClick: () => void;
  onRecyclingClick?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onOrderClick, onRecyclingClick }) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0066CC] via-[#2C5282] to-slate-900 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-lg"></div>
              <img 
                src="/Logo.jpeg" 
                alt="Maji Safi" 
                className="relative w-full h-full object-cover rounded-full border-4 border-white/30 shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black">Eau Pure & Saine</h1>
              <p className="text-blue-200 text-sm">Maji Safi Ya Kuetu</p>
            </div>
          </div>
          <p className="text-xl text-blue-100 mb-8">
            Maji Safi Ya Kuetu vous apporte l'eau la plus pure directement de notre usine à votre porte. Chaque goutte est garantie 100% saine et certifiée.
          </p>
          <button
            onClick={onOrderClick}
            className="bg-white text-[#0066CC] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Commander maintenant
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Notre Usine Section */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 flex-shrink-0">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg"></div>
                <img 
                  src="/Logo.jpeg" 
                  alt="Maji Safi" 
                  className="relative w-full h-full object-cover rounded-full border-3 border-[#0066CC]/20 shadow-md"
                />
              </div>
              <h2 className="text-4xl font-black text-slate-900">Notre Usine d'Eau</h2>
            </div>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Maji Safi Ya Kuetu dispose d'une usine de traitement d'eau ultramoderne équipée des dernières technologies de filtration et de purification. Notre processus en 7 étapes garantit une eau cristalline, saine et délicieuse.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Droplets className="text-[#0066CC]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Filtration Multi-Étapes</h3>
                  <p className="text-slate-600 text-sm">Sable, charbon actif, microfiltration et ultrafiltration</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="text-[#0066CC]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Stérilisation UV</h3>
                  <p className="text-slate-600 text-sm">Élimination complète des bactéries et virus</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="text-[#0066CC]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Contrôle Qualité</h3>
                  <p className="text-slate-600 text-sm">Tests quotidiens et certifications ISO 9001</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0066CC] to-[#2C5282] p-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center text-white">
              <Droplets size={80} className="mx-auto mb-4 opacity-80" />
              <p className="text-2xl font-black">Capacité Quotidienne</p>
              <p className="text-5xl font-black mt-2">50,000L</p>
              <p className="text-blue-100 mt-2">d'eau pure produite chaque jour</p>
            </div>
          </div>
        </div>
      </div>

      {/* Défis et Solutions */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Nos Défis & Solutions</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            En RDC, l'accès à l'eau potable est un défi majeur. Nous nous engageons à le relever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Défi : Eau Contaminée',
              description: 'L\'eau du robinet contient souvent des impuretés et des bactéries dangereuses pour la santé.',
              solution: 'Notre usine utilise une filtration multi-étapes et une stérilisation UV pour garantir une pureté absolue.',
              icon: AlertCircle
            },
            {
              title: 'Défi : Accès Difficile',
              description: 'Beaucoup de quartiers n\'ont pas accès à l\'eau potable de qualité.',
              solution: 'Nous livrons directement à votre porte en 30-45 minutes, 7 jours sur 7.',
              icon: MapPin
            },
            {
              title: 'Défi : Coût Élevé',
              description: 'L\'eau potable de qualité est souvent trop chère pour les familles.',
              solution: 'Nos prix sont compétitifs et nous offrons des paquets économiques pour les familles.',
              icon: DollarSign
            },
            {
              title: 'Défi : Environnement',
              description: 'Les bouteilles plastiques polluent notre environnement.',
              solution: 'Nos bouteilles sont 100% recyclables. Participez à notre programme de recyclage.',
              icon: Recycle
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-[#0066CC]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              </div>
              <p className="text-slate-600 mb-4">{item.description}</p>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm font-semibold text-[#0066CC] mb-2">✓ Notre Solution</p>
                <p className="text-slate-700 text-sm">{item.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pourquoi Nous Consommer */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-12 border border-emerald-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-lg"></div>
            <img 
              src="/Logo.jpeg" 
              alt="Maji Safi" 
              className="relative w-full h-full object-cover rounded-full border-3 border-emerald-200 shadow-md"
            />
          </div>
          <h2 className="text-4xl font-black text-slate-900">Pourquoi Consommer Maji Safi?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: 'Santé Garantie',
              description: 'Eau 100% pure, sans bactéries, sans virus, sans impuretés. Protégez votre famille.'
            },
            {
              icon: TrendingUp,
              title: 'Qualité Certifiée',
              description: 'Certifications ISO 9001, tests quotidiens, garantie de pureté absolue.'
            },
            {
              icon: Users,
              title: 'Communauté Engagée',
              description: 'Rejoignez des milliers de familles qui font confiance à Maji Safi pour leur eau.'
            }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <item.icon className="text-[#0066CC]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Programme de Recyclage */}
      <div className="bg-gradient-to-br from-[#0066CC] to-slate-950 rounded-[40px] p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full"></div>
        <h3 className="text-white text-3xl font-serif mb-4 relative z-10" style={{ fontFamily: 'Helvetica Bold, Arial Bold, sans-serif' }}>Programme de Recyclage</h3>
        <p className="text-blue-100 max-w-xl mx-auto mb-8 relative z-10 font-light">
          Rendez 10 bouteilles vides de 10L et recevez votre prochaine livraison gratuitement. Ensemble pour une ville propre.
        </p>
        <button 
          onClick={onRecyclingClick}
          className="bg-white text-blue-900 font-bold px-10 py-4 rounded-full shadow-xl hover:bg-blue-50 transition-colors relative z-10">
          En savoir plus
        </button>
      </div>
    </div>
  );
};

export default HomePage;
