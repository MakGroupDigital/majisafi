import { createClient } from '@supabase/supabase-js';

// Supabase project details
const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDQwMDcsImV4cCI6MjA4ODg4MDAwN30.0vSLjrcYJ1Jz5VUXu_iXiPtalgg5peC2QufWav2ZVbY';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============ CLIENTS API ============

export const clientsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async create(client: any) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'client',
      entity_id: data.id,
      entity_name: data.name,
      new_values: data,
      description: `Client créé: ${data.name}`
    });
    
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: string) {
    // Get client data before deletion
    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    // Log audit
    if (clientData) {
      await auditAPI.log({
        action_type: 'DELETE',
        entity_type: 'client',
        entity_id: id,
        entity_name: clientData.name,
        old_values: clientData,
        description: `Client supprimé: ${clientData.name}`
      });
    }
  },
};

// ============ DEPOTS API ============

export const depotsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('depots')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('depots')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async create(depot: any) {
    const { data, error } = await supabase
      .from('depots')
      .insert([depot])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'depot',
      entity_id: data.id,
      entity_name: data.name,
      new_values: data,
      description: `Dépôt relais créé: ${data.name}`
    });
    
    return data;
  },

  async update(id: string, updates: any) {
    // Get old values first
    const { data: oldData } = await supabase
      .from('depots')
      .select('*')
      .eq('id', id)
      .single();
    
    const { data, error } = await supabase
      .from('depots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'UPDATE',
      entity_type: 'depot',
      entity_id: data.id,
      entity_name: data.name,
      old_values: oldData,
      new_values: data,
      description: `Dépôt relais modifié: ${data.name}`
    });
    
    return data;
  },

  async delete(id: string) {
    // Get depot data before deletion
    const { data: depotData } = await supabase
      .from('depots')
      .select('*')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('depots')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    // Log audit
    if (depotData) {
      await auditAPI.log({
        action_type: 'DELETE',
        entity_type: 'depot',
        entity_id: id,
        entity_name: depotData.name,
        old_values: depotData,
        description: `Dépôt relais supprimé: ${depotData.name}`
      });
    }
  },
};

// ============ STOCK API ============

export const stockAPI = {
  async getAll(depotId?: string) {
    let query = supabase.from('stock_items').select('*');
    
    if (depotId) {
      query = query.eq('depot_id', depotId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getByDepot(depotId: string) {
    const { data, error } = await supabase
      .from('stock_items')
      .select('*')
      .eq('depot_id', depotId)
      .order('product_name');
    
    if (error) throw new Error(error.message);
    return data;
  },

  async create(item: any) {
    const { data, error } = await supabase
      .from('stock_items')
      .insert([item])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'stock',
      entity_id: data.id,
      entity_name: data.product_name || data.productName,
      new_values: data,
      description: `Article de stock créé: ${data.product_name || data.productName}`
    });
    
    return data;
  },

  async update(id: string, updates: any) {
    // Get old values first
    const { data: oldData } = await supabase
      .from('stock_items')
      .select('*')
      .eq('id', id)
      .single();
    
    const { data, error } = await supabase
      .from('stock_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'UPDATE',
      entity_type: 'stock',
      entity_id: data.id,
      entity_name: data.product_name || data.productName,
      old_values: oldData,
      new_values: data,
      description: `Article de stock modifié: ${data.product_name || data.productName}`
    });
    
    return data;
  },

  async delete(id: string) {
    // Get stock data before deletion
    const { data: stockData } = await supabase
      .from('stock_items')
      .select('*')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('stock_items')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    // Log audit
    if (stockData) {
      await auditAPI.log({
        action_type: 'DELETE',
        entity_type: 'stock',
        entity_id: id,
        entity_name: stockData.product_name || stockData.productName,
        old_values: stockData,
        description: `Article de stock supprimé: ${stockData.product_name || stockData.productName}`
      });
    }
  },
};

// ============ SALES API ============

export const salesAPI = {
  async getAll(depotId?: string) {
    let query = supabase
      .from('sales')
      .select('*, clients(*), sale_items(*)');
    
    if (depotId) {
      query = query.eq('depot_id', depotId);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getByDepot(depotId: string) {
    const { data, error } = await supabase
      .from('sales')
      .select('*, clients(*), sale_items(*)')
      .eq('depot_id', depotId)
      .order('date', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async create(sale: any) {
    const { data, error } = await supabase
      .from('sales')
      .insert([sale])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'sale',
      entity_id: data.id,
      entity_name: `Vente ${data.total} FC`,
      new_values: data,
      description: `Vente créée: ${data.total} FC`
    });
    
    return data;
  },

  async createWithItems(sale: any, items: any[]) {
    // First create the sale
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([sale])
      .select()
      .single();
    
    if (saleError) throw new Error(saleError.message);
    
    // Then create the items
    const itemsWithSaleId = items.map(item => ({
      ...item,
      sale_id: saleData.id,
    }));
    
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(itemsWithSaleId);
    
    if (itemsError) throw new Error(itemsError.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'sale',
      entity_id: saleData.id,
      entity_name: `Vente ${saleData.total} FC`,
      new_values: { sale: saleData, items: itemsWithSaleId },
      description: `Vente avec articles créée: ${saleData.total} FC (${items.length} articles)`
    });
    
    return saleData;
  },

  async update(id: string, updates: any) {
    // Get old values first
    const { data: oldData } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();
    
    const { data, error } = await supabase
      .from('sales')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'UPDATE',
      entity_type: 'sale',
      entity_id: data.id,
      entity_name: `Vente ${data.total} FC`,
      old_values: oldData,
      new_values: data,
      description: `Vente modifiée: ${data.total} FC`
    });
    
    return data;
  },

  async delete(id: string) {
    // Get sale data before deletion
    const { data: saleData } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    // Log audit
    if (saleData) {
      await auditAPI.log({
        action_type: 'DELETE',
        entity_type: 'sale',
        entity_id: id,
        entity_name: `Vente ${saleData.total} FC`,
        old_values: saleData,
        description: `Vente supprimée: ${saleData.total} FC`
      });
    }
  },

  async getTotalByPeriod(depotId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('sales')
      .select('total')
      .eq('depot_id', depotId)
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('status', 'completed');
    
    if (error) throw new Error(error.message);
    
    const total = data?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
    return total;
  },
};

// ============ REAL-TIME SUBSCRIPTIONS ============

export const subscribeToSales = (depotId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`sales-${depotId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sales',
        filter: `depot_id=eq.${depotId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToStock = (depotId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`stock-${depotId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'stock_items',
        filter: `depot_id=eq.${depotId}`,
      },
      callback
    )
    .subscribe();
};

// ============ PRODUCTS API ============

export const productsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('size');
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async create(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'product',
      entity_id: data.id,
      entity_name: `${data.name} ${data.size}`,
      new_values: data,
      description: `Produit créé: ${data.name} ${data.size}`
    });
    
    return data;
  },

  async update(id: string, updates: any) {
    // Get old values first
    const { data: oldData } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'UPDATE',
      entity_type: 'product',
      entity_id: data.id,
      entity_name: `${data.name} ${data.size}`,
      old_values: oldData,
      new_values: data,
      description: `Produit modifié: ${data.name} ${data.size}`
    });
    
    return data;
  },

  async delete(id: string) {
    // Get product data before deletion
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    // Log audit
    if (productData) {
      await auditAPI.log({
        action_type: 'DELETE',
        entity_type: 'product',
        entity_id: id,
        entity_name: `${productData.name} ${productData.size}`,
        old_values: productData,
        description: `Produit supprimé: ${productData.name} ${productData.size}`
      });
    }
  },

  async uploadImage(file: File, productId: string) {
    const fileName = `${productId}-${Date.now()}`;
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);
    
    if (uploadError) throw new Error(uploadError.message);
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
  },
};

// ============ AUDIT LOGS API ============

export const auditAPI = {
  async log(params: {
    action_type: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
    entity_type: string;
    entity_id?: string;
    entity_name?: string;
    old_values?: any;
    new_values?: any;
    description?: string;
  }) {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([
        {
          admin_id: userData?.user?.id,
          admin_email: userData?.user?.email,
          action_type: params.action_type,
          entity_type: params.entity_type,
          entity_id: params.entity_id,
          entity_name: params.entity_name,
          old_values: params.old_values,
          new_values: params.new_values,
          description: params.description,
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Audit log error:', error);
      // Don't throw - we don't want to fail the operation if logging fails
    }
    
    return data;
  },

  async getAll(limit = 100, offset = 0) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getByAdmin(adminId: string, limit = 100, offset = 0) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getByAction(actionType: string, limit = 100, offset = 0) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('action_type', actionType)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getByEntity(entityType: string, entityId?: string, limit = 100, offset = 0) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType);
    
    if (entityId) {
      query = query.eq('entity_id', entityId);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw new Error(error.message);
    return data;
  },
};
// ============ LOGISTICS API ============

export const vehiclesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, depots(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async create(vehicle: any) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'vehicle',
      entity_id: data.id,
      entity_name: data.license_plate,
      new_values: data,
      description: `Véhicule créé: ${data.license_plate}`
    });
    
    return data;
  },

  async update(id: string, updates: any) {
    const { data: oldData } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'UPDATE',
      entity_type: 'vehicle',
      entity_id: data.id,
      entity_name: data.license_plate,
      old_values: oldData,
      new_values: data,
      description: `Véhicule modifié: ${data.license_plate}`
    });
    
    return data;
  },

  async delete(id: string) {
    const { data: vehicleData } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    // Log audit
    if (vehicleData) {
      await auditAPI.log({
        action_type: 'DELETE',
        entity_type: 'vehicle',
        entity_id: id,
        entity_name: vehicleData.license_plate,
        old_values: vehicleData,
        description: `Véhicule supprimé: ${vehicleData.license_plate}`
      });
    }
  },
};

export const driversAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('drivers')
      .select('*, depots(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async create(driver: any) {
    const { data, error } = await supabase
      .from('drivers')
      .insert([driver])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'driver',
      entity_id: data.id,
      entity_name: `${data.first_name} ${data.last_name}`,
      new_values: data,
      description: `Chauffeur créé: ${data.first_name} ${data.last_name}`
    });
    
    return data;
  },

  async update(id: string, updates: any) {
    const { data: oldData } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'UPDATE',
      entity_type: 'driver',
      entity_id: data.id,
      entity_name: `${data.first_name} ${data.last_name}`,
      old_values: oldData,
      new_values: data,
      description: `Chauffeur modifié: ${data.first_name} ${data.last_name}`
    });
    
    return data;
  },

  async delete(id: string) {
    const { data: driverData } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    
    // Log audit
    if (driverData) {
      await auditAPI.log({
        action_type: 'DELETE',
        entity_type: 'driver',
        entity_id: id,
        entity_name: `${driverData.first_name} ${driverData.last_name}`,
        old_values: driverData,
        description: `Chauffeur supprimé: ${driverData.first_name} ${driverData.last_name}`
      });
    }
  },
};

export const deliveriesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        depots(name),
        drivers(first_name, last_name, phone),
        vehicles(license_plate, vehicle_type),
        delivery_items(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        depots(name),
        drivers(first_name, last_name, phone),
        vehicles(license_plate, vehicle_type),
        delivery_items(*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async create(delivery: any, items: any[]) {
    // Créer la livraison
    const { data: deliveryData, error: deliveryError } = await supabase
      .from('deliveries')
      .insert([delivery])
      .select()
      .single();
    
    if (deliveryError) throw new Error(deliveryError.message);

    // Créer les articles de livraison
    const itemsWithDeliveryId = items.map(item => ({
      ...item,
      delivery_id: deliveryData.id,
    }));

    const { error: itemsError } = await supabase
      .from('delivery_items')
      .insert(itemsWithDeliveryId);
    
    if (itemsError) throw new Error(itemsError.message);

    // Log audit
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'delivery',
      entity_id: deliveryData.id,
      entity_name: deliveryData.order_id,
      new_values: { delivery: deliveryData, items: itemsWithDeliveryId },
      description: `Livraison créée: ${deliveryData.order_id}`
    });
    
    return deliveryData;
  },

  async updateStatus(id: string, status: string, notes?: string) {
    const updates: any = { status };
    if (notes) updates.notes = notes;
    if (status === 'delivered') updates.actual_delivery_time = new Date().toISOString();

    const { data, error } = await supabase
      .from('deliveries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Log audit
    await auditAPI.log({
      action_type: 'UPDATE',
      entity_type: 'delivery',
      entity_id: data.id,
      entity_name: data.order_id,
      new_values: { status, notes },
      description: `Statut livraison modifié: ${data.order_id} -> ${status}`
    });
    
    return data;
  },
};

export const gpsTrackingAPI = {
  async addLocation(vehicleId: string, deliveryId: string | null, location: {
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    altitude?: number;
    accuracy?: number;
  }) {
    const { data, error } = await supabase
      .from('gps_tracking')
      .insert([{
        vehicle_id: vehicleId,
        delivery_id: deliveryId,
        ...location
      }])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getLatestLocation(vehicleId: string) {
    const { data, error } = await supabase
      .from('gps_tracking')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async getTrackingHistory(vehicleId: string, hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('gps_tracking')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .gte('timestamp', since)
      .order('timestamp', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  },
};