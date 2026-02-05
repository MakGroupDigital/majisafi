
import React from 'react';
import { ArrowRight, Waves } from 'lucide-react';
import { BRAND_COLORS } from '../constants';

const Hero: React.FC<{ onOrderClick: () => void }> = ({ onOrderClick }) => {
  return (
    <div className="relative w-full h-[450px] overflow-hidden rounded-3xl bg-slate-900 flex items-center shadow-xl mb-12">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1548919973-5cdf5916ad7a?q=80&w=2072&auto=format&fit=crop" 
          alt="Éclaboussure d'eau" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
      </div>

      <div className="relative z-10 px-12 max-w-2xl">
        <div className="flex items-center gap-2 mb-6 animate-bounce">
          <Waves className="text-blue-400" size={24} />
          <span className="text-blue-400 font-bold tracking-widest uppercase text-xs">Pureté Garantie</span>
        </div>
        <h1 className="text-white text-6xl font-serif leading-tight mb-4" style={{ fontFamily: 'Helvetica Bold, Arial Bold, sans-serif' }}>
          L'eau pure pour tous <br />
          <span className="text-blue-400 italic">vos besoins</span>
        </h1>
        <p className="text-slate-300 text-lg mb-10 max-w-md leading-relaxed font-light">
          Puisée au cœur des sources les plus pures, livrée à votre porte en moins de 60 minutes.
        </p>
        
        <button 
          onClick={onOrderClick}
          className="group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          style={{ backgroundColor: BRAND_COLORS.deepRed }}
        >
          Commander Maintenant
          <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
        </button>
      </div>

      <div className="absolute bottom-8 right-12 flex gap-4 hidden md:flex">
         <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <p className="text-white font-bold text-2xl">50k+</p>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-tighter">Livraisons</p>
         </div>
         <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <p className="text-white font-bold text-2xl">4.9/5</p>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-tighter">Note Clients</p>
         </div>
      </div>
    </div>
  );
};

export default Hero;
