import { useState, useEffect } from 'react';

interface Delivery {
  id: string;
  orderId: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  depotId: string;
  depotName: string;
  driverName: string;
  driverPhone: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  estimatedTime: string;
  actualTime?: string;
  currentLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
  depotLocation: { lat: number; lng: number };
  items: Array<{ name: string; quantity: number; size: string }>;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export const useRealTimeDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Données de démonstration avec positions de Kinshasa
    const mockDeliveries: Delivery[] = [
      {
        id: 'del-001',
        orderId: 'ORD-2024-001',
        clientName: 'Jean Mukendi',
        clientAddress: 'Avenue Kasa-Vubu, Kinshasa',
        clientPhone: '+243 81 234 5678',
        depotId: 'depot-001',
        depotName: 'Dépôt Gombe',
        driverName: 'Pierre Kabila',
        driverPhone: '+243 82 345 6789',
        status: 'in_transit',
        estimatedTime: '14:30',
        currentLocation: { lat: -4.4300, lng: 15.2800 },
        destinationLocation: { lat: -4.4500, lng: 15.2900 },
        depotLocation: { lat: -4.4200, lng: 15.2700 },
        items: [
          { name: 'Maji Safi', quantity: 10, size: '5L' },
          { name: 'Maji Safi', quantity: 5, size: '10L' }
        ],
        totalAmount: 15000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setDeliveries(mockDeliveries);
    setIsLoading(false);

    // Simulation des mises à jour en temps réel
    const interval = setInterval(() => {
      setDeliveries(prev => prev.map(delivery => {
        if (delivery.status === 'in_transit') {
          // Simuler le mouvement du véhicule
          const newLat = delivery.currentLocation.lat + (Math.random() - 0.5) * 0.001;
          const newLng = delivery.currentLocation.lng + (Math.random() - 0.5) * 0.001;
          
          return {
            ...delivery,
            currentLocation: { lat: newLat, lng: newLng },
            updatedAt: new Date().toISOString()
          };
        }
        return delivery;
      }));
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return { deliveries, isLoading };
};