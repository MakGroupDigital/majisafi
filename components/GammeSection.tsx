

import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { BOTTLE_PRICES } from '../constants';
import PaymentModal from './PaymentModal';

const GAMME = [
  { label: '10L', img: '/gamme/10L.png', type: 'unite' },
  { label: '7.5L', img: '/gamme/7500CL.png', type: 'paquet', paquet: 6 },
  { label: '5L', img: '/gamme/5L.png', type: 'unite' },
  { label: '1L', img: '/gamme/1L.png', type: 'paquet', paquet: 12 },
  { label: '350CL', img: '/gamme/350CL.png', type: 'paquet', paquet: 24 },
];

interface CartItem {
  size: string;
  quantity: number;
  pricePerUnit: number;
}

interface GammeSectionProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
}

const MIN_TOTAL = 100000;

const GammeSection: React.FC<GammeSectionProps> = ({ cart, setCart }) => {
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
    // Si déjà dans le panier, on remplace la quantité
    setCart([
      ...cart.filter(item => item.size !== label),
      { size: label, quantity, pricePerUnit: price }
    ]);
  };

  const handleRemoveFromCart = (label: string) => {
    setCart(cart.filter(item => item.size !== label));
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);

  return (
    <section className="mb-12" id="notre-gamme">
      <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Helvetica Bold, Arial Bold, sans-serif' }}>
        Notre gamme de bouteilles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
        {GAMME.map(({ label, img, type, paquet }) => {
          const inCart = cart.find(item => item.size === label);
          return (
            <div key={label} className="flex flex-col items-center bg-white rounded-2xl shadow p-6 border border-slate-100">
              <img src={img} alt={label} className="w-80 h-80 object-contain mb-3" loading="lazy" />
              <span className="font-bold text-slate-800 text-xl mb-1">{label}</span>
              <span className="text-xs font-bold text-[#0066CC] mb-2">
                {type === 'paquet' && paquet ? `Paquet de ${paquet}` : 'À l’unité'}
              </span>
              <span className="text-base font-black text-slate-900 mb-2">
                {type === 'paquet' && paquet
                  ? `${BOTTLE_PRICES[label] ? BOTTLE_PRICES[label] + ' CDF / paquet' : ''}`
                  : `${BOTTLE_PRICES[label] ? BOTTLE_PRICES[label] + ' CDF / unité' : ''}`}
              </span>
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => handleDecrement(label)} className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 hover:bg-slate-100"><Minus size={18} /></button>
                <span className="w-8 text-center font-bold">{quantities[label] || 1}</span>
                <button onClick={() => handleIncrement(label)} className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 hover:bg-slate-100"><Plus size={18} /></button>
              </div>
              <button
                onClick={() => handleAddToCart(label, type, paquet)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-white shadow transition-all active:scale-95 ${inCart ? 'bg-green-600' : 'bg-[#0066CC]'}`}
              >
                <ShoppingCart size={18} />
                {inCart ? 'Ajouté' : 'Ajouter au panier'}
              </button>
              {inCart && (
                <button onClick={() => handleRemoveFromCart(label)} className="mt-2 text-xs text-red-500 flex items-center gap-1 hover:underline"><Trash2 size={14} /> Retirer</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Résumé panier */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto flex flex-col items-center">
        <h3 className="text-lg font-bold mb-2 text-slate-900">Votre panier</h3>
        {cart.length === 0 ? (
          <p className="text-slate-400 mb-2">Aucun article sélectionné</p>
        ) : (
          <ul className="w-full mb-2">
            {cart.map(item => (
              <li key={item.size} className="flex justify-between items-center py-1 text-slate-700">
                <span>{item.size} <span className="text-xs text-slate-400">x{item.quantity}</span></span>
                <span className="font-bold">{(item.quantity * item.pricePerUnit).toLocaleString()} CDF</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between items-center w-full border-t border-slate-200 pt-2 mt-2">
          <span className="font-bold text-slate-900">Total</span>
          <span className="font-black text-xl text-[#0066CC]">{total.toLocaleString()} CDF</span>
        </div>
        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className={`mt-4 px-8 py-3 rounded-xl font-bold text-white text-lg shadow transition-all ${total >= MIN_TOTAL ? 'bg-[#0066CC] hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
          disabled={total < MIN_TOTAL}
        >
          Commander
        </button>
        {total < MIN_TOTAL && (
          <p className="text-xs text-red-500 mt-2">Montant minimum de commande : 100 000 CDF</p>
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cart={cart}
        total={total}
      />
    </section>
  );
};

export default GammeSection;
