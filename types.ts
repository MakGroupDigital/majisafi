
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
