import React, { useState } from 'react';
import { Truck, Package, Clock, Users, Navigation, Car, UserCheck } from 'lucide-react';
import { useDeliveries, useVehicles, useDrivers } from '../../hooks/useSupabaseData';
import VehicleManagement from './VehicleManagement';
import DriverManagement from './DriverManagement';

const LogisticsManagement: React.FC = () => {
  const { deliveries, loading: deliveriesLoading } = useDeliveries();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { drivers, loading: driversLoading } = useDrivers();
  const [activeTab, setActiveTab] = useState<'tracking' | 'vehicles' | 'drivers'>('tracking');

  const isLoading = deliveriesLoading || vehiclesLoading || driversLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Logistique & Suivi Temps Réel</h1>
          <p className="text-slate-600 mt-1">Gestion complète de la flotte et des livraisons</p>
        </div>
        
        {/* Onglets de navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'tracking'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Navigation size={16} />
            Suivi Livraisons
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'vehicles'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Car size={16} />
            Véhicules ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'drivers'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <UserCheck size={16} />
            Chauffeurs ({drivers.length})
          </button>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'vehicles' && <VehicleManagement />}
      {activeTab === 'drivers' && <DriverManagement />}
      {activeTab === 'tracking' && (
        <>
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Truck className="text-blue-600" size={24} />
                <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-full">
                  {deliveries.filter(d => d.status === 'in_transit').length}
                </span>
              </div>
              <p className="text-blue-600 text-sm font-semibold">En Transit</p>
              <p className="text-2xl font-black text-blue-900">
                {deliveries.filter(d => d.status === 'in_transit').length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-yellow-600" size={24} />
                <span className="text-xs font-bold text-yellow-600 bg-white px-2 py-1 rounded-full">
                  {deliveries.filter(d => d.status === 'pending').length}
                </span>
              </div>
              <p className="text-yellow-600 text-sm font-semibold">En Attente</p>
              <p className="text-2xl font-black text-yellow-900">
                {deliveries.filter(d => d.status === 'pending').length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Package className="text-green-600" size={24} />
                <span className="text-xs font-bold text-green-600 bg-white px-2 py-1 rounded-full">
                  {deliveries.filter(d => d.status === 'delivered').length}
                </span>
              </div>
              <p className="text-green-600 text-sm font-semibold">Livrés Aujourd'hui</p>
              <p className="text-2xl font-black text-green-900">
                {deliveries.filter(d => d.status === 'delivered').length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-purple-600" size={24} />
                <span className="text-xs font-bold text-purple-600 bg-white px-2 py-1 rounded-full">
                  {drivers.filter(d => d.status === 'on_duty').length}
                </span>
              </div>
              <p className="text-purple-600 text-sm font-semibold">Chauffeurs Actifs</p>
              <p className="text-2xl font-black text-purple-900">
                {drivers.filter(d => d.status === 'on_duty').length}
              </p>
            </div>
          </div>

          {/* Message pour le suivi en temps réel */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <Navigation className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-xl font-black text-blue-900 mb-2">Suivi GPS en Temps Réel</h3>
            <p className="text-blue-700 mb-4">
              Le module de suivi GPS sera disponible une fois que vous aurez ajouté des véhicules avec des dispositifs GPS.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setActiveTab('vehicles')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Ajouter des Véhicules
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
              >
                Ajouter des Chauffeurs
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LogisticsManagement;