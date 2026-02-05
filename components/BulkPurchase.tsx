
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Info } from 'lucide-react';
import { BottleSize } from '../types';
import { BRAND_COLORS, BOTTLE_PRICES } from '../constants';

const BulkPurchase: React.FC<{ onAddToCart: (size: BottleSize, qty: number) => void }> = ({ onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>('5L');
  const [quantity, setQuantity] = useState(1);

  const sizes = ['33cl', '75cl', '1L', '5L', '10L'];

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const total = (BOTTLE_PRICES[selectedSize] || 0) * quantity;

  return (
    <div id="bulk-purchase" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Helvetica Bold, Arial Bold, sans-serif' }}>
            Achat en Gros
          </h2>
          <p className="text-slate-500 text-sm font-light">Sélectionnez le format idéal pour votre consommation</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
          <Info size={20} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
              selectedSize === size 
                ? 'border-[#0066CC] bg-blue-50/50 scale-105 shadow-md' 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className={`mb-3 ${selectedSize === size ? 'text-[#0066CC]' : 'text-slate-300'}`}>
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                <path d="M16 6V4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4V6M18 6H6C4.89543 6 4 6.89543 4 8V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8C20 6.89543 19.1046 6 18 6Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-lg font-black text-slate-800 mb-1">{size}</span>
            <span className="text-[10px] font-bold text-[#0066CC]">{BOTTLE_PRICES[size]} CDF</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Quantité</span>
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200">
            <button onClick={handleDecrement} className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100"><Minus size={18} /></button>
            <span className="w-12 text-center text-xl font-bold text-slate-900">{quantity}</span>
            <button onClick={handleIncrement} className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100"><Plus size={18} /></button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center md:items-end">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Total Estimé</span>
          <span className="text-3xl font-black text-slate-900">{total.toLocaleString()} <span className="text-sm">CDF</span></span>
        </div>

        <button 
          onClick={() => onAddToCart(selectedSize as any, quantity)}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95"
          style={{ backgroundColor: BRAND_COLORS.sourceBlue }}
        >
          <ShoppingCart size={20} />
          Ajouter au Panier
        </button>
      </div>
    </div>
  );
};

export default BulkPurchase;
