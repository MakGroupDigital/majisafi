import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import { Client } from '../../types';

interface ClientManagementProps {
  clients: Client[];
  setClients: (clients: Client[]) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, setClients }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    clientType: 'individual',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setClients(clients.map(c => c.id === editingId ? { ...c, ...formData } : c));
      setEditingId(null);
    } else {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
      };
      setClients([...clients, newClient]);
    }
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      clientType: 'individual',
    });
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    const { id, createdAt, totalOrders, totalSpent, ...rest } = client;
    setFormData(rest);
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const typeLabels = {
    individual: 'Particulier',
    business: 'Entreprise',
    distributor: 'Distributeur',
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestion des Clients</h1>
          <div className="flex gap-6 mt-2 text-sm">
            <div>
              <p className="text-slate-600">Total Clients</p>
              <p className="text-2xl font-black text-blue-600">{clients.length}</p>
            </div>
            <div>
              <p className="text-slate-600">Distributeurs</p>
              <p className="text-2xl font-black text-purple-600">{clients.filter(c => c.clientType === 'distributor').length}</p>
            </div>
            <div>
              <p className="text-slate-600">Total Dépensé</p>
              <p className="text-2xl font-black text-emerald-600">{clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()} FC</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              address: '',
              clientType: 'individual',
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          <Plus size={20} />
          Ajouter Client
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-black text-slate-900 mb-4">{editingId ? 'Modifier le client' : 'Créer un nouveau client'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom/Raison Sociale"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              type="tel"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <select
              value={formData.clientType}
              onChange={(e) => setFormData({ ...formData, clientType: e.target.value as any })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="individual">Particulier</option>
              <option value="business">Entreprise</option>
              <option value="distributor">Distributeur</option>
            </select>
            <textarea
              placeholder="Adresse"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="col-span-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              required
            />
            <div className="col-span-full flex gap-2">
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

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{client.name}</h3>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-bold ${
                  client.clientType === 'distributor' ? 'bg-purple-100 text-purple-700' :
                  client.clientType === 'business' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {typeLabels[client.clientType]}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={16} />
                <span className="text-sm truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={16} />
                <span className="text-sm">{client.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{client.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Commandes</span>
                <span className="font-black text-slate-900">{client.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <DollarSign size={14} />
                  Total dépensé
                </span>
                <span className="font-black text-emerald-600">{client.totalSpent.toLocaleString()} FC</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Depuis: {new Date(client.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <p className="text-slate-500 text-lg">Aucun client créé. Commencez par ajouter un client!</p>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
