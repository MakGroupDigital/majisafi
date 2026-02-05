import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Droplets, Leaf, Zap, Award } from 'lucide-react';
import { BOTTLE_PRICES } from '../constants';
import PaymentModal from './PaymentModal';

const GAMME = [
  { label: '10L', img: '/gamme/10L.png', type: 'unite', description: 'Parfait pour les familles' },
  { label: '7.5L', img: '/gamme/7500CL.png', type: 'paquet', paquet: 6, description: 'Paquet économique' },
  { label: '5L', img: '/gamme/5L.png', type: 'unite', description: 'Taille intermédiaire' },
  { label: '1L', img: '/gamme/1L.png', type: 'paquet', paquet: 12, description: 'Portable et pratique' },
  { label: '350CL', img: '/gamme/350CL.png', type: 'paquet', paquet: 24, description: 'Format individuel' },
];

interface CartItem {
  size: string;
  quantity: number;
  pricePerUnit: number;
}

interface GammePageProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
}

const GammePage: React.FC<GammePageProps> = ({ cart, setCart }) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleIncrement = (label: string) => {
    setQuantities(q => ({ ...q, [label]: (q[label] || 1) + 1 }));
  };

  const handleDecrement = (label: string) => {
    setQuantities(q => ({ ...q, [label]: Math.max(1, (q[label] || 1) - 1) }));
  };

  const handleAddToCart = (label: string, type: string, paquet?: number) => {
    const qty = quantities[label] || 1;
    const price = BOTTLE_PRICES[label] || 0;
    let quantity = qty;
    if (type === 'paquet' && paquet) quantity = qty * paquet;
    setCart([
      ...cart.filter(item => item.size !== label),
      { size: label, quantity, pricePerUnit: price }
    ]);
  };

  const handleRemoveFromCart = (label: string) => {
    setCart(cart.filter(item => item.size !== label));
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  const MIN_TOTAL = 100000;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0066CC] to-[#2C5282] rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
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
              <h1 className="text-4xl md:text-5xl font-black">Notre Gamme Complète</h1>
              <p className="text-blue-200 text-sm">Maji Safi Ya Kuetu</p>
            </div>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl">
            Découvrez toutes nos solutions d'eau pure et saine, adaptées à chaque besoin et chaque budget.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Droplets, label: 'Pureté Garantie', value: '100%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Leaf, label: 'Écologique', value: 'Recyclable', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Zap, label: 'Livraison Rapide', value: '30-45 mins', color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: Award, label: 'Certifié', value: 'ISO 9001', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-slate-900 text-lg font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-8">Tous nos produits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {GAMME.map(({ label, img, type, paquet, description }) => {
            const inCart = cart.find(item => item.size === label);
            return (
              <div key={label} className="flex flex-col items-center bg-white rounded-2xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-all">
                <img src={img} alt={label} className="w-80 h-80 object-contain mb-4" loading="lazy" />
                <span className="font-bold text-slate-800 text-xl mb-1">{label}</span>
                <p className="text-xs text-slate-500 text-center mb-2">{description}</p>
                <span className="text-xs font-bold text-[#0066CC] mb-2">
                  {type === 'paquet' && paquet ? `Paquet de ${paquet}` : 'À l\'unité'}
                </span>
                <span className="text-base font-black text-slate-900 mb-4">
                  {type === 'paquet' && paquet
                    ? `${BOTTLE_PRICES[label] ? BOTTLE_PRICES[label] + ' CDF / paquet' : ''}`
                    : `${BOTTLE_PRICES[label] ? BOTTLE_PRICES[label] + ' CDF / unité' : ''}`}
                </span>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => handleDecrement(label)} className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 hover:bg-slate-100"><Minus size={18} /></button>
                  <span className="w-8 text-center font-bold">{quantities[label] || 1}</span>
                  <button onClick={() => handleIncrement(label)} className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 hover:bg-slate-100"><Plus size={18} /></button>
                </div>
                <button
                  onClick={() => handleAddToCart(label, type, paquet)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-white shadow transition-all active:scale-95 ${inCart ? 'bg-green-600 hover:bg-green-700' : 'bg-[#0066CC] hover:bg-blue-700'}`}
                >
                  <ShoppingCart size={18} />
                  {inCart ? 'Ajouté' : 'Ajouter'}
                </button>
                {inCart && (
                  <button onClick={() => handleRemoveFromCart(label)} className="mt-2 text-xs text-red-500 flex items-center gap-1 hover:underline"><Trash2 size={14} /> Retirer</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 max-w-2xl mx-auto w-full">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Votre panier</h3>
        {cart.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Aucun article sélectionné</p>
        ) : (
          <div className="space-y-4">
            <ul className="space-y-2">
              {cart.map(item => (
                <li key={item.size} className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">{item.size} <span className="text-xs text-slate-400">x{item.quantity}</span></span>
                  <span className="font-bold text-slate-900">{(item.quantity * item.pricePerUnit).toLocaleString()} CDF</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center border-t-2 border-slate-300 pt-4 mt-4">
              <span className="font-bold text-slate-900 text-lg">Total</span>
              <span className="font-black text-2xl text-[#0066CC]">{total.toLocaleString()} CDF</span>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className={`w-full mt-6 px-8 py-4 rounded-xl font-bold text-white text-lg shadow transition-all ${total >= MIN_TOTAL ? 'bg-[#0066CC] hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
              disabled={total < MIN_TOTAL}
            >
              Procéder au paiement
            </button>
            {total < MIN_TOTAL && (
              <p className="text-xs text-red-500 text-center mt-2">Montant minimum : 100 000 CDF</p>
            )}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cart={cart}
        total={total}
      />
    </div>
  );
};

export default GammePage;
