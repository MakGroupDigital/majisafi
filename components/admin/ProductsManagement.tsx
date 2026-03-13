import React, { useState } from 'react';
import { Product } from '../../types';
import { useProducts } from '../../hooks/useSupabaseData';

interface ProductsManagementProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const ProductsManagement: React.FC<ProductsManagementProps> = ({ products, setProducts }) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { uploadProductImage, deleteProduct: deleteProductFromDB, addProduct: addProductToDB, updateProduct } = useProducts();

  // Fonction pour obtenir l'image du produit basée sur sa taille
  const getProductImage = (product: Product): string => {
    // Priorité 1: Image uploadée sur Supabase
    if (product.image_url) {
      return product.image_url;
    }
    
    // Priorité 2: Image locale basée sur la taille
    const sizeMap: { [key: string]: string } = {
      '10L': '/gamme/10L.png',
      '5L': '/gamme/5L.png',
      '1L': '/gamme/1L.png',
      '350ml': '/gamme/350CL.png',
      '350CL': '/gamme/350CL.png',
      '750ml': '/gamme/7500CL.png',
      '7500CL': '/gamme/7500CL.png',
    };
    
    // Normaliser la taille pour la recherche
    const normalizedSize = product.size.replace(/\s+/g, '').toUpperCase();
    
    // Chercher une correspondance exacte
    if (sizeMap[product.size]) return sizeMap[product.size];
    if (sizeMap[normalizedSize]) return sizeMap[normalizedSize];
    
    // Chercher une correspondance partielle
    for (const [key, value] of Object.entries(sizeMap)) {
      if (normalizedSize.includes(key) || key.includes(normalizedSize)) {
        return value;
      }
    }
    
    // Image par défaut si aucune correspondance
    return '/gamme/1L.png';
  };

  // Fonction pour migrer une image locale vers Supabase
  const migrateImageToSupabase = async (product: Product) => {
    if (product.image_url && product.image_url.startsWith('http')) {
      // Image déjà sur Supabase
      return;
    }
    
    try {
      const localImagePath = getPreviewImage(product.size);
      
      // Fetch l'image locale
      const response = await fetch(localImagePath);
      if (!response.ok) return;
      
      const blob = await response.blob();
      const file = new File([blob], `${product.size}.png`, { type: 'image/png' });
      
      // Upload vers Supabase
      const imageUrl = await uploadProductImage(file, product.id);
      
      // Mettre à jour le produit
      await updateProduct(product.id, { image_url: imageUrl });
      
      // Mettre à jour l'état local
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, image_url: imageUrl } : p
      ));
      
      console.log(`Image migrée pour ${product.size}: ${imageUrl}`);
    } catch (error) {
      console.error(`Erreur migration image pour ${product.size}:`, error);
    }
  };

  // Fonction pour migrer toutes les images
  const migrateAllImages = async () => {
    if (!confirm('Migrer toutes les images locales vers Supabase ? Cette opération peut prendre du temps.')) {
      return;
    }
    
    for (const product of products) {
      if (!product.image_url || !product.image_url.startsWith('http')) {
        await migrateImageToSupabase(product);
        // Attendre un peu entre chaque upload
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    alert('Migration des images terminée !');
  };
  const getPreviewImage = (size: string): string => {
    const sizeMap: { [key: string]: string } = {
      '10L': '/gamme/10L.png',
      '5L': '/gamme/5L.png',
      '1L': '/gamme/1L.png',
      '350ml': '/gamme/350CL.png',
      '350CL': '/gamme/350CL.png',
      '750ml': '/gamme/7500CL.png',
      '7500CL': '/gamme/7500CL.png',
    };
    
    const normalizedSize = size.replace(/\s+/g, '').toUpperCase();
    
    if (sizeMap[size]) return sizeMap[size];
    if (sizeMap[normalizedSize]) return sizeMap[normalizedSize];
    
    for (const [key, value] of Object.entries(sizeMap)) {
      if (normalizedSize.includes(key) || key.includes(normalizedSize)) {
        return value;
      }
    }
    
    return '/gamme/1L.png';
  };

  const [formData, setFormData] = useState({
    name: 'Eau Pure Maji Safi',
    size: '',
    description: '',
    price: 0,
    quantity_per_package: undefined,
    type: 'unite' as const,
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

  const handleAddProduct = async () => {
    if (!formData.size || formData.price <= 0) {
      alert('Remplissez tous les champs requis');
      return;
    }

    try {
      const productData = {
        ...formData,
        image_url: null, // Will be updated after image upload
      };

      // Create product first
      const newProduct = await addProductToDB(productData);
      
      // Upload image if selected
      let finalImageUrl = null;
      if (imageFile) {
        try {
          finalImageUrl = await uploadProductImage(imageFile, newProduct.id);
          // Update product with image URL
          await updateProduct(newProduct.id, { image_url: finalImageUrl });
          newProduct.image_url = finalImageUrl;
        } catch (imageError) {
          console.error('Erreur upload image:', imageError);
          // Continue without image - product is already created
        }
      }

      setProducts([newProduct, ...products]);
      
      setFormData({
        name: 'Eau Pure Maji Safi',
        size: '',
        description: '',
        price: 0,
        quantity_per_package: undefined,
        type: 'unite',
      });
      setImageFile(null);
      setPreviewUrl(null);
      setIsAddingProduct(false);
    } catch (err) {
      alert('Erreur lors de l\'ajout du produit');
      console.error('Erreur ajout:', err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      size: product.size,
      description: product.description || '',
      price: product.price,
      quantity_per_package: product.quantity_per_package,
      type: product.type,
    });
    setPreviewUrl(null);
    setImageFile(null);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !formData.size || formData.price <= 0) {
      alert('Remplissez tous les champs requis');
      return;
    }

    try {
      let finalImageUrl = editingProduct.image_url;
      
      // Upload new image if selected
      if (imageFile) {
        try {
          finalImageUrl = await uploadProductImage(imageFile, editingProduct.id);
        } catch (imageError) {
          console.error('Erreur upload image:', imageError);
          // Continue with update even if image upload fails
        }
      }

      const updatedData = {
        ...formData,
        image_url: finalImageUrl,
      };

      const updatedProduct = await updateProduct(editingProduct.id, updatedData);
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      
      // Reset form
      setEditingProduct(null);
      setFormData({
        name: 'Eau Pure Maji Safi',
        size: '',
        description: '',
        price: 0,
        quantity_per_package: undefined,
        type: 'unite',
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      alert('Erreur lors de la modification du produit');
      console.error('Erreur modification:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: 'Eau Pure Maji Safi',
      size: '',
      description: '',
      price: 0,
      quantity_per_package: undefined,
      type: 'unite',
    });
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProductFromDB(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        alert('Erreur lors de la suppression du produit');
        console.error('Erreur suppression:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">Gestion des Produits</h2>
        <div className="flex gap-3">
          <button
            onClick={migrateAllImages}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
          >
            📤 Migrer Images
          </button>
          <button
            onClick={() => {
              if (editingProduct) {
                handleCancelEdit();
              }
              setIsAddingProduct(!isAddingProduct);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {(isAddingProduct || editingProduct) ? 'Annuler' : '+ Ajouter Produit'}
          </button>
        </div>
      </div>

      {(isAddingProduct || editingProduct) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-black text-slate-900">
            {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Taille</label>
              <input
                type="text"
                placeholder="ex: 5L, 1L, 350ml"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {formData.size && (
                <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-2">Aperçu de l'image :</p>
                  <img 
                    src={previewUrl || getPreviewImage(formData.size)} 
                    alt="Aperçu"
                    className="h-16 w-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/gamme/1L.png';
                    }}
                  />
                  {previewUrl && <p className="text-xs text-green-600 mt-1">Image personnalisée sélectionnée</p>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Prix (CDF)</label>
              <input
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'unite' | 'paquet' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="unite">Unité</option>
                <option value="paquet">Paquet</option>
              </select>
            </div>

            {formData.type === 'paquet' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantité par Paquet</label>
                <input
                  type="number"
                  placeholder="ex: 12"
                  value={formData.quantity_per_package || ''}
                  onChange={(e) => setFormData({ ...formData, quantity_per_package: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                placeholder="Description du produit"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Photo du Produit</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="mt-4 h-40 object-cover rounded-lg" />
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              {editingProduct ? 'Modifier le Produit' : 'Ajouter le Produit'}
            </button>
            {editingProduct && (
              <button
                onClick={handleCancelEdit}
                className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <img 
                src={getProductImage(product)} 
                alt={`${product.name} ${product.size}`}
                className="h-32 w-auto object-contain"
                onError={(e) => {
                  // Si l'image ne charge pas, utiliser l'image par défaut
                  const target = e.target as HTMLImageElement;
                  target.src = '/gamme/1L.png';
                }}
              />
            </div>
            
            <div className="p-6 space-y-3">
              <div>
                <p className="text-sm text-slate-500 font-semibold">{product.type === 'paquet' ? 'PAQUET' : 'UNITÉ'}</p>
                <p className="text-2xl font-black text-slate-900">{product.size}</p>
                <p className="text-sm text-slate-600 font-medium">{product.name}</p>
              </div>

              {product.description && (
                <p className="text-sm text-slate-600">{product.description}</p>
              )}

              {product.quantity_per_package && (
                <p className="text-xs text-slate-500">Quantité: {product.quantity_per_package}</p>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <p className="text-xl font-black text-blue-600">{product.price.toLocaleString()} CDF</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="px-3 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-500 font-semibold">Aucun produit trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
