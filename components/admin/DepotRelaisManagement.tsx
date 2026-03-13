import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail, MapPin, Users } from 'lucide-react';
import { DepotRelais } from '../../types';
import { useDepots } from '../../hooks/useSupabaseData';

interface DepotRelaisManagementProps {}

const DepotRelaisManagement: React.FC<DepotRelaisManagementProps> = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<DepotRelais, 'id' | 'stock' | 'createdAt'>>({
    name: '',
    location: '',
    phone: '',
    email: '',
    manager: '',
  });

  // Utiliser les hooks pour récupérer les données depuis la base
  const { depots, addDepot, updateDepot, deleteDepot } = useDepots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDepot(editingId, formData);
        setEditingId(null);
        alert('Dépôt modifié avec succès !');
      } else {
        await addDepot({
          ...formData,
          stock: [],
          created_at: new Date().toISOString(),
        });
        alert('Dépôt créé avec succès !');
      }
      setFormData({ name: '', location: '', phone: '', email: '', manager: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du dépôt');
    }
  };

  const handleEdit = (depot: DepotRelais) => {
    setFormData({ name: depot.name, location: depot.location, phone: depot.phone, email: depot.email, manager: depot.manager });
    setEditingId(depot.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDepot(id);
      alert('Dépôt supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du dépôt');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900">Gestion des Dépôts Relais</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', location: '', phone: '', email: '', manager: '' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          <Plus size={20} />
          Ajouter Dépôt
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-black text-slate-900 mb-4">{editingId ? 'Modifier le dépôt' : 'Créer un nouveau dépôt'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom du dépôt"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Localisation"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Responsable"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold">
                {editingId ? 'Mettre à jour' : 'Créer'}
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

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depots.map((depot) => (
          <div key={depot.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">{depot.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(depot)}
                  className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(depot.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={16} />
                <span className="text-sm">{depot.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={16} />
                <span className="text-sm">{depot.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={16} />
                <span className="text-sm">{depot.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users size={16} />
                <span className="text-sm">Responsable: {depot.manager}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Créé le: {new Date(depot.createdAt).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm font-semibold text-emerald-600 mt-2">Stock: {depot.stock.length} article(s)</p>
            </div>
          </div>
        ))}
      </div>

      {depots.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-500 text-lg">Aucun dépôt créé. Commencez par en créer un!</p>
        </div>
      )}
    </div>
  );
};

export default DepotRelaisManagement;
