import { useState, useEffect } from 'react';
import { clientsAPI, depotsAPI, stockAPI, salesAPI, productsAPI, auditAPI, vehiclesAPI, driversAPI, deliveriesAPI } from '../utils/supabase';
import { Client, DepotRelais, StockItem, Sale, Product } from '../types';

// Hook pour récupérer les clients
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await clientsAPI.getAll();
        setClients(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newClient = await clientsAPI.create(client);
      setClients([newClient, ...clients]);
      return newClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updated = await clientsAPI.update(id, updates);
      setClients(clients.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientsAPI.delete(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  return { clients, loading, error, addClient, updateClient, deleteClient };
}

// Hook pour récupérer les dépôts
export function useDepots() {
  const [depots, setDepots] = useState<DepotRelais[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepots = async () => {
      try {
        setLoading(true);
        const data = await depotsAPI.getAll();
        setDepots(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setDepots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepots();
  }, []);

  const addDepot = async (depot: Omit<DepotRelais, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newDepot = await depotsAPI.create(depot);
      setDepots([newDepot, ...depots]);
      return newDepot;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const updateDepot = async (id: string, updates: Partial<DepotRelais>) => {
    try {
      const updated = await depotsAPI.update(id, updates);
      setDepots(depots.map(d => d.id === id ? updated : d));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const deleteDepot = async (id: string) => {
    try {
      await depotsAPI.delete(id);
      setDepots(depots.filter(d => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  return { depots, loading, error, addDepot, updateDepot, deleteDepot };
}

// Hook pour récupérer le stock d'un dépôt
export function useStock(depotId?: string) {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const data = depotId ? await stockAPI.getByDepot(depotId) : await stockAPI.getAll();
        setStock(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setStock([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [depotId]);

  const addStockItem = async (item: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newItem = await stockAPI.create(item);
      setStock([newItem, ...stock]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const updateStockItem = async (id: string, updates: Partial<StockItem>) => {
    try {
      const updated = await stockAPI.update(id, updates);
      setStock(stock.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const deleteStockItem = async (id: string) => {
    try {
      await stockAPI.delete(id);
      setStock(stock.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  return { stock, loading, error, addStockItem, updateStockItem, deleteStockItem };
}

// Hook pour récupérer les ventes
export function useSales(depotId?: string) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const data = depotId ? await salesAPI.getByDepot(depotId) : await salesAPI.getAll();
        setSales(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [depotId]);

  const addSale = async (sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSale = await salesAPI.create(sale);
      setSales([newSale, ...sales]);
      return newSale;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const updateSale = async (id: string, updates: Partial<Sale>) => {
    try {
      const updated = await salesAPI.update(id, updates);
      setSales(sales.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      await salesAPI.delete(id);
      setSales(sales.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  return { sales, loading, error, addSale, updateSale, deleteSale };
}

// Hook pour récupérer les produits
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProduct = await productsAPI.create(product);
      setProducts([newProduct, ...products]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await productsAPI.update(id, updates);
      setProducts(products.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const uploadProductImage = async (file: File, productId: string) => {
    try {
      const imageUrl = await productsAPI.uploadImage(file, productId);
      return imageUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct, uploadProductImage };
}

// Hook pour récupérer les logs d'audit
export function useAuditLogs(action?: string, limit = 100) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        let data;
        if (action) {
          data = await auditAPI.getByAction(action, limit);
        } else {
          data = await auditAPI.getAll(limit);
        }
        setLogs(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [action, limit]);

  return { logs, loading, error };
}
// Hook pour récupérer les véhicules
export function useVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await vehiclesAPI.getAll();
        setVehicles(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const addVehicle = async (vehicle: any) => {
    try {
      const newVehicle = await vehiclesAPI.create(vehicle);
      setVehicles([newVehicle, ...vehicles]);
      return newVehicle;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const updateVehicle = async (id: string, updates: any) => {
    try {
      const updated = await vehiclesAPI.update(id, updates);
      setVehicles(vehicles.map(v => v.id === id ? updated : v));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await vehiclesAPI.delete(id);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  return { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle };
}

// Hook pour récupérer les chauffeurs
export function useDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const data = await driversAPI.getAll();
        setDrivers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const addDriver = async (driver: any) => {
    try {
      const newDriver = await driversAPI.create(driver);
      setDrivers([newDriver, ...drivers]);
      return newDriver;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const updateDriver = async (id: string, updates: any) => {
    try {
      const updated = await driversAPI.update(id, updates);
      setDrivers(drivers.map(d => d.id === id ? updated : d));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      await driversAPI.delete(id);
      setDrivers(drivers.filter(d => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  return { drivers, loading, error, addDriver, updateDriver, deleteDriver };
}

// Hook pour récupérer les livraisons
export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const data = await deliveriesAPI.getAll();
        setDeliveries(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const addDelivery = async (delivery: any, items: any[]) => {
    try {
      const newDelivery = await deliveriesAPI.create(delivery, items);
      // Recharger les données pour avoir les relations
      const data = await deliveriesAPI.getAll();
      setDeliveries(data);
      return newDelivery;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  const updateDeliveryStatus = async (id: string, status: string, notes?: string) => {
    try {
      const updated = await deliveriesAPI.updateStatus(id, status, notes);
      setDeliveries(deliveries.map(d => d.id === id ? { ...d, ...updated } : d));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      throw err;
    }
  };

  return { deliveries, loading, error, addDelivery, updateDeliveryStatus };
}