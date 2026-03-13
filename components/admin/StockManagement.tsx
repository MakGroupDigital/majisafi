import React, { useState } from 'react';
import { Plus, Edit2, Trash2, QrCode, Barcode, Camera, Upload } from 'lucide-react';
import { StockItem, DepotRelais, Product } from '../../types';
import QRScanner from '../QRScanner';
import { useProducts } from '../../hooks/useSupabaseData';

interface StockManagementProps {
  stocks: StockItem[];
  setStocks: (stocks: StockItem[]) => void;
  depots: DepotRelais[];
}

const StockManagement: React.FC<StockManagementProps> = ({ stocks, setStocks, depots }) => {
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDepot, setSelectedDepot] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Récupérer les vrais produits
  const { products, uploadProductImage } = useProducts();
  
  const [formData, setFormData] = useState<Omit<StockItem, 'id' | 'lastUpdated'>>({
    productName: '',
    brand: '',
    size: '',
    milliliters: 0,
    quantity: 0,
    quantityPerPackage: 1,
    barcodeId: '',
    pricePerUnit: 0,
    depotId: '',
    imageUrl: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = formData.imageUrl;
    
    // Upload image if selected
    if (imageFile) {
      try {
        const stockId = editingId || `stock-${Date.now()}`;
        imageUrl = await uploadProductImage(imageFile, stockId);
      } catch (error) {
        console.error('Erreur upload image:', error);
        alert('Erreur lors de l\'upload de l\'image');
        return;
      }
    }
    
    const stockData = { ...formData, imageUrl };
    
    if (editingId) {
      setStocks(stocks.map(s => s.id === editingId ? { ...s, ...stockData, lastUpdated: new Date().toISOString() } : s));
      setEditingId(null);
    } else {
      const newStock: StockItem = {
        id: `stock-${Date.now()}`,
        ...stockData,
        lastUpdated: new Date().toISOString(),
      };
      setStocks([...stocks, newStock]);
    }
    
    // Reset form
    setFormData({
      productName: '',
      brand: '',
      size: '',
      milliliters: 0,
      quantity: 0,
      quantityPerPackage: 1,
      barcodeId: '',
      pricePerUnit: 0,
      depotId: '',
      imageUrl: '',
    });
    setImageFile(null);
    setPreviewUrl(null);
    setSelectedDepot('');
    setShowForm(false);
  };

  const handleEdit = (stock: StockItem) => {
    const { id, lastUpdated, ...rest } = stock;
    setFormData(rest);
    setEditingId(stock.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setStocks(stocks.filter(s => s.id !== id));
  };

  const handleQRScan = (data: string) => {
    try {
      // Essayer de parser les données QR comme JSON pour extraire les informations produit
      let productInfo;
      try {
        productInfo = JSON.parse(data);
      } catch {
        // Si ce n'est pas du JSON, traiter comme un code-barres simple
        productInfo = { barcodeId: data };
      }

      // Chercher le stock avec ce code-barres
      const item = stocks.find(s => s.barcodeId === (productInfo.barcodeId || data));
      if (item) {
        // Incrémenter la quantité
        setStocks(stocks.map(s =>
          s.id === item.id
            ? { ...s, quantity: s.quantity + s.quantityPerPackage, lastUpdated: new Date().toISOString() }
            : s
        ));
        alert(`Stock mis à jour: ${item.productName} (+${item.quantityPerPackage})`);
      } else {
        // Si le produit n'existe pas, pré-remplir le formulaire avec les données scannées
        if (productInfo.productName || productInfo.name) {
          setFormData({
            productName: productInfo.productName || productInfo.name || '',
            brand: productInfo.brand || '',
            size: productInfo.size || '',
            milliliters: productInfo.milliliters || 0,
            quantity: productInfo.quantity || 1,
            quantityPerPackage: productInfo.quantityPerPackage || 1,
            barcodeId: productInfo.barcodeId || data,
            pricePerUnit: productInfo.price || productInfo.pricePerUnit || 0,
            depotId: '',
            imageUrl: productInfo.imageUrl || '',
          });
          setShowForm(true);
          alert('Produit non trouvé. Formulaire pré-rempli avec les données scannées.');
        } else {
          alert('Code-barres non trouvé dans le stock: ' + data);
        }
      }
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      alert('Erreur lors du traitement du code scanné');
    }
    setShowScanner(false);
  };

  const totalValue = stocks.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestion du Stock</h1>
          <p className="text-slate-600 text-sm mt-1">Valeur totale: {totalValue.toLocaleString()} FC</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                productName: '',
                brand: '',
                size: '',
                milliliters: 0,
                quantity: 0,
                quantityPerPackage: 1,
                barcodeId: '',
                pricePerUnit: 0,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            <Plus size={20} />
            Ajouter
          </button>
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors"
          >
            <QrCode size={20} />
            Scanner QR
          </button>
          <button
            onClick={() => setShowBarcodeScanner(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors"
          >
            <Barcode size={20} />
            Code-barres
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-black text-slate-900 mb-4">{editingId ? 'Modifier le stock' : 'Ajouter un article au stock'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom du produit"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Marque"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Taille (ex: 5L, 10L)"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="number"
              placeholder="Millilitres"
              value={formData.milliliters}
              onChange={(e) => setFormData({ ...formData, milliliters: parseInt(e.target.value) })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="number"
              placeholder="Quantité actuelle"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="number"
              placeholder="Quantité par paquet"
              value={formData.quantityPerPackage}
              onChange={(e) => setFormData({ ...formData, quantityPerPackage: parseInt(e.target.value) })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Code-barres"
              value={formData.barcodeId}
              onChange={(e) => setFormData({ ...formData, barcodeId: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="number"
              placeholder="Prix par unité (FC)"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            
            {/* Sélection du dépôt */}
            <select
              value={formData.depotId}
              onChange={(e) => setFormData({ ...formData, depotId: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">-- Sélectionner un dépôt --</option>
              {depots.map((depot) => (
                <option key={depot.id} value={depot.id}>
                  {depot.name}
                </option>
              ))}
            </select>

            {/* Upload d'image */}
            <div className="col-span-full">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Photo du produit</label>
              <div className="flex gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {previewUrl && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-full flex gap-2">
              <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold">
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scanner */}
      {showScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} mode="qr" />}
      {showBarcodeScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowBarcodeScanner(false)} mode="barcode" />}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left font-black text-slate-900">Produit</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Quantité</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Code-barres</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Prix Unitaire</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Valeur</th>
              <th className="px-6 py-4 text-left font-black text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {stocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {stock.imageUrl && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={stock.imageUrl} alt={stock.productName} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{stock.productName}</p>
                      <p className="text-xs text-slate-500">{stock.brand} - {stock.size}</p>
                      {stock.depotId && (
                        <p className="text-xs text-blue-600">
                          {depots.find(d => d.id === stock.depotId)?.name || 'Dépôt inconnu'}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{stock.quantity}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-600">{stock.barcodeId}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{stock.pricePerUnit.toLocaleString()} FC</td>
                <td className="px-6 py-4 font-black text-emerald-600">{(stock.quantity * stock.pricePerUnit).toLocaleString()} FC</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(stock)}
                    className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(stock.id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stocks.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-500 text-lg">Aucun article en stock. Commencez par en ajouter un!</p>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
