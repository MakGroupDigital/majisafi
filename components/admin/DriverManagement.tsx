import React, { useState } from 'react';
import { Plus, Edit2, Trash2, User, Phone, CreditCard, MapPin } from 'lucide-react';
import { useDrivers, useDepots } from '../../hooks/useSupabaseData';

const DriverManagement: React.FC = () => {
  const { drivers, loading, addDriver, updateDriver, deleteDriver } = useDrivers();
  const { depots } = useDepots();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    license_number: '',
    license_expiry: '',
    status: 'available',
    depot_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDriver(editingId, formData);
        setEditingId(null);
        alert('Chauffeur modifié avec succès !');
      } else {
        await addDriver(formData);
        alert('Chauffeur ajouté avec succès !');
      }
      setFormData({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        license_number: '',
        license_expiry: '',
        status: 'available',
        depot_id: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (driver: any) => {
    setFormData({
      first_name: driver.first_name,
      last_name: driver.last_name,
      phone: driver.phone,
      email: driver.email || '',
      license_number: driver.license_number,
      license_expiry: driver.license_expiry ? driver.license_expiry.split('T')[0] : '',
      status: driver.status,
      depot_id: driver.depot_id || ''
    });
    setEditingId(driver.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      try {
        await deleteDriver(id);
        alert('Chauffeur supprimé avec succès !');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'on_duty': return 'bg-blue-100 text-blue-800';
      case 'off_duty': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isLicenseExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">Gestion des Chauffeurs</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              first_name: '',
              last_name: '',
              phone: '',
              email: '',
              license_number: '',
              license_expiry: '',
              status: 'available',
              depot_id: ''
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          <Plus size={20} />
          Ajouter Chauffeur
        </button>
      </div>
      {/* Formulaire */}
      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 mb-4">
            {editingId ? 'Modifier le chauffeur' : 'Ajouter un chauffeur'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Prénom"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            
            <input
              type="text"
              placeholder="Nom"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
              placeholder="Email (optionnel)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder="Numéro de permis"
              value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              type="date"
              placeholder="Expiration du permis"
              value={formData.license_expiry}
              onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="available">Disponible</option>
              <option value="on_duty">En service</option>
              <option value="off_duty">Hors service</option>
              <option value="suspended">Suspendu</option>
            </select>

            <select
              value={formData.depot_id}
              onChange={(e) => setFormData({ ...formData, depot_id: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Sélectionner un dépôt --</option>
              {depots.map((depot) => (
                <option key={depot.id} value={depot.id}>
                  {depot.name}
                </option>
              ))}
            </select>

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

      {/* Liste des chauffeurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {driver.first_name} {driver.last_name}
                  </h3>
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <Phone size={12} />
                    {driver.phone}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(driver)}
                  className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(driver.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {driver.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-semibold text-xs">{driver.email}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Permis:</span>
                <span className="font-semibold font-mono text-xs">{driver.license_number}</span>
              </div>
              {driver.license_expiry && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Expiration:</span>
                  <span className={`font-semibold text-xs ${
                    isLicenseExpired(driver.license_expiry) ? 'text-red-600' :
                    isLicenseExpiringSoon(driver.license_expiry) ? 'text-yellow-600' : ''
                  }`}>
                    {new Date(driver.license_expiry).toLocaleDateString('fr-FR')}
                    {isLicenseExpired(driver.license_expiry) && ' ⚠️'}
                    {isLicenseExpiringSoon(driver.license_expiry) && ' ⚠️'}
                  </span>
                </div>
              )}
              {driver.depots && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Dépôt:</span>
                  <span className="font-semibold">{driver.depots.name}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                <CreditCard size={12} />
                {driver.status === 'available' ? 'Disponible' :
                 driver.status === 'on_duty' ? 'En service' :
                 driver.status === 'off_duty' ? 'Hors service' : 'Suspendu'}
              </span>
              
              {(isLicenseExpired(driver.license_expiry) || isLicenseExpiringSoon(driver.license_expiry)) && (
                <span className="text-xs text-red-600 font-bold">
                  {isLicenseExpired(driver.license_expiry) ? 'Permis expiré' : 'Expire bientôt'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {drivers.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <User className="mx-auto mb-4 text-slate-400" size={48} />
          <p className="text-slate-500 text-lg">Aucun chauffeur enregistré</p>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;