export type Role = 'manager' | 'sales' | 'chef' | 'cashier' | 'delivery';

export interface User {
  name: string;
  role: Role;
  currency: string;
  isLoggedIn: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  icon?: string;
  barcode?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  points: number;
  totalPurchases: number;
  registeredDate: string;
  password?: string; // Added for shop authentication
}

export interface Employee {
  id: number;
  name: string;
  role: Role;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  phone?: string;
  address?: string;
  hireDate: string;
}

export interface Recipe {
  id: string; // e.g., 'no1'
  name: string; // e.g., 'Recipe No 1'
  baseChicken: number;
  basePork: number;
  totalBase: number;
  linkedProductId?: number; // ID of the product this recipe produces
}

export interface ProductionPlan {
  id: string;
  timestamp: string;
  items: {
    recipeId: string;
    orderQty: number;
    batches: number;
    chickenNeeded: number;
    porkNeeded: number;
  }[];
  totals: {
    orders: number;
    batches: number;
    chicken: number;
    pork: number;
  };
}

export interface SaleItem extends Product {
  qty: number;
}

export type OrderType = 'dine-in' | 'takeout' | 'delivery';

export interface Sale {
  id: string;
  timestamp: string;
  customerName: string;
  customerId?: number;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'crypto';
  orderType: OrderType;
  currency: string;
}

export interface Settings {
  businessName: string;
  currency: string;
  taxRate: number; // Percentage (e.g., 0.07 for 7%)
  lowStockLevel: number;
  allowCrypto: boolean;
  currencies: string[];
}

export interface ShopCartItem extends Product {
  qty: number;
}