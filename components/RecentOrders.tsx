
import React from 'react';
import { ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Order } from '../types';

const RecentOrders: React.FC = () => {
  const orders: Order[] = [
    { id: '#ORD-7721', date: '12 Oct, 2023', status: 'Delivered', total: 12500, items: '2x 10L, 1x 5L' },
    { id: '#ORD-7719', date: '10 Oct, 2023', status: 'In Progress', total: 8500, items: '1x 10L' },
    { id: '#ORD-7690', date: '05 Oct, 2023', status: 'Delivered', total: 25500, items: '3x 10L' },
  ];

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return { label: 'Livré', style: 'bg-green-50 text-green-600 ring-1 ring-green-100', icon: <CheckCircle size={14} /> };
      case 'In Progress': return { label: 'En cours', style: 'bg-blue-50 text-blue-600 ring-1 ring-blue-100', icon: <Clock size={14} /> };
      case 'Cancelled': return { label: 'Annulé', style: 'bg-red-50 text-red-600 ring-1 ring-red-100', icon: <XCircle size={14} /> };
      default: return { label: status, style: 'bg-slate-50 text-slate-600', icon: null };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Activité Récente</h3>
          <p className="text-slate-500 text-sm font-light">Suivez vos dernières commandes</p>
        </div>
        <button className="text-[#0066CC] font-bold text-sm hover:underline flex items-center gap-1">
          Voir tout <ExternalLink size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Commande</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Articles</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</th>
              <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => {
              const info = getStatusInfo(order.status);
              return (
                <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-5 font-bold text-slate-700 text-sm">{order.id}</td>
                  <td className="py-5 text-slate-500 text-xs">{order.date}</td>
                  <td className="py-5 text-slate-600 font-medium text-xs">{order.items}</td>
                  <td className="py-5 font-bold text-slate-900 text-sm">{order.total.toLocaleString()} <span className="text-[10px]">CDF</span></td>
                  <td className="py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${info.style}`}>
                      {info.icon}
                      {info.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
