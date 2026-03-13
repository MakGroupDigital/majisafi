
export type BottleSize = '5L' | '10L' | '20L';

export interface CartItem {
  id: string;
  size: BottleSize;
  quantity: number;
  pricePerUnit: number;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  membership: 'Standard' | 'Premium' | 'Enterprise';
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'In Progress' | 'Cancelled';
  total: number;
  items: string;
}

// ============ SUPABASE TYPES ============

// Admin Users
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'manager';
  depot_id?: string;
  created_at: string;
  updated_at: string;
}

// Clients
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  client_type: 'individual' | 'business' | 'distributor';
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

// Depots
export interface DepotRelais {
  id: string;
  name: string;
  location: string;
  phone?: string;
  email?: string;
  manager?: string;
  created_at: string;
  updated_at: string;
}

// Stock Items
export interface StockItem {
  id: string;
  depot_id: string;
  product_name: string;
  brand?: string;
  size?: string;
  milliliters?: number;
  quantity: number;
  quantity_per_package?: number;
  barcode_id?: string;
  price_per_unit: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

// Sales
export interface Sale {
  id: string;
  depot_id: string;
  client_id?: string;
  date: string;
  total: number;
  payment_method: 'cash' | 'card' | 'mobile' | 'check';
  status: 'completed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Sale Items
export interface SaleItem {
  id: string;
  sale_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

// Products
export interface Product {
  id: string;
  name: string;
  size: string;
  description?: string;
  price: number;
  quantity_per_package?: number;
  type: 'unite' | 'paquet';
  image_url?: string;
  product_type?: string;
  created_at: string;
  updated_at: string;
}

// ============ API RESPONSE TYPES ============

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ FORM TYPES ============

export interface CreateClientForm {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  client_type: 'individual' | 'business' | 'distributor';
}

export interface UpdateStockForm {
  product_name: string;
  brand?: string;
  size?: string;
  quantity: number;
  price_per_unit: number;
}

export interface CreateSaleForm {
  depot_id: string;
  client_id?: string;
  items: SaleItemForm[];
  payment_method: 'cash' | 'card' | 'mobile' | 'check';
}

export interface SaleItemForm {
  product_name: string;
  quantity: number;
  unit_price: number;
}
