import React, { useState } from 'react';
import { useAuditLogs } from '../../hooks/useSupabaseData';
import { Shield, Lock, Trash2, Plus, Edit2, Eye } from 'lucide-react';

const actionColorMap: { [key: string]: string } = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  READ: 'bg-gray-100 text-gray-800',
};

const actionIconMap: { [key: string]: React.ReactNode } = {
  CREATE: <Plus size={16} />,
  UPDATE: <Edit2 size={16} />,
  DELETE: <Trash2 size={16} />,
  READ: <Eye size={16} />,
};

export const SecurityAudit: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [actionFilter, setActionFilter] = useState<string | undefined>();
  const { logs, loading, error } = useAuditLogs(actionFilter, 500);

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'READ'];

  // Debug: Log les données reçues
  console.log('Audit logs:', { logs, loading, error });

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="text-blue-600 mt-1 flex-shrink-0" size={24} />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-blue-900 mb-1">Journal d'Audit de Sécurité</h2>
            <p className="text-blue-800 text-sm">
              Tous les changements effectués par les administrateurs sont enregistrés ici. Ce journal est immuable et ne peut pas être supprimé.
            </p>
            <div className="flex items-center gap-2 mt-3 text-blue-700 text-sm">
              <Lock size={16} />
              <span font-semibold>Ce journal est protégé et immuable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-gray-900">Filtrer par action:</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActionFilter(undefined)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              actionFilter === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => setActionFilter(action)}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                actionFilter === action
                  ? `${actionColorMap[action]} ring-2 ring-offset-2`
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {actionIconMap[action]}
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-blue-600 mb-2">⚙️</div>
            <p className="text-gray-600">Chargement du journal d'audit...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Erreur de chargement: {error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun journal d'audit trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Date/Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Entité</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      <div>
                        <p className="font-semibold">{log.admin_email?.split('@')[0] || 'Inconnu'}</p>
                        <p className="text-xs text-gray-500">{log.admin_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium text-xs ${actionColorMap[log.action_type] || 'bg-gray-100'}`}>
                        {actionIconMap[log.action_type]}
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-mono">{log.entity_type}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{log.entity_name || '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{log.description || '-'}</td>
                    <td className="px-6 py-3 text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-auto">
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Détails de l'action</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-light"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Date/Heure</p>
                  <p className="text-sm font-mono text-gray-900">
                    {new Date(selectedLog.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Admin</p>
                  <p className="text-sm text-gray-900">{selectedLog.admin_email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Action</p>
                  <p className={`text-sm font-semibold inline-block px-2 py-1 rounded ${actionColorMap[selectedLog.action_type]}`}>
                    {selectedLog.action_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Entité</p>
                  <p className="text-sm font-mono text-gray-900">{selectedLog.entity_type}</p>
                </div>
              </div>

              {selectedLog.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Description</p>
                  <p className="text-sm text-gray-900">{selectedLog.description}</p>
                </div>
              )}

              {selectedLog.old_values && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Anciennes valeurs</p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_values && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Nouvelles valeurs</p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAudit;
