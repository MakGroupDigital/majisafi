import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useProducts } from '../hooks/useSupabaseData';
import PaymentModal from './PaymentModal';

interface CartItem {
  size: string;
  quantity: number;
  pricePerUnit: number;
  productId: string;
}

interface GammeSectionProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
}

const MIN_TOTAL = 100000;

// Fonction pour obtenir l'image correspondant à la taille
const getProductImage = (size: string): string => {
  const imageMap: { [key: string]: string } = {
    '1L': '/gamme/1L.png',
    '5L': '/gamme/5L.png',
    '10L': '/gamme/10L.png',
    '350CL': '/gamme/350CL.png',
    '7500CL': '/gamme/7500CL.png',
    '25L': '/gamme/10L.png', // Par défaut 10L pour 25L
  };
  
  // Chercher une correspondance exacte ou partielle
  const normalized = size.trim().toUpperCase().replace(/\s+/g, '');
  
  for (const [key, image] of Object.entries(imageMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return image;
    }
  }
  
  // Fallback par défaut
  return '/gamme/10L.png';
};

const GammeSection: React.FC<GammeSectionProps> = ({ cart, setCart }) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { products, loading, error } = useProducts();

  const handleIncrement = (productId: string) => {
    setQuantities(q => ({ ...q, [productId]: (q[productId] || 1) + 1 }));
  };

  const handleDecrement = (productId: string) => {
    setQuantities(q => ({ ...q, [productId]: Math.max(1, (q[productId] || 1) - 1) }));
  };

  const handleAddToCart = (product: any, qty: number) => {
    const cartItem: CartItem = {
      size: product.size,
      quantity: product.type === 'paquet' && product.quantity_per_package ? qty * product.quantity_per_package : qty,
      pricePerUnit: product.price,
      productId: product.id,
    };

    // Si déjà dans le panier, on remplace la quantité
    setCart([
      ...cart.filter(item => item.size !== product.size),
      cartItem
    ]);
  };

  const handleRemoveFromCart = (size: string) => {
    setCart(cart.filter(item => item.size !== size));
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);

  if (loading) {
    return (
      <section className="mb-12" id="notre-gamme">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Notre gamme de bouteilles
        </h2>
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-blue-600 mb-2">💧</div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12" id="notre-gamme">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Notre gamme de bouteilles
        </h2>
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600">Erreur lors du chargement des produits: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12" id="notre-gamme">
      <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Helvetica Bold, Arial Bold, sans-serif' }}>
        Notre gamme de bouteilles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
        {products.map((product) => {
          const inCart = cart.find(item => item.size === product.size);
          const qty = quantities[product.id] || 1;
          
          return (
            <div key={product.id} className="flex flex-col items-center bg-white rounded-2xl shadow p-6 border border-slate-100">
              <img 
                src={product.image_url || getProductImage(product.size)} 
                alt={product.size} 
                className="w-80 h-80 object-contain mb-3 rounded-lg" 
                loading="lazy" 
                onError={(e) => {
                  e.currentTarget.src = getProductImage(product.size);
                }}
              />
              <span className="font-bold text-slate-800 text-xl mb-1">{product.size}</span>
              <span className="text-xs font-bold text-[#0066CC] mb-2">
                {product.type === 'paquet' && product.quantity_per_package ? `Paquet de ${product.quantity_per_package}` : 'À l\'unité'}
              </span>
              <span className="text-base font-black text-slate-900 mb-2">
                {product.type === 'paquet' && product.quantity_per_package
                  ? `${product.price} CDF / paquet`
                  : `${product.price} CDF / unité`}
              </span>
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={() => handleDecrement(product.id)} 
                  className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 hover:bg-slate-100"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button 
                  onClick={() => handleIncrement(product.id)} 
                  className="w-8 h-8 flex items-center justify-center rounded bg-slate-50 hover:bg-slate-100"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={() => handleAddToCart(product, qty)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-white shadow transition-all active:scale-95 ${inCart ? 'bg-green-600' : 'bg-[#0066CC]'}`}
              >
                <ShoppingCart size={18} />
                {inCart ? 'Ajouté' : 'Ajouter au panier'}
              </button>
              {inCart && (
                <button 
                  onClick={() => handleRemoveFromCart(product.size)} 
                  className="mt-2 text-xs text-red-500 flex items-center gap-1 hover:underline"
                >
                  <Trash2 size={14} /> Retirer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Résumé panier */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto flex flex-col items-center">
        <h3 className="text-lg font-bold mb-2 text-slate-900">Votre panier</h3>
        {cart.length === 0 ? (
          <p className="text-slate-600 text-sm mb-4">Votre panier est vide</p>
        ) : (
          <div className="w-full space-y-2 mb-4">
            {cart.map((item) => (
              <div key={item.size} className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-700 font-semibold">{item.size}</span>
                <span className="text-slate-600 text-sm">{item.quantity} unités × {item.pricePerUnit} CDF</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between w-full py-2 border-t-2 border-slate-300 font-bold text-lg mb-4">
          <span>Total:</span>
          <span className="text-[#0066CC]">{total.toLocaleString()} CDF</span>
        </div>
        {total >= MIN_TOTAL && cart.length > 0 ? (
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Procéder au paiement
          </button>
        ) : (
          <button disabled className="w-full bg-slate-400 text-white py-3 rounded-xl font-bold cursor-not-allowed">
            Montant minimum: {MIN_TOTAL.toLocaleString()} CDF
          </button>
        )}
      </div>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} cart={cart} total={total} />
    </section>
  );
};

export default GammeSection;
