import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Truck, Car, Bike, Settings } from 'lucide-react';
import { useVehicles, useDepots } from '../../hooks/useSupabaseData';

const VehicleManagement: React.FC = () => {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { depots } = useDepots();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    license_plate: '',
    vehicle_type: 'truck',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    capacity_kg: 0,
    capacity_liters: 0,
    gps_device_id: '',
    status: 'available',
    depot_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateVehicle(editingId, formData);
        setEditingId(null);
        alert('Véhicule modifié avec succès !');
      } else {
        await addVehicle(formData);
        alert('Véhicule ajouté avec succès !');
      }
      setFormData({
        license_plate: '',
        vehicle_type: 'truck',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        capacity_kg: 0,
        capacity_liters: 0,
        gps_device_id: '',
        status: 'available',
        depot_id: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (vehicle: any) => {
    setFormData({
      license_plate: vehicle.license_plate,
      vehicle_type: vehicle.vehicle_type,
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      capacity_kg: vehicle.capacity_kg || 0,
      capacity_liters: vehicle.capacity_liters || 0,
      gps_device_id: vehicle.gps_device_id || '',
      status: vehicle.status,
      depot_id: vehicle.depot_id || ''
    });
    setEditingId(vehicle.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        await deleteVehicle(id);
        alert('Véhicule supprimé avec succès !');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck': return <Truck size={20} />;
      case 'van': return <Car size={20} />;
      case 'motorcycle': return <Bike size={20} />;
      case 'car': return <Car size={20} />;
      default: return <Truck size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in_use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <h2 className="text-2xl font-black text-slate-900">Gestion des Véhicules</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              license_plate: '',
              vehicle_type: 'truck',
              brand: '',
              model: '',
              year: new Date().getFullYear(),
              capacity_kg: 0,
              capacity_liters: 0,
              gps_device_id: '',
              status: 'available',
              depot_id: ''
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          <Plus size={20} />
          Ajouter Véhicule
        </button>
      </div>
      {/* Formulaire */}
      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 mb-4">
            {editingId ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Plaque d'immatriculation"
              value={formData.license_plate}
              onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            
            <select
              value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="truck">Camion</option>
              <option value="van">Camionnette</option>
              <option value="motorcycle">Moto</option>
              <option value="car">Voiture</option>
            </select>

            <input
              type="text"
              placeholder="Marque"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder="Modèle"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="number"
              placeholder="Année"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Capacité (kg)"
              value={formData.capacity_kg}
              onChange={(e) => setFormData({ ...formData, capacity_kg: parseFloat(e.target.value) })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Capacité (litres)"
              value={formData.capacity_liters}
              onChange={(e) => setFormData({ ...formData, capacity_liters: parseFloat(e.target.value) })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              placeholder="ID Dispositif GPS"
              value={formData.gps_device_id}
              onChange={(e) => setFormData({ ...formData, gps_device_id: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="available">Disponible</option>
              <option value="in_use">En service</option>
              <option value="maintenance">Maintenance</option>
              <option value="out_of_service">Hors service</option>
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

      {/* Liste des véhicules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {getVehicleIcon(vehicle.vehicle_type)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{vehicle.license_plate}</h3>
                  <p className="text-sm text-slate-600">{vehicle.brand} {vehicle.model}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Type:</span>
                <span className="font-semibold capitalize">{vehicle.vehicle_type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Année:</span>
                <span className="font-semibold">{vehicle.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Capacité:</span>
                <span className="font-semibold">{vehicle.capacity_kg}kg / {vehicle.capacity_liters}L</span>
              </div>
              {vehicle.gps_device_id && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">GPS:</span>
                  <span className="font-semibold font-mono text-xs">{vehicle.gps_device_id}</span>
                </div>
              )}
              {vehicle.depots && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Dépôt:</span>
                  <span className="font-semibold">{vehicle.depots.name}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                <Settings size={12} />
                {vehicle.status === 'available' ? 'Disponible' :
                 vehicle.status === 'in_use' ? 'En service' :
                 vehicle.status === 'maintenance' ? 'Maintenance' : 'Hors service'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <Truck className="mx-auto mb-4 text-slate-400" size={48} />
          <p className="text-slate-500 text-lg">Aucun véhicule enregistré</p>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;