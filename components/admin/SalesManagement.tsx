import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { Sale, StockItem, DepotRelais, Product } from '../../types';
import { useProducts, useDepots, useSales } from '../../hooks/useSupabaseData';
import { salesAPI } from '../../utils/supabase';

interface SalesManagementProps {
  stocks: StockItem[];
  setStocks: (stocks: StockItem[]) => void;
}

const SalesManagement: React.FC<SalesManagementProps> = ({ stocks, setStocks }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState<string>('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile' | 'check'>('cash');
  
  // Récupérer les données depuis la base de données
  const { products } = useProducts();
  const { depots } = useDepots();
  const { sales, addSale, deleteSale } = useSales();

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepot || items.length === 0) {
      alert('Veuillez sélectionner un dépôt et ajouter des articles');
      return;
    }

    try {
      const saleItems = items
        .map((item) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          return {
            product_id: product.id,
            product_name: `${product.name} ${product.size}`,
            quantity: item.quantity,
            unit_price: product.price,
            total: item.quantity * product.price,
          };
        })
        .filter(Boolean) as any[];

      const total = saleItems.reduce((sum, item) => sum + item.total, 0);

      const newSale = {
        depot_id: selectedDepot,
        total,
        payment_method: paymentMethod,
        status: 'completed',
        date: new Date().toISOString(),
      };

      // Créer la vente avec les articles via l'API
      await salesAPI.createWithItems(newSale, saleItems);

      // Mettre à jour le stock local (si nécessaire)
      items.forEach((item) => {
        const stock = stocks.find(s => s.id === item.productId);
        if (stock) {
          setStocks(stocks.map(s =>
            s.id === item.productId
              ? { ...s, quantity: Math.max(0, s.quantity - item.quantity), lastUpdated: new Date().toISOString() }
              : s
          ));
        }
      });

      // Réinitialiser le formulaire
      setItems([]);
      setSelectedDepot('');
      setPaymentMethod('cash');
      setShowForm(false);
      
      alert('Vente créée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la vente:', error);
      alert('Erreur lors de la création de la vente');
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = sales.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestion des Ventes</h1>
          <div className="flex gap-6 mt-2 text-sm">
            <div>
              <p className="text-slate-600">Total Ventes</p>
              <p className="text-2xl font-black text-emerald-600">{totalSales.toLocaleString()} FC</p>
            </div>
            <div>
              <p className="text-slate-600">Transactions</p>
              <p className="text-2xl font-black text-blue-600">{totalTransactions}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setItems([]);
            setSelectedDepot('');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          <Plus size={20} />
          Ajouter Vente
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-black text-slate-900 mb-4">Créer une nouvelle vente</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dépôt</label>
                <select
                  value={selectedDepot}
                  onChange={(e) => setSelectedDepot(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">-- Sélectionner un dépôt --</option>
                  {depots.map((depot) => (
                    <option key={depot.id} value={depot.id}>
                      {depot.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Méthode de paiement</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="cash">Liquide</option>
                  <option value="card">Carte</option>
                  <option value="mobile">Mobile Money</option>
                  <option value="check">Chèque</option>
                </select>
              </div>
            </div>

            {/* Articles */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-slate-900 mb-3">Articles</h3>
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={item.productId}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].productId = e.target.value;
                      setItems(newItems);
                    }}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">-- Sélectionner un produit --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} {product.size} - {product.price.toLocaleString()} CDF
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantité"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].quantity = parseInt(e.target.value);
                      setItems(newItems);
                    }}
                    className="w-24 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-3 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold text-sm"
              >
                + Ajouter article
              </button>
            </div>

            {/* Calcul du total */}
            {items.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total estimé:</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {items.reduce((sum, item) => {
                      const product = products.find(p => p.id === item.productId);
                      return sum + (product ? item.quantity * product.price : 0);
                    }, 0).toLocaleString()} CDF
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold">
                Enregistrer Vente
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setItems([]);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left font-black text-slate-900">Date</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Dépôt</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Articles</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Total</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Paiement</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Statut</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sales.map((sale) => {
              const depot = depots.find(d => d.id === sale.depotId);
              return (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">{new Date(sale.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{depot?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{sale.items.length} article(s)</td>
                  <td className="px-6 py-4 font-black text-emerald-600">{sale.total.toLocaleString()} FC</td>
                  <td className="px-6 py-4 text-sm capitalize text-slate-600">{sale.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      {sale.status === 'completed' ? 'Complétée' : sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={async () => {
                        try {
                          await deleteSale(sale.id);
                          alert('Vente supprimée avec succès !');
                        } catch (error) {
                          console.error('Erreur lors de la suppression:', error);
                          alert('Erreur lors de la suppression de la vente');
                        }
                      }}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sales.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <TrendingUp className="mx-auto mb-4 text-slate-400" size={48} />
          <p className="text-slate-500 text-lg">Aucune vente enregistrée. Commencez par ajouter une vente!</p>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
